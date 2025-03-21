module.exports.checkAndConvertNumber = (req, res, next) => {
  const listing = JSON.parse(req.body.listing); // Parse the 'listing' object from the request

  // Check if the 'number' field is not of type 'number'
  if (typeof listing.price !== "number") {
    const convertedNumber = Number(listing.price);

    // Check if the converted value is a valid number
    if (!isNaN(convertedNumber)) {
      listing.price = convertedNumber; // Convert and assign
    }
  }
  // Replace the original listing with the modified listing
  req.body.listing = listing;
  next();
};
