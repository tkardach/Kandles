const { logger } = require('../debug/logging');
const { Dye, validatePostDye, validatePutDye } = require('../models/dye');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

// GET all dyes from the database
//  don't allow non-admins to see dyes
router.get('/', [auth, admin], async (req, res) => {
  const dyes = await Dye.find();

  res.status(200).send(dyes);
});

// GET the dye with the specified Id
//  don't allow non-admins to see dyes
router.get('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const dye = await Dye.findById(req.params.id);

  if (!dye) return res.status(404).send('Dye with that id not found.');

  res.status(200).send(dye);
});

// POST/Create a new dye in the database
//  don't allow non-admins to create dyes
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

// PUT/Update the dye with specified id
//  don't allow non-admins to alter dyes
router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const { error } = validatePutDye(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  const dye = await Dye.findByIdAndUpdate(req.params.id, {
    $set: _.pick(req.body,
      ['name',
        'soapSafe',
        'candleSafe',
        'lotionSafe',
        'prop65'])
  }, { new: true });

  if (!dye) return res.status(404).send('Dye with that Id was not found.');

  logger.log({
    level: 'info',
    message: `Dye Updated: ${dye}`
  });

  res.status(200).send(dye);
});

// DELETE the dye with specified id
//  don't allow non-admins to delete dyes
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const dye = await Dye.findByIdAndDelete(req.params.id);

  if (!dye) return res.status(404).send('Dye with that Id not found.');

  logger.log({
    level: 'info',
    message: `Dye Deleted: ${dye}`
  });

  res.status(200).send(dye);
});

module.exports = router;