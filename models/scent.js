const Joi = require("joi");
const mongoose = require("mongoose");

const scentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  soapSafe: Boolean,
  candleSafe: Boolean,
  lotionSafe: Boolean,
  phthalateFree: Boolean,
  prop65: Boolean,
  vegan: Boolean,
  ecoFriendly: Boolean
});

const Scent = mongoose.model("Scent", scentSchema);

function validatePostScent(scent) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    soapSafe: Joi.boolean()
      .required(),
    candleSafe: Joi.boolean()
      .required(),
    lotionSafe: Joi.boolean()
      .required(),
    phtalateFree: Joi.boolean()
      .required(),
    prop65: Joi.boolean()
      .required(),
    vegan: Joi.boolean()
      .required(),
    ecoFriendly: Joi.boolean()
      .required()
  };

  return Joi.validate(scent, schema);
}

function validatePutScent(scent) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    soapSafe: Joi.boolean(),
    candleSafe: Joi.boolean(),
    lotionSafe: Joi.boolean(),
    phtalateFree: Joi.boolean(),
    prop65: Joi.boolean(),
    vegan: Joi.boolean(),
    ecoFriendly: Joi.boolean()
  };

  return Joi.validate(scent, schema);
}

module.exports.Scent = Scent;
module.exports.validatePutScent = validatePutScent;
module.exports.validatePostScent = validatePostScent;