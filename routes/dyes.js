const mongoose = require('mongoose');
const { logger } = require('../debug/logging');
const { Dye, validatePostDye, validatePutDye } = require('../models/dye');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/', [auth, admin], async (req, res) => {
  const dyes = await Dye.find();

  res.status(200).send(dyes);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validatePostDye(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const dye = new Dye(_.pick(req.body,
    ['name',
      'soapSafe',
      'candleSafe',
      'lotionSafe',
      'prop65']));

  const dbDye = await Dye.find({
    name: req.body.name,
    soapSafe: req.body.soapSafe,
    candleSafe: req.body.candleSafe,
    lotionSafe: req.body.lotionSafe,
    prop65: req.body.prop65
  });

  if (dbDye.length > 0) return res.status(400).send('Dye already exists.');

  await dye.save();

  res.status(200).send(dye);
});

module.exports = router;