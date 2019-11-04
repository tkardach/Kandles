const { logger } = require('../debug/logging');
const { Wax, validatePostWax, validatePutWax } = require('../models/wax');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

// GET all waxes from the database
//  don't allow non-admins to see waxes
router.get('/', [auth, admin], async (req, res) => {
  const waxes = await Wax.find();

  res.status(200).send(waxes);
});

// POST wax to database
//  don't allow non-admins to post wax
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validatePostWax(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const query = await Wax.find({ name: req.body.name });
  if (query.length > 0) return res.status(400).send('Wax with that name already exists.');

  const wax = new Wax(_.pick(req.body,
    ['name',
      'prop65',
      'ecoFriendly',
      'applications',
      'waxType']));

  await wax.save();

  res.status(200).send(wax);
});

module.exports = router;