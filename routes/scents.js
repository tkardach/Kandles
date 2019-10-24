const mongoose = require('mongoose');
const { logger } = require('../debug/logging');
const { Scent, validatePostScent } = require('../models/scent');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

// Get all scents in the database
//  Must be an admin, we don't want random users
// seeing ingredient items
router.get('/', [auth, admin], async (req, res) => {
  // get all scents in the database
  const scents = await Scent.find();
  res.status(200).send(scents);
});

// Get the scent by the given id
//  Must be an admin, we don't want random users
// seeing ingredient items
router.get('/:id', [auth, admin, validateObjectId], async (req, res) => {
  // find the scent with the given id
  const scent = await Scent.findById(req.params.id);
  if (!scent) return res.status(404).send('Could not find scent with matching Id.');

  res.status(200).send(scent);
});

// Post the scent with the given parameters
//  Must be an admin, we don't want random users
// creating scents
router.post('/', [auth, admin], async (req, res) => {
  // validate the scent attributes
  const { error } = validatePostScent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // create a scent with the requested parameters
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

  // return created scent
  res.status(200).send(scent);
});

// Put (Update) existing scent with given parameters
//  Must be an admin, we don't want random users
// altering existing scents
router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {
  // validate the scent attributes
  const { error } = validatePostScent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // find and update the scent by id
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

  // return updated scent
  res.status(200).send(scent);
});

// Delete the scent with the requested Id
//  Must be an admin, we don't want random users
// deleting scents
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  // find and delete scent by id
  const scent = await Scent.findByIdAndDelete(req.params.id);
  if (!scent) return res.status(404).send('Scent with that id not found');

  // return deleted scent
  res.status(200).send(scent);
});

module.exports = router;