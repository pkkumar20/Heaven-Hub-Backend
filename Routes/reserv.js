const express = require("express");
const router = express.Router();
const user = require("../Models/User");
const hometels = require("../Models/Hometels");
const reserv = require("../Models/Reserv.js");
const { storage } = require("../cloudConfig");
const multer = require("multer");
const upload = multer({ storage });
const mongoose = require("mongoose");
const {
  isLoggedIn,
  reservConvert,
  isReservOwner,
} = require("../middlewares.js");
module.exports = (io) => {
  router.post(
    "/:id",
    upload.none(),
    isLoggedIn,
    async (req, res) => {
      const id = req.params.id;
      // Validate if ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ message: "Invalid Hometel ID", redirectUrl: `/` });
      }
      try {
        const newReserv = new reserv(req.body);
        newReserv.reservBy = req.user._id;
        const savedReserv = await newReserv.save();
        const User = await user.findById(req.user._id);
        const Hometel = await hometels.findById(id);
        User.reservations.push(savedReserv._id);
        Hometel.reservations.push(savedReserv._id);
        await User.save();
        const updatedUser = await User.populate("reservations");
        await Hometel.save();
        io.emit("tripUpdated", {
          userId: req.user._id,
          trips: updatedUser.reservations,
        });
        res.status(200).json({ sucess: true, trips: updatedUser.reservations, });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Internal server error", err: err.message });
      }
    }
  );
  router.delete("/:id", isLoggedIn, isReservOwner, async (req, res) => {
    const id = req.params.id;
    // Validate if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid Trip ID", redirectUrl: `/` });
    }
    try {
      const Reserv = await reserv.findById(id);
      const User = await user.findById(Reserv.reservBy);
      const Hometel = await hometels.findById(Reserv.reservFor);
      if (User === null) {
        return res.status(400).json({ message: "User with this Trip not found" });
      }
      if (Hometel === null) {
        return res
          .status(400)
          .json({ message: "Hometel with this Trip not found" });
      }
        const updatedHometel = await hometels
          .findByIdAndUpdate(
            Hometel._id,
            { $pull: { reservations: id } }, // Removes the hometel ID
            { new: true }
          )
      await reserv.findByIdAndDelete(id); 
      const updatedUser = await user
               .findByIdAndUpdate(
                 User._id,
                 { $pull: { reservations: id } }, // Removes the hometel ID
                 { new: true }
               ).populate("reservations")
       io.emit("tripUpdated", {
          userId: req.user._id,
          trips: updatedUser.reservations||[],
        });
    res.status(200).json({ sucess: true, trips: updatedUser.reservations||[], });
    } catch (err) {
      console.log(err)
      res
        .status(500)
        .json({ message: "Internal server error", err: err.message });
    }
  });
  return router;
}
