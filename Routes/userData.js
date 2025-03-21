const express = require("express");
const router = express.Router();
const user = require("../Models/User");
const hometels = require("../Models/Hometels");
const review = require("../Models/Reviews");
const mongoose = require("mongoose");
const {
  priceConvert,
  validateListing,
  convertPhone,
  convertUser,
  changePass,
  isLoggedIn,
} = require("../middlewares");
// get all
router.get("/data/:id", isLoggedIn, async (req, res) => {
  let id = req.params.id;
  // Validate if ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ message: "Invalid User ID", redirectUrl: `/` });
  }
  try {
    const User = await user.findById(id);
    if (User === null) {
      res.status(404).json({ sucess: "false", message: "User not found" });
    }
    const Hometel = await hometels.find({ owner: User._id });
    const Review = await review.find({ createdBy: User._id });
    res.status(200).json({
      sucess: "true",
      hometels: Hometel,
      reviews: Review,
      favorite: User.favoriteHometels,
    });
  } catch (err) {
    res
      .status(400)
      .json({ sucess: "false", message: "User not found or wrong user id" });
  }
});
// get favorites all
router.get("/favorite/:id", isLoggedIn, async (req, res) => {
  let id = req.params.id;
  // Validate if ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ message: "Invalid User ID", redirectUrl: `/` });
  }
  try {
    const User = await user.findById(id);
    if (User === null) {
      res.status(404).json({ sucess: "false", message: "User not found" });
    }
    const Hometel = await hometels.find({
      _id: { $in: User.favoriteHometels },
    });
    res.status(200).json({
      sucess: "true",
      favorite: Hometel,
    });
  } catch (err) {
    res
      .status(400)
      .json({ sucess: "false", message: "User not found or wrong user id" });
  }
});
// get is favorite
router.get("/favorite/:UserId/:HometelId", isLoggedIn, async (req, res) => {
  let UserId = req.params.UserId;
  let HometelId = req.params.HometelId;
  try {
    const User = await user.findById(UserId);
    if (User === null) {
      res.status(404).json({ sucess: "false", message: "User not found" });
    }
    if (User.favoriteHometels.includes(HometelId)) {
      return res.status(200).json({
        sucess: "true",
        isVavorite: true,
      });
    } else {
      return res.status(200).json({
        sucess: "true",
        isVavorite: false,
      });
    }
  } catch (err) {
    res
      .status(400)
      .json({ sucess: "false", message: "User not found or wrong user id" });
  }
});
// get hometels
router.get("/hometels/:id", isLoggedIn, async (req, res) => {
  let id = req.params.id;
  // Validate if ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ message: "Invalid User ID", redirectUrl: `/` });
  }
  try {
    const User = await user.findById(id);
    if (User === null) {
      res.status(404).json({ sucess: "false", message: "User not found" });
    }
    const Hometel = await hometels.find({ owner: User._id });
    res.status(200).json({
      sucess: "true",
      hometels: Hometel,
    });
  } catch (err) {
    res
      .status(400)
      .json({ sucess: "false", message: "User not found or wrong user id" });
  }
});
// get reviews
router.get("/reviews/:id", isLoggedIn, async (req, res) => {
  let id = req.params.id;
  // Validate if ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ message: "Invalid User ID", redirectUrl: `/` });
  }
  try {
    const User = await user.findById(id);
    if (User === null) {
      res.status(404).json({ sucess: "false", message: "User not found" });
    }
    const Review = await review.find({ createdBy: User._id }).populate({
      path: "createdBy",
      select: "fullname email _id",
    });
    res.status(200).json({
      sucess: "true",
      reviews: Review,
    });
  } catch (err) {
    res
      .status(400)
      .json({ sucess: "false", message: "User not found or wrong user id" });
  }
});
module.exports = router;
