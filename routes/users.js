const PasswordComplexity = require('joi-password-complexity');
const { User, validate } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const complexityOptions = {
  min: 8,
  max: 50,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 3
}

// GET all users in database
router.get('/', async (req, res) => {
  const users = await User.find().select('name');
  res.status(200).send(users);
});

// GET current user in database
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  // If for whatever reason the token does not match any user, throw 404
  if (!user) return res.status(404).send('User with this token not found.');

  res.status(200).send(user);
});

// POST new user to database
router.post('/', async (req, res) => {
  // Validate the user attributes
  const { error: error1 } = validate(req.body);
  if (error1) return res.status(400).send(error1.details[0].message);

  // Make sure no user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered...');

  // Validate the password strength
  const { error: error2 } = Joi.validate(req.body.password, new PasswordComplexity(complexityOptions));
  if (error2) return res.status(400).send(error2.message);

  // Add user to database and encrypt password
  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // Return the token back to the client
  const token = user.generateAuthToken();
  res.status(200)
    .header('x-auth-token', token)
    .send(_.pick(user, ['name', 'email']));
});

module.exports = router;