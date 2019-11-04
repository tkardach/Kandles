const Joi = require("joi");
const mongoose = require("mongoose");

const applicationsEnum = ['container', 'pillar', 'tealight'];
const waxTypeEnum = ['soy', 'beeswax'];

const waxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  prop65: {
    type: Boolean,
    required: false,
    default: false
  },
  ecoFriendly: {
    type: Boolean,
    required: false,
    default: false
  },
  applications: {
    type: [String],
    enum: applicationsEnum,
    required: true
  },
  waxType: {
    type: String,
    enum: waxTypeEnum,
    required: true
  }
});

function hasDuplicates(array) {
  return (new Set(array)).size === array.length;
}

var validator = function (value) {
  return hasDuplicates(value)
};

waxSchema.path('applications').validate(validator,
  'Application `{VALUE}` is not valid.', 'Duplicate Applications');

waxSchema.path('waxType').validate(validator,
  ' Wax Type `{VALUE}` is not valid.', 'Duplicate Wax Types');

const Wax = mongoose.model("Wax", waxSchema);

function validatePostWax(wax) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    prop65: Joi.boolean().required(),
    ecoFriendly: Joi.boolean().required(),
    applications: Joi.array().items(applicationsEnum).unique().required(),
    waxType: Joi.array().allow(waxTypeEnum).required()
  };

  return Joi.validate(wax, schema);
}

function validatePutWax(wax) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50),
    prop65: Joi.boolean(),
    ecoFriendly: Joi.boolean(),
    applications: Joi.array().items(applicationsEnum).unique(),
    waxType: Joi.string().allow(waxTypeEnum)
  };

  return Joi.validate(wax, schema);
}

module.exports.Wax = Wax;
module.exports.validatePutWax = validatePutWax;
module.exports.validatePostWax = validatePostWax;