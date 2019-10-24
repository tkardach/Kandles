const mongoose = require('mongoose');
const { logger } = require('../debug/logging');
const { Scent, validatePostScent } = require('../models/scent');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/', [auth, admin], async (req, res) => {
  const scents = await Scent.find();
  res.status(200).send(scents);
});

router.get('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const scent = await Scent.findById(req.params.id);
  if (!scent) return res.status(404).send('Could not find scent with matching Id.');

  res.status(200).send(scent);
});

router.post('/', [auth, admin], async (req, res) => {
  // Validate the scent attributes
  const { error } = validatePostScent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const scent = new Scent(_.pick(req.body,
    ['name',
      'soapSafe',
      'candleSafe',
      'lotionSafe',
      'phthalateFree',
      'prop65',
      'vegan',
      'ecoFriendly']));

  await scent.save();

  res.status(200).send(scent);
});

router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {
  // Validate the scent attributes
  const { error } = validatePostScent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const scent = await Scent.findByIdAndUpdate(req.params.id, {
    $set: _.pick(req.body,
      ['name',
        'soapSafe',
        'candleSafe',
        'lotionSafe',
        'phthalateFree',
        'prop65',
        'vegan',
        'ecoFriendly'])
  }, { new: true });

  if (!scent) return res.status(404).send('Scent with that Id was not found.');

  logger.log({
    level: 'info',
    message: `Scent Updated: ${scent}`
  });

  res.status(200).send(scent);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const scent = await Scent.findByIdAndDelete(req.params.id);
  if (!scent) return res.status(404).send('Scent with that id not found');

  res.status(200).send(scent);
});

module.exports = router;