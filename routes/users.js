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
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 2
}

router.get('/', async (req, res) => {
  const users = User.find().select({ name: 1 });
  res.send(users);
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error: error1 } = validate(req.body);
  if (error1) return res.status(400).send(error1.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered...');

  const { error: error2 } = Joi.validate(req.body.password, new PasswordComplexity(complexityOptions));
  if (error2) return res.status(400).send(error2.message);

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']));
});

module.exports = router;