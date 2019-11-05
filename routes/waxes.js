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

// GET wax by id from database
//  don't allow non-admins to see waxes
router.get('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const wax = await Wax.findById(req.params.id);
  if (!wax) return res.status(404).send('Cannot find wax with matching Id.');

  res.status(200).send(wax);
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

// PUT wax to database
//  don't allow non-admins to put wax
router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const { error } = validatePutWax(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const wax = await Wax.findByIdAndUpdate(req.params.id,
    {
      $set: _.pick(req.body,
        ['name',
          'prop65',
          'ecoFriendly',
          'applications',
          'waxType'])
    }, { new: true });

  if (!wax) return res.status(404).send('Could not find wax with matching Id.');

  logger.log({
    level: 'info',
    message: `Wax Updated: ${wax}`
  });

  res.status(200).send(wax);
});

// DELETE wax from database
//  don't allow non-admins to delete wax
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const wax = await Wax.findByIdAndDelete(req.params.id);
  if (!wax) return res.status(404).send('Could not find wax with matching Id');

  logger.log({
    level: 'info',
    message: `Wax Deleted: ${wax}`
  });

  res.status(200).send(wax);
});

module.exports = router;