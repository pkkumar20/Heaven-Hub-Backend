const express = require("express");
const router = express.Router();
const passport = require("passport");
const user = require("../Models/User");
const hometels = require("../Models/Hometels");
const review = require("../Models/Reviews");
const mongoose = require("mongoose");
const { storage } = require("../cloudConfig");
const multer = require("multer");
const { checkConvertReview, isLoggedIn } = require("../middlewares");
const upload = multer({ storage });
module.exports = (io) => {
  router.post("/create", isLoggedIn, upload.none(), async (req, res) => {
    const { rating, comment, hometelId } = req.body;
    try {
      const Hometel = await hometels.findById(hometelId);
      if (Hometel === null) {
        return res.status(400).json({ message: "Hometel not found" });
      }
      const User = await user.findById(req.user._id);
      const newReview = new review(req.body);
      newReview.createdAt = Date.now();
      newReview.createdFor = hometelId;
      newReview.createdBy = req.user._id;
      await newReview.save();
      Hometel.reviews.push(newReview._id);
      await Hometel.save();
      User.reviews.push(newReview._id);
      await User.save();
      const populatedUser = await User.populate({
        path: "reviews",
        populate: { path: "createdBy", select: "fullname email _id" },
      });
      let nnReview = await newReview.populate({
        path: "createdBy",
        select: "fullname email _id",
      });
      io.emit("reviewAdded", {
        userId: req.user._id,
        reviews: populatedUser.reviews,
      });
      res.status(200).json({
        message: "Review created sucessfully",
        reviews: populatedUser.reviews,
      });
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  });
  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid Review ID", redirectUrl: `/` });
    }

    try {
      const Review = await review.find({ createdFor: id }).populate({
        path: "createdBy",
        select: "fullname email _id",
      });

      res.status(200).json({ success: true, review: Review });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  router.delete("/:id", upload.none(), isLoggedIn, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid Review ID", redirectUrl: `/` });
    }
    if (req.params.id !== null && req.params.id !== undefined) {
      try {
        const Review = await review.findById(req.params.id);
        if (Review === null) {
          return res.status(400).json({ message: "Review not found" });
        }
        const User = await user.findById(Review.createdBy);
        if (User === null) {
          return res
            .status(400)
            .json({ message: "User with this review not found" });
        }
        let isOwner = User._id.equals(req.user._id);
        if (isOwner === true) {
          const Hometel = await hometels.findById(Review.createdFor);
          if (Hometel === null) {
            return res
              .status(400)
              .json({ message: "Hometel with this review not found" });
          }
          await review.findByIdAndDelete(req.params.id);
          Hometel.reviews = Hometel.reviews.filter(
            (id) => id.toString() !== req.params.id
          );
          await Hometel.save();
          User.reviews = User.reviews.filter(
            (id) => id.toString() !== req.params.id
          );
          await User.save();
          const populatedUser = await User.populate({
            path: "reviews",
            populate: { path: "createdBy", select: "fullname email _id" },
          });
          io.emit("reviewAdded", {
            userId: req.user._id,
            reviews: populatedUser.reviews,
          });
          res.status(200).json({
            message: "Review Deleted sucessfully",
            reviews: populatedUser.reviews,
          });
        } else {
          return res
            .status(400)
            .json({ message: "You not created this review" });
        }
      } catch (err) {
        return res.status(400).json({ message: err });
      }
    }
  });
  return router; // Make sure to export the router
};
