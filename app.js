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
const rateLimit = require('express-rate-limit');

// Import Models & Routes
const User = require("./Models/User");
const Hometel = require("./Models/Hometels");
const dataRoutes = require("./Routes/userData");

const app = express();

// Improved session store configuration
const store = MongoStore.create({
  mongoUrl: process.env.ATLAS_URL,
  crypto: { 
    secret: process.env.SECRET 
  },
  touchAfter: 24 * 3600,
  autoRemove: 'interval',
  autoRemoveInterval: 60 // minutes
});

store.on("error", (err) => {
  console.error("Mongo session store error:", err);
});

app.set("trust proxy", 1);

// Enhanced session options
const sessionOptions = {
  store,
  name: 'heven-hub.sid', // Custom session cookie name
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true, // Reset maxAge on every request
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
};

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const server = http.createServer(app);

// Improved Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: ["https://heven-hub.site" ,"http://localhost:3000"],
    methods: ["GET", "POST", "PATCH"],
    credentials: true
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true
  }
});

// Simplified CORS configuration
app.use(cors({
  origin: ["https://heven-hub.site" ,"http://localhost:3000"],
  credentials: true,
  exposedHeaders: ['set-cookie']
}));

// Session and Passport setup
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Routes
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

// MongoDB Connection with improved settings
mongoose.connect(process.env.ATLAS_URL, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

// Passport configuration
passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, User.authenticate()));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password -__v');
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Enhanced Socket.IO implementation
const onlineUsers = new Map();
const socketAuthLimits = new Map();

io.use((socket, next) => {
  // Add rate limiting for socket events
  const ip = socket.handshake.address;
  const limit = socketAuthLimits.get(ip) || 0;
  
  if (limit > 5) { // Max 5 auth events per minute per IP
    return next(new Error('Too many auth requests'));
  }
  
  socketAuthLimits.set(ip, limit + 1);
  setTimeout(() => {
    const current = socketAuthLimits.get(ip) || 0;
    socketAuthLimits.set(ip, Math.max(0, current - 1));
  }, 60000);
  
  next();
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Throttle auth updates
  let lastAuthUpdate = 0;
  
  socket.on("userLoggedIn", (userId) => {
    const now = Date.now();
    if (now - lastAuthUpdate < 5000) return; // 5 second cooldown
    
    lastAuthUpdate = now;
    
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);
    
    // Only emit to this socket, not all sockets for the user
    socket.emit("authUpdate", {
      userId,
      authenticated: true
    });
  });

  socket.on("userLoggedOut", (userId) => {
    if (onlineUsers.has(userId)) {
      onlineUsers.get(userId).delete(socket.id);
      if (onlineUsers.get(userId).size === 0) {
        onlineUsers.delete(userId);
      }
    }
    socket.emit("authUpdate", { userId, authenticated: false });
  });

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected (${reason}):`, socket.id);
    for (const [userId, sockets] of onlineUsers.entries()) {
      if (sockets.delete(socket.id) && sockets.size === 0) {
        onlineUsers.delete(userId);
      }
    }
  });
});

// Server startup
server.listen(process.env.PORT || 3030, () => {
  console.log(`Server running on port ${process.env.PORT || 3030}`);
});

// Cleanup on server shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});