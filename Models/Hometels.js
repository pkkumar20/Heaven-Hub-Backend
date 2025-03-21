const mongoose = require("mongoose");
// const review = require("./review");
// const { required } = require("joi");
const Schema = mongoose.Schema;
const review = require("../Models/Reviews");
const user = require("../Models/User");
const { string, required } = require("joi");
const categoriesEnum = [
  "Trending",
  "Dessert",
  "Top Cities",
  "Lake Front",
  "Outside City",
  "Inside City",
  "Tiny Homes",
  "Caves",
  "Camping",
  "Hut",
  "Pool",
  "villa",
  "Arctic",
  "castel",
  "Island",
  "Farm",
  "Mountain",
  "Rooms",
  "Luxery",
  "Beach",
  "Others",
];
const Hometelschema = new mongoose.Schema({
  title: String,
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  country: Object({
    id: Number,
    name: String,
  }),
  state: Object({
    id: Number,
    name: String,
  }),
  city: Object({
    id: Number,
    name: String,
  }),
  streetAddress: String,
  category: {
    type: [String],
    enum: categoriesEnum,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "review" }],
  reservations: [{ type: Schema.Types.ObjectId, ref: "reserv" }],
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to current date
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});
let hometels = mongoose.model("hometels", Hometelschema);
module.exports = hometels;
