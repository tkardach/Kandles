const Joi = require("joi");
const mongoose = require("mongoose");

const soapBaseTypeEnum = ['cold_process', 'melt_and_pour'];

const soapBaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  vegan: {
    type: Boolean,
    required: false,
    default: false
  },
  ecoFriendly: {
    type: Boolean,
    required: false,
    default: false
  },
  type: {
    type: String,
    enum: soapBaseTypeEnum,
    required: true
  }
});

const SoapBase = mongoose.model("SoapBase", soapBaseSchema);

function validatePostSoapBase(soap) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    vegan: Joi.boolean().required(),
    ecoFriendly: Joi.boolean().required(),
    type: Joi.string()
      .valid(...soapBaseTypeEnum)
      .required()
  };

  return Joi.validate(soap, schema);
}

function validatePutSoapBase(soap) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50),
    vegan: Joi.boolean(),
    ecoFriendly: Joi.boolean(),
    type: Joi.string()
      .valid(...soapBaseTypeEnum)
  };

  return Joi.validate(soap, schema);
}

module.exports.SoapBase = SoapBase;
module.exports.validatePutSoapBase = validatePutSoapBase;
module.exports.validatePostSoapBase = validatePostSoapBase;