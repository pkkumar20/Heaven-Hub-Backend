const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, required: true },
  resetPasswordOTP: { type: Number },
  resetPasswordExpires: { type: Date },
  emailVerifyOtp: { type: Number },
  isEmailVerified: { type: Boolean, default: false },

  country: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  state: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  city: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  streetAddress: { type: String, required: true },

  favoriteHometels: [{ type: Schema.Types.ObjectId, ref: "hometels" }],
  reviews: [{ type: Schema.Types.ObjectId, ref: "review" }],
  reservations: [{ type: Schema.Types.ObjectId, ref: "reserv" }],
  hometels: [{ type: Schema.Types.ObjectId, ref: "hometels" }],
});

userSchema.plugin(passportLocalMongoose); // ✅ Add this plugin

module.exports = mongoose.model("User", userSchema);
