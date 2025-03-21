const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reservSchema = new Schema({
  totalPrice: Number,
  startDate: String,
  endDate: String,
  night: Number,
  guests: {
    adults: Number,
    children: Number,
    infants: Number,
    pets: Number,
  },
  reservFor: {
    type: Schema.Types.ObjectId,
    ref: "hometels",
  },
  reservBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
let reserv = mongoose.model("reserv", reservSchema);
module.exports = reserv;
