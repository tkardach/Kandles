const Joi = require("joi");
const mongoose = require("mongoose");

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
    enum: ['container', 'pillar', 'tealight'],
    required: true
  },
  waxType: {
    type: String,
    required: true
  }
});

function hasDuplicates(array) {
  return (new Set(array)).size !== array.length;
}

var validator = function(value) {
  return hasDuplicates(value)
};

waxSchema.path('applications').validate(validator,
  'Application `{VALUE}` is not valid.', 'Duplicate Applications');

const Wax = mongoose.model("Wax", waxSchema);

function validatePostDye(wax) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    prop65: Joi.boolean().required()
  };

  return Joi.validate(wax, schema);
}

function validatePutDye(wax) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50),
    prop65: Joi.boolean()
  };

  return Joi.validate(wax, schema);
}

module.exports.Wax = Wax;
module.exports.validatePutWax = validatePutWax;
module.exports.validatePostWax = validatePostWax;