require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const { Server } = require("socket.io");
// Import Models & Routes
const User = require("./Models/User");
const Hometel = require("./Models/Hometels");
const dataRoutes = require("./Routes/userData");
const hometels = require("./Models/Hometels");

const app = express();
const store = MongoStore.create(
  {
    mongoUrl: process.env.ATLAS_URL,
    crypto: {
      secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
  }
);
store.on("error", () => {
  console.log("This is error from mongo session store ",err)
})
const sessionOptions = {
  store,
  secret: process.env.SECRET,
    resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 + 1000,
    maxAge: 7 * 24 * 60 * 60 + 1000,
    httpOnly:true,
  }
}
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
  "https://heaven-hub-frontend-1.onrender.com",
  "https://heaven-hub.site",
], // ✅ React frontend (Update if different)
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

app.use(cors({ origin: [
  "https://heaven-hub-frontend-1.onrender.com",
  "https://heaven-hub.site",
], credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session(sessionOptions)
);
app.use(passport.initialize());
app.use(passport.session());
// Routes
// hometels routes
app.get("/", (req, res) => {
  res.status(200).json({message:"working"})
})
const hometelRoutes = require("./Routes/hometel")(io);
app.use("/api/listing", hometelRoutes);
app.use("/api/user/", dataRoutes);
// review Routes
const reviewRoutes = require("./Routes/Rewiew")(io);
app.use("/api/review/", reviewRoutes);
// reservRoutes
const reservRoutes = require("./Routes/reserv")(io);
app.use("/api/reserv/", reservRoutes);
// user Routes
const userRoutes = require("./Routes/user")(io); // ✅ Pass io when requiring
app.use("/api/user", userRoutes);
app.get("*", (req, res) => {
  res.status(404).json({
    message:"Route not found"
  })
})
// MongoDB Connection
mongoose
  .connect(process.env.ATLAS_URL)
  .then(() => console.log("Connected! to mongodb"))
  .catch((err) => console.log(err));

// Passport Local Strategy
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
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("userLoggedIn", (userId) => {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);
    
    // ✅ Emit only to the specific user's sockets
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

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    for (let [userId, sockets] of onlineUsers.entries()) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(userId);
      }
    }
  });
});


// Start Express Server
server.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
