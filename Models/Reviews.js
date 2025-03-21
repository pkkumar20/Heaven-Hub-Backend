const { boolean, types, date } = require("joi");
const mongoose = require("mongoose");
const hometels = require("../Models/Hometels");
const user = require("../Models/User");
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
  rating: Number,
  comment: String,
  createdAt: Date,
  createdFor: { type: Schema.Types.ObjectId, ref: "hometels" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});
let review = mongoose.model("review", reviewSchema);
module.exports = review;
