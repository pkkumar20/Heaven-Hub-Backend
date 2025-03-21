const express = require("express");
const user = require("../Models/User");
const hometels = require("../Models/Hometels.js");
const review = require("../Models/Reviews.js");
const reserv = require("../Models/Reserv.js");
const mongoose = require("mongoose");
const { storage } = require("../cloudConfig");
const multer = require("multer");
const upload = multer({ storage });
const mapServices = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mapServices({
  accessToken: process.env.MAP_ACESS_TOKEN,
});
const errorHandler = require("../utils/errorHandler.js");
const {
  priceConvert,
  validateListing,
  convertPhone,
  convertUser,
  emailOtp,
  isLoggedIn,
  isOwner,
} = require("../middlewares.js");
module.exports = (io) => {
  const router = express.Router();
  router.get("/home", async (req, res) => {
    try {
      const data = await hometels.find().populate("reviews");
      res.status(200).json({ success: true, hometels: data });
    } catch (error) {
      console.error("Error fetching Hometels:", error);
      res.status(500).json({ message: "Error fetching Hometels" });
    }
  });
  router.get("/new", isLoggedIn, async (req, res) => {
    res
      .status(200)
      .json({ success: true, authenticated: true, redirectUrl: "/new" });
  });
  router.post(
    "/new",
    isLoggedIn,
    upload.single("image"),
    priceConvert,
    validateListing,
    async (req, res) => {
      let data = req.body.listing;
      let url = req.file.path;
      let responce = await geocodingClient
        .forwardGeocode({
          query: `${data.streetAddress},${data.city.name},${data.state.name},${data.country.name},`,
          limit: 1,
        })
        .send();
      data.geometry = responce.body.features[0].geometry;
      let filename = req.file.filename;
      let saveListing = new hometels(data);
      saveListing.image = { url, filename };
      saveListing.owner = req.user._id;
      const User = await user.findById(req.user._id);
      User.hometels.push(saveListing._id);
      await User.save();
      const newUser = await User.populate("hometels");
      let savedListing = await saveListing.save();
        io.emit("hometelUpdated", {
          userId: req.user._id,
          hometels: newUser.hometels,
        });
      res.json({
        redirectUrl: `/view/${savedListing._id}`,
        success: true,
        message: "Your Hometels Added Successfully.",
        hometels: newUser.hometels
      });
    }
  );
  // find hometels
  router.get("/search", async (req, res) => {
    if (req.query.area == "category") {
      try {
        const Hometel = await hometels.find({
          category: req.query.key,
        });
        res.status(200).json({
          success: true,
          hometel: Hometel,
        });
      } catch (err) {
        res.status(404).json({
          redirectUrl: `/`,
          success: false,
          message: "Error searching Hometels by catageory",
        });
      }
    } else {
      const searchKeyword = req.query.key.toLowerCase(); // Convert to lowercase for case-insensitive search
      const allData = await hometels.find();
      const keysToSearch = ["title", "description", "streetAddress"];

      const filteredData = allData.filter(
        (item) =>
          // Search in direct fields
          keysToSearch.some((key) =>
            item[key]?.toString().toLowerCase().includes(searchKeyword)
          ) ||
          // Search in nested objects (country.name, state.name, city.name)
          ["country", "state", "city"].some((nestedKey) =>
            item[nestedKey]?.name?.toLowerCase().includes(searchKeyword)
          ) ||
          // Search in array (category)
          item.category.some((cat) =>
            cat.toLowerCase().includes(searchKeyword)
          ) ||
          // Search in price (Exact match)
          item.price?.toString() === searchKeyword
      );
      res.status(200).json({
        success: true,
        hometel: filteredData,
      });
    }
  });
  router.get("/view/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const id = req.params.id;
      // Validate if ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ message: "Invalid Hometel ID", redirectUrl: `/` });
      }
      const data = await hometels
        .findById(id)
        .populate({
          path: "reviews",
          populate: { path: "createdBy", select: "fullname email _id" },
        })
        .populate({
          path: "owner",
          select: "fullname email _id",
        })
        .populate({
          path: "reservations",
        })
        .exec();
      if (data === null) {
        res.status(400).json({
          redirectUrl: `/`,
          success: false,
          message: "Hometel not found",
        });
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      console.error("Error fetching Hometels by ID :", error);
      res.status(404).json({
        redirectUrl: `/`,
        success: false,
        message: "Error fetching Hometels by ID",
      });
    }
  });
  router.get("/update/:id", isLoggedIn, isOwner, async (req, res) => {
    try {
      const id = req.params.id;
      // Validate if ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ message: "Invalid Hometel ID", redirectUrl: `/` });
      }
      const data = await hometels.findById(id).lean(); // Use lean to get a plain JS object
      if (!data) {
        return res.status(400).json({
          redirectUrl: `/update/${id}`,
          success: false,
          message: "Error fetching Hometels by ID",
        });
      }

      // Exclude unwanted keys
      const { _id, __v, reviews, owner, geometry, ...filteredData } = data;
      res.status(200).json(filteredData); // Send the cleaned data to the frontend
    } catch (error) {
      console.error("Error fetching Hometels by ID:", error);
      res.status(404).json({
        redirectUrl: `/`,
        success: false,
        message: "Error fetching Hometels by ID",
      });
    }
  });

  router.put(
    "/update/:id",
    isLoggedIn,
    upload.single("image"),
    isLoggedIn,
    isOwner,
    priceConvert,
    async (req, res) => {
      const id = req.params.id;
      // Validate if ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ message: "Invalid Hometel ID", redirectUrl: `/` });
      }
           try {
         const data = req.body.listing;
      let responce = await geocodingClient
        .forwardGeocode({
          query: `${data.streetAddress},${data.city.name},${data.state.name},${data.country.name},`,
          limit: 1,
        })
        .send();
      data.geometry = responce.body.features[0].geometry;
        let updateListing = await hometels.findByIdAndUpdate(id, data, {
          new: true,
        });
        if (typeof req.file !== "undefined") {
          let url = req.file.path;
          let filename = req.file.filename;
          updateListing.image = { url, filename };
          await updateListing.save();
        } else {
          await updateListing.save();
             }
          const newUser = await user.findById(req.user._id).populate("hometels");
        io.emit("hometelUpdated", {
          userId: req.user._id,
          hometels: newUser.hometels,
        });
        res.status(200).json({
          data: updateListing,
          redirectUrl: `/view/${updateListing._id}`,
          success: true,
          message: "Hometels Updated Sucessfully",
           hometels: newUser.hometels
        });
      } catch (err) {
        res.status(400).json({
          redirectUrl: `/view/${id}`,
          success: false,
          message: "Error during Updating Hometels  ",
        });
      }
    }
  );
  router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
    try {
      let id = req.params.id;
      // Validate if ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ message: "Invalid Hometel ID", redirectUrl: `/` });
      }
      const data = await hometels.findById(id);
      if (!data) {
        return res.status(404).json({
          redirectUrl: `/`,
          success: false,
          message: "Hometels not found",
        });
      }
      const Reviews = await review.find({ createdFor: data._id });
      const reviewId = Reviews.map((Review) => Review._id);
      await user.updateMany(
        { reviews: { $in: reviewId } },
        { $pull: { reviews: { $in: reviewId } } }
      );
      await review.deleteMany({ createdFor: data._id });
      await user.findByIdAndUpdate(data.owner, {
        $pull: { hometels: data.id },
      });
      // Delete all reservations related to this hometel
      await reserv.deleteMany({ _id: { $in: data.reservations } });
      // Remove reservations from users
      await user.updateMany(
        { reservations: { $in: data.reservations } },
        { $pull: { reservations: { $in: data.reservations } } }
      );
    const  newUser = await user.findById(req.user._id).populate("hometels")
      const result = await hometels.findByIdAndDelete(id);
      if (!result) {
        res.status(404).json({
          redirectUrl: `/view/${id}`,
          success: false,
          message: "Hometels not found",
        });
      } else {
          io.emit("hometelUpdated", {
          userId: req.user._id,
          hometels: newUser.hometels,
        });
        res.status(200).json({
          redirectUrl: `/`,
          success: true,
          message: "Hometels deleted sucessfully",
          hometels: newUser.hometels,
        });
      }
    } catch (err) {
      res.status(404).json({
        redirectUrl: `/`,
        success: false,
        message: "Hometels not found",
      });
    }
  });
return router;
}