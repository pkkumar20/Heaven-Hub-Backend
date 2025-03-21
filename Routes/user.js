const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const user = require("../Models/User");
const userModel = require("../Models/User");
const hometels = require("../Models/Hometels");
const review = require("../Models/Reviews");
const reserv = require("../Models/Reserv");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { storage } = require("../cloudConfig");
const multer = require("multer");
const upload = multer({ storage });
const nodemailer = require("nodemailer");
const { resetPassEmailOtp, newUseremailOtp } = require("../emailMiddleware");
// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail's SMTP service
  auth: {
    user: process.env.GMAIL, // Your email address
    pass: process.env.PASSWORD, // Your email password (consider using OAuth for security)
  },
});
const {
  priceConvert,
  validateListing,
  convertPhone,
  convertUser,
  changePass,
  isLoggedIn,
} = require("../middlewares");
const { date } = require("joi");
module.exports = (io) => {
  const router = express.Router();
  // Authentication check route
  router.get("/check", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.json({ authenticated: false, user: null });
    }

    try {
      // ✅ Re-fetch user from the database with populated fields
      const userData = await user
        .findById(req.user._id)
        .populate("hometels") // Example: Populate favorites
        .populate("reservations") // Example: Populate bookings
        .populate({
          path: "reviews",
          populate: { path: "createdBy", select: "fullname email _id" },
        }) // Example: Populate bookings
        .populate("favoriteHometels") // Example: Populate bookings
        .exec();
      res.json({ authenticated: true, user: userData });
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({
        authenticated: false,
        user: null,
        error: "Internal Server Error",
      });
    }
  });
  router.put(
    "/change-pass",
    upload.none(),
    isLoggedIn,
    changePass,
    async (req, res) => {
      let { oldPassword, newPassword, email, id } = req.body;
      try {
        // Find the user
        const User = await user.findById(id);
        if (!User) {
          return res.status(404).json({ message: "User not found" });
        }

        // Verify current password
        User.authenticate(oldPassword, (err, authenticated, reason) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error verifying password" });
          }
          if (!authenticated) {
            return res
              .status(401)
              .json({ message: "Incorrect current password" });
          }

          // Update password
          User.setPassword(newPassword, async (err) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Error setting new password" });
            }

            // Save user
            await User.save();
            res.json({ message: "Password changed successfully" });
          });
        });
      } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
      }
    }
  );
  router.post("/signup", upload.none(), convertPhone, async (req, res) => {
    let userDetails = {
      fullname: req.body.fullname,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      gender: req.body.gender,
      username: req.body.email,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      streetAddress: req.body.streetAddress,
    };
    try {
      const userData = await user.findOne({ email:userDetails.email });
      if (userData !== null) {
        res.status(400).json({
          message: "The email has already been taken.",
        });
      } else {
        const otp = Math.floor(10000 + Math.random() * 90000);
        const token = jwt.sign( {email:userDetails.email} , "Pk@2092004", {
          expiresIn: "10m",
        });
        userDetails.emailVerifyOtp = otp;
        
        const newUser = await user.register(userDetails, req.body.password);
        let mailOptions = newUseremailOtp(userDetails.email, otp);
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(404).json({
              message: "Error sending OTP",
            });
          }
          res.status(200).json({ status: "ok", token: token });
        });
      }
    } catch (err) {
      console.log(err)
      res
        .status(400)
        .json({ message: "Internal server error", err: err.message });
    }
  });
  router.post("/resendotp", upload.none(), async (req, res) => {
    let email = req.body.email;
    let type = req.body.type;
    let User = await user.findOne({ email: email });
    if (User) {
      if (type === "forget") {
        const otp = crypto.randomInt(10000, 99999);
        const otpExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        User.resetPasswordOTP = otp;
        User.resetPasswordExpires = otpExpires;
        await User.save();
        let mailOptions = resetPassEmailOtp(email, otp, User.fullname);
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(404).json({
              message: "Error sending OTP",
            });
          }
          res.status(200).json({ status: "ok" });
        });
      } else {
        try {
          jwt.verify(req.body.token, "Pk@2092004");
          const otp = crypto.randomInt(10000, 99999);
          const token = jwt.sign({ email }, "Pk@2092004", {
            expiresIn: "10m",
          });
          User.emailVerifyOtp = otp;
          await User.save();
          let mailOptions = newUseremailOtp(email, otp);
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.status(404).json({
                message: "Error sending OTP",
              });
            }
            res.status(200).json({ status: "ok", token: token });
          });
        } catch (err) {}
      }
    } else {
      res.status(404).json({ status: "error", message: "User not found" });
    }
  });
  router.post("/signup/verify", upload.none(), async (req, res) => {
    try {
      let User = await user.findOne({ email: req.body.email });
      if (User.emailVerifyOtp == req.body.Otp) {
        User.isEmailVerified = true;
        User.emailVerifyOtp = undefined;
        await User.save();
        req.login(User, async (err) => {
          if (err) {
            console.error("Error during login after signup:", err);
            return res.status(500).json({
              success: false,
              message: "Somthing went wrong",
            });
          }
          req.session.save((err) => {
            if (err) {
              console.error("Session Save Error:", err);
              return res.status(500).json({ error: "Session not saved" });
            }
          });
          try {
            // ✅ Re-fetch user with populated fields
            const populatedUser = await userModel
              .findById(User._id)
              .populate("hometels") // Example: Populate favorites
              .populate("reservations") // Example: Populate bookings
              .populate({
                path: "reviews",
                populate: { path: "createdBy", select: "fullname email _id" },
              }) // Example: Populate bookings
              .populate("favoriteHometels") // Example: Populate bookings
              .exec();

            // ✅ Emit socket event after successful login
            io.emit("userLoggedIn", { userId: user._id });

            res.json({
              message: "You sign up sucessfully",
              user: populatedUser,
              redirectUrl: "/dashboard",
            });
          } catch (err) {
            console.error("Error populating user data:", err);
            res.status(500).json({ message: "Failed to retrieve user data" });
          }
        });
      } else {
        res.status(400).json({ message: "Please enter correct otp" });
      }
    } catch (err) {
      res
        .status(400)
        .json({ message: "Internal server error", err: err.message });
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      const { username, password } = req.body;

      // Find user by username
      const foundUser = await user.findOne({ username });
      if (!foundUser) {
        return res.status(400).json({ message: "No user found" });
      }

      // Check if email is verified
      if (!foundUser.isEmailVerified) {
        return res
          .status(400)
          .json({ message: "Please verify your email first" });
      }

      // Use Passport to authenticate
      passport.authenticate("local", async (err, user, info) => {
        if (err)
          return res.status(500).json({ message: "Internal server error" });
        if (!user)
          return res
            .status(401)
            .json({ message: info?.message || "Unauthorized" });

        req.logIn(user, async (err) => {
          if (err) return res.status(500).json({ message: "Login failed" });

          try {
            // ✅ Re-fetch user with populated fields
            const populatedUser = await userModel
              .findById(user._id)
              .populate("hometels") // Example: Populate favorites
              .populate("reservations") // Example: Populate bookings
              .populate({
                path: "reviews",
                populate: { path: "createdBy", select: "fullname email _id" },
              }) // Example: Populate bookings
              .populate("favoriteHometels") // Example: Populate bookings
              .exec();

            // ✅ Emit socket event after successful login
            io.emit("userLoggedIn", { userId: user._id });

            res.json({
              message: "Logged in successfully",
              user: populatedUser,
            });
          } catch (err) {
            console.error("Error populating user data:", err);
            res.status(500).json({ message: "Failed to retrieve user data" });
          }
        });
      })(req, res, next);
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // logout
  router.get("/logout", (req, res) => {
    try {
      if (req.isAuthenticated()) {
        const userId = req.user._id.toString();

        req.logout((err) => {
          if (err) {
            return res
              .status(400)
              .json({ success: false, message: "Logout failed" });
          }
          io.emit("authUpdate", { userId, authenticated: false });
          res.clearCookie("connect.sid");
          res.status(200).json({
            success: true,
            message: "You logged out successfully",
            redirectUrl: "/",
          });
        });
      } else {
        res.status(400).json({ message: "User not logged in" });
      }
    } catch (err) {
      res
        .status(400)
        .json({ message: "Internal server error", err: err.message });
    }
  });
  router.post("/logout", (req, res) => {
    const userId = req.user.id;
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      io.emit("authUpdate", { userId, authenticated: false });
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });
  router.post(
    "/reset-password",
    upload.none(),
    changePass,
    async (req, res) => {
      let { email } = req.body;
      if (!email) {
        return res
          .status(400)
          .json({ success: false, message: "Email is required" });
      }
      try {
        const User = await user.findOne({ email: email });
        if (User) {
          if (User.isEmailVerified === true) {
            // Generate OTP
            const otp = crypto.randomInt(10000, 99999);
            const otpExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
            const userName = User.fullname;
            // Save OTP to user record
            User.resetPasswordOTP = otp;
            User.resetPasswordExpires = otpExpires;
            await User.save();
            let mailOptions = resetPassEmailOtp(email, otp, userName);
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return res.status(404).json({
                  message: "Error sending OTP",
                });
              }
              res.status(200).json({ status: "ok" });
            });
          } else {
            return res
              .status(403)
              .json({ success: false, message: "Email is not verified" });
          }
        } else {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "error",
        });
      }
    }
  );
  router.put("/reset-password", upload.none(), async (req, res) => {
    try {
      let User = await user.findOne({ email: req.body.email });
      if (User) {
        if (User.isEmailVerified === true) {
          if (
            User.resetPasswordOTP === undefined &&
            User.resetPasswordExpires === undefined
          ) {
            return res.status(400).json({ message: "Somthing Went Wrong" });
          }
          if (
            User.resetPasswordOTP != req.body.Otp ||
            User.resetPasswordExpires < Date.now()
          ) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
          } else {
            User.resetPasswordOTP = undefined;
            User.resetPasswordExpires = undefined;
            await User.save();
            return res.status(200).json({ status: "ok" });
          }
        } else {
          return res.status(400).json({ message: "Email is not verified" });
        }
      } else {
        return res.status(400).json({ message: "User not found" });
      }
    } catch (err) {
      res
        .status(400)
        .json({ message: "Internal server error", err: err.message });
    }
  });
  // update user
  router.patch(
    "/update",
    upload.none(),
    isLoggedIn,
    convertPhone,
    async (req, res) => {
      if (req.body.id == req.user._id.toString()) {
        let data = req.body;
        delete data.id;
        try {
          let updateUser = await user
            .findByIdAndUpdate(req.user._id.toString(), data, { new: true })
            .populate("hometels") // Example: Populate favorites
            .populate("reservations") // Example: Populate bookings
            .populate({
              path: "reviews",
              populate: { path: "createdBy", select: "fullname email _id" },
            }) // Example: Populate bookings
            .populate("favoriteHometels") // Example: Populate bookings
            .exec();
          res.status(200).json({
            redirectUrl: `/dashboard/personal-info`,
            success: true,
            message: "Details updated sucessfully",
            user: updateUser,
          });
        } catch (err) {
          res.status(400).json({
            redirectUrl: `/dashboard/personal-info`,
            success: false,
            message: "Error during Updating details  ",
          });
        }
      } else {
        res.status(400).json({
          message: "Please Login with Same account to update personal details",
        });
      }
    }
  );
  router.patch("/reset-password", upload.none(), async (req, res) => {
  let User = await user.findOne({ email: req.body.email });
  if (!User) {
    return res.status(400).json({ message: "User not found" });
  }

  if (!User.isEmailVerified) {
    return res.status(400).json({ message: "Email not verified" });
  }

  try {
    User.setPassword(req.body.password, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Error setting new password" });
      }

      // Clear OTP fields
      User.resetPasswordOTP = undefined;
      User.resetPasswordExpires = undefined;
      await User.save();
        return res.status(200).json({ message: "Password reset successfully" });
    });
  } catch (err) {
    return res.status(500).json({ message: "Error resetting password", err });
  }
});

  // get favorite hometels
  router.get("/favorite", upload.none(), isLoggedIn, async (req, res) => {
    try {
      const User = await user.findById(req.user._id);
      if (User !== null) {
        res.status(200).json(User.favoriteHometels);
      } else {
        return res.status(402).json({ message: "User not found" });
      }
    } catch (err) {
      return res.status(400).json({ message: "Somthing went wrong" });
    }
  });
  // add favorite hometels
  router.post("/favorite/add", upload.none(), isLoggedIn, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(req.body.hometelId)) {
      return res.status(400).json({ message: "Invalid Hometel ID" });
    }
    try {
      let User = await user.findById(req.body.userId);
      let Hometels = await hometels.findById(req.body.hometelId);

      if (User === null && Hometels === null) {
        return res.status(400).json({ message: "User or Hometel not found" });
      } else {
        let newUser = await user
          .findByIdAndUpdate(
            req.body.userId,
            { $addToSet: { favoriteHometels: Hometels._id } }, // Prevents duplicates
            { new: true }
          )
          .populate("favoriteHometels");
        // Emit real-time update to all browsers where user is logged in
        io.emit("favoriteUpdated", {
          userId: req.body.userId,
          favorites: newUser.favoriteHometels,
        });
        res.status(200).json({
          message: "Added to Favorites",
          favorites: newUser.favoriteHometels,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: err });
    }
  });
  // remove favorite hometels
  router.post(
    "/favorites/remove",
    upload.none(),
    isLoggedIn,
    async (req, res) => {
      if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
      }
      if (!mongoose.Types.ObjectId.isValid(req.body.hometelId)) {
        return res.status(400).json({ message: "Invalid Hometel ID" });
      }
      try {
        // Find User & Hometel
        const User = await user.findById(req.body.userId);
        const Hometel = await hometels.findById(req.body.hometelId);

        // If either user or hometel does not exist
        if (!User || !Hometel) {
          return res.status(400).json({ message: "User or Hometel not found" });
        }

        // Remove Hometel from user's favorites
        const updatedUser = await user
          .findByIdAndUpdate(
            req.body.userId,
            { $pull: { favoriteHometels: req.body.hometelId } }, // Removes the hometel ID
            { new: true }
          )
          .populate("favoriteHometels");
        // Emit real-time update to all browsers where user is logged in
        io.emit("favoriteUpdated", {
          userId: req.body.userId,
          favorites: updatedUser.favoriteHometels,
        });
        res.status(200).json({
          message: "Removed from Favorites",
          favorites: updatedUser.favoriteHometels,
        });
      } catch (error) {
        console.error("Error removing favorite:", error);
        res
          .status(500)
          .json({ message: "Internal server error", error: error.message });
      }
    }
  );
  // delete user

  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Validate if ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid User ID" });
      }

      // Find the user
      const foundUser = await user.findById(id);
      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }
      // Pull out all reservation IDs from Hometel
      await hometels.updateMany(
        { reservations: { $exists: true } },
        { $pull: { reservations: { $in: foundUser.reservations } } }
      );
      // Step 2: Delete all reservations related to this user
      await reserv.deleteMany({ _id: { $in: foundUser.reservations } });
      // Delete associated reviews
      if (foundUser.reviews && foundUser.reviews.length > 0) {
        await review.deleteMany({ _id: { $in: foundUser.reviews } });
      }

      // Delete associated hometels
      await hometels.deleteMany({ owner: id });

      // Destroy session if the logged-in user is deleted
      if (req.user && req.user._id.toString() === id) {
        req.logout((err) => {
          if (err) return res.status(500).json({ message: "Logout failed" });

          req.session.destroy((err) => {
            if (err)
              return res
                .status(500)
                .json({ message: "Session destruction failed" });
          });
        });
      }
      // Delete the user
      const delUser = await user.findByIdAndDelete(id);
      res.status(200).json({ message: "User Deleted Sucessfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return router;
};
