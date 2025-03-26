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
  console.log("This is error from mongo session store ", err);
});

app.set("trust proxy", 1); // ✅ Needed for secure cookies behind a proxy

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction, // ✅ Secure only in production
    sameSite: isProduction ? "none" : "lax", // ✅ Required for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};

const server = require("https").createServer({
  key: fs.readFileSync("/path/to/privkey.pem"),
  cert: fs.readFileSync("/path/to/fullchain.pem"),
}, app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://heven-hub.site"], // ✅ Correct frontend URL
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

// ✅ CORS Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://heven-hub.site"], // ✅ Correct frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // ✅ Important for cookies & sessions
  })
);

// ✅ Allow Preflight Requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Authorization, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ Session and Passport Setup
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "working" });
});

const hometelRoutes = require("./Routes/hometel")(io);
app.use("/api/listing", hometelRoutes);
app.use("/api/user/", dataRoutes);

const reviewRoutes = require("./Routes/Rewiew")(io);
app.use("/api/review/", reviewRoutes);

const reservRoutes = require("./Routes/reserv")(io);
app.use("/api/reserv/", reservRoutes);

const userRoutes = require("./Routes/user")(io);
app.use("/api/user", userRoutes);

app.get("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.ATLAS_URL)
  .then(() => console.log("Connected! to MongoDB"))
  .catch((err) => console.log(err));

// ✅ Passport Authentication
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const foundUser = await User.findById(id);
    done(null, foundUser);
  } catch (err) {
    done(err, null);
  }
});

// ✅ Socket.io for Real-time Updates
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("userLoggedIn", (userId) => {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    onlineUsers.get(userId).forEach((socketId) => {
      io.to(socketId).emit("authUpdate", {
        userId,
        authenticated: true,
      });
    });
  });

  socket.on("userLoggedOut", (userId) => {
    if (onlineUsers.has(userId)) {
      onlineUsers.get(userId).forEach((socketId) => {
        io.to(socketId).emit("authUpdate", { userId, authenticated: false });
      });
      onlineUsers.delete(userId);
    }
  });

  socket.on("disconnect", (reson) => {
    console.log(`Socket disconnected: ${socket.id}`,reson);
    for (let [userId, sockets] of onlineUsers.entries()) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(userId);
      }
    }
  });
});

// ✅ Start Express Server
server.listen(3030, () => {
  console.log("🚀 Server running on port 3030");
});
