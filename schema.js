const Joi = require("joi");
module.exports.listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  country: Joi.string().required(),
  price: Joi.number().integer().required().min(1),
  streetAddress: Joi.string().required(),
  country: Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
  }),
  state: Object({
    id: Joi.number().required(),
    name: Joi.string().required(),
  }),
  city: Object({
    id: Joi.number().required(),
    name: Joi.string().required(),
  }),
  category: Joi.array().items(Joi.string().min(1)).required(),
  image: Joi.object({
    url: Joi.string().required(),
    filename: Joi.string().required(),
  }),
});
