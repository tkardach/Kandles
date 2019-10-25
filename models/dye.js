const Joi = require("joi");
const mongoose = require("mongoose");

const dyeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  soapSafe: {
    type: Boolean,
    required: false,
    default: false
  },
  candleSafe: {
    type: Boolean,
    required: false,
    default: false
  },
  lotionSafe: {
    type: Boolean,
    required: false,
    default: false
  },
  prop65: {
    type: Boolean,
    required: false,
    default: false
  }
});

const Dye = mongoose.model("Dye", dyeSchema);

function validatePostDye(dye) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    soapSafe: Joi.boolean().required(),
    candleSafe: Joi.boolean().required(),
    lotionSafe: Joi.boolean().required(),
    prop65: Joi.boolean().required()
  };

  return Joi.validate(dye, schema);
}

function validatePutDye(dye) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    soapSafe: Joi.boolean(),
    candleSafe: Joi.boolean(),
    lotionSafe: Joi.boolean(),
    prop65: Joi.boolean()
  };

  return Joi.validate(dye, schema);
}

module.exports.Dye = Dye;
module.exports.validatePutDye = validatePutDye;
module.exports.validatePostDye = validatePostDye;