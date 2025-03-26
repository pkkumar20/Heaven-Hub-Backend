require("dotenv").config();
const isProduction = process.env.NODE_ENV === "production";
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const { Server } = require("socket.io");

// Import Models & Routes
const User = require("./Models/User");
const Hometel = require("./Models/Hometels");
const dataRoutes = require("./Routes/userData");

const app = express();
const store = MongoStore.create({
  mongoUrl: process.env.ATLAS_URL,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Mongo session store error:", err);
});

app.set("trust proxy", 1);

// Define allowed origins for both environments
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", 
  "https://heven-hub.site",
  "https://www.heven-hub.site",
  "https://api.heven-hub.site"
];

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: isProduction ? ".heven-hub.site" : undefined
  },
};

const server = http.createServer(app);

// Configure Socket.IO with all allowed origins
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

// Enhanced CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

// Handle preflight requests
app.options("*", cors());

// Session and Passport setup
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is working" });
});

// Initialize routes with Socket.IO
const hometelRoutes = require("./Routes/hometel")(io);
app.use("/api/listing", hometelRoutes);
app.use("/api/user/", dataRoutes);

const reviewRoutes = require("./Routes/Rewiew")(io);
app.use("/api/review/", reviewRoutes);

const reservRoutes = require("./Routes/reserv")(io);
app.use("/api/reserv/", reservRoutes);

const userRoutes = require("./Routes/user")(io);
app.use("/api/user", userRoutes);

// 404 handler
app.get("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// MongoDB Connection
mongoose.connect(process.env.ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.log("MongoDB connection error:", err));

// Passport Configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Socket.IO Real-time Implementation
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("userLoggedIn", (userId) => {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);
    
    // Emit only to this socket
    socket.emit("authUpdate", { authenticated: true });
  });

  socket.on("userLoggedOut", (userId) => {
    if (onlineUsers.has(userId)) {
      onlineUsers.get(userId).delete(socket.id);
      if (onlineUsers.get(userId).size === 0) {
        onlineUsers.delete(userId);
      }
    }
    socket.emit("authUpdate", { authenticated: false });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    for (const [userId, sockets] of onlineUsers.entries()) {
      if (sockets.delete(socket.id) && sockets.size === 0) {
        onlineUsers.delete(userId);
      }
    }
  });
});

// Start Server
const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  server.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});