require("dotenv").config();
const { json } = require("body-parser");
const { listingSchema } = require("./schema");
const hometels = require("./Models/Hometels");
const reserv = require("./Models/Reserv");
module.exports.priceConvert = (req, res, next) => {
  if (req.body.listing === undefined) {
    return res.status(400).json({
      redirectUrl: `/`,
      success: false,
      message: "Error during Updating Hometels  ",
    });
  } else {
    try {
      let data;
      if (typeof req.body.listing === "string") {
        data = JSON.parse(req.body.listing);
      } else {
        data = req.body.listing;
      }

      // Check if the 'number' field is not of type 'number'
      if (typeof data.price !== "number") {
        const convertedNumber = Number(data.price);

        // Check if the converted value is a valid number
        if (!isNaN(convertedNumber)) {
          data.price = convertedNumber; // Convert and assign
        } else {
          res.status(400).json({
            redirectUrl: `/new`,
            success: false,
            message: "Please send a valid number",
          });
        }
      }
      req.body.listing = data;

      next();
    } catch (err) {
      console.log("err", err);
    }
  }
};
module.exports.convertUser = (req, res, next) => {
  let { username, password } = JSON.parse(req.body.user);
  req.body.username = username;
  req.body.password = password;
  delete req.body.user;
  next();
};
module.exports.convertPhone = (req, res, next) => {
  try {
    let data = req.body.userDetails;
    
    // Handle cases where userDetails might be a JSON string
    if (req.body.userDetails && typeof req.body.userDetails === 'string') {
      try {
        data = JSON.parse(req.body.userDetails);
      } catch (parseError) {
        console.error("Error parsing userDetails:", parseError);
        return res.status(400).json({
          redirectUrl: `/`,
          success: false,
          message: "Invalid userDetails format",
        });
      }
    }

    // Convert phoneNumber to string if it exists
    if (data.phoneNumber !== undefined) {
      data.phoneNumber = String(data.phoneNumber);
    }
    delete req.body.userDetails;
    req.body = data;
    console.log(req.body)
    next();
  } catch (err) {
    console.error("Error in convertPhone middleware:", err);
    return res.status(400).json({
      redirectUrl: `/`,
      success: false,
      message: "Invalid data format",
    });
  }
};

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body.listing);
  if (error) {
    let errmsg = error.details[0].message.replace(/"([^"]*)"/g, "$1");
    console.log(errmsg);
    res.status(400).json({
      redirectUrl: `/new`,
      success: false,
      message: errmsg,
    });
  } else {
    return next();
  }
};
module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated() === true) {
    next();
  } else {
    res.status(400).json({
      success: false,
      authenticated: false,
      redirectUrl: "/login",
      message: "Please log in for this opration",
    });
  }
};
module.exports.changePass = (req, res, next) => {
  if (req.body.user) {
    let data;
    if (typeof req.body.user == "string") {
      data = JSON.parse(req.body.user);
    } else {
      data = req.body.user;
    }
    delete req.body.user;
    req.body = data;
    next();
  } else {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
};
// review middlewares
module.exports.checkConvertReview = (req, res, next) => {
  if (req.isAuthenticated() === true) {
    if (req.body.Review === null || req.body.Review === undefined) {
      return res.status(404).json({
        success: false,
        message: "Not recieved data from user",
      });
    } else {
      let data;
      if (typeof req.body.Review == "string") {
        data = JSON.parse(req.body.Review);
      } else {
        data = req.body.Review;
      }
      delete req.body.Review;
      req.body = data;
      next();
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Please login for this opration",
      redirectUrl: "/login",
    });
  }
};
module.exports.isOwner = async (req, res, next) => {
  const id = req.params.id;
  try {
    let Hometel = await hometels.findById(id);
    if (Hometel === null) {
      return res.status(404).json({
        success: false,
        message: "Hometel not found",
        redirectUrl: "/",
      });
    } else {
      if (req.user._id.toString() === Hometel.owner.toString()) {
        next();
      } else {
        return res.status(400).json({
          success: false,
          message: "You are not owner of this hometel",
          redirectUrl: "/",
        });
      }
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Somthing went wrong",
      redirectUrl: "/",
    });
  }
};
module.exports.isReservOwner = async (req, res, next) => {
  const id = req.params.id;
  try {
    const Reserv = await reserv.findById(id);
    if (Reserv === null) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
        redirectUrl: "/dashboard",
      });
    } else {
      if (req.user._id.toString() === Reserv.reservBy.toString()) {
        next();
      } else {
        return res.status(400).json({
          success: false,
          message: "You not created this Trip",
          redirectUrl: "/",
        });
      }
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Somthing went wrong",
      redirectUrl: "/",
    });
  }
};
module.exports.reservConvert = async (req, res, next) => {
  if (req.body.reservData === undefined) {
    return res.status(400).json({
      redirectUrl: `/`,
      success: false,
      message: "Error during Reserv Hometels  ",
    });
  } else {
    try {
      let data;
      if (typeof req.body.reservData === "string") {
        data = JSON.parse(req.body.reservData);
      } else {
        data = req.body.reservData;
      }
      req.body.reservData = data;
      next();
    } catch (err) {
      console.log("err", err);
    }
  }
};
