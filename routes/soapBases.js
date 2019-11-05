const { logger } = require('../debug/logging');
const { SoapBase, validatePostSoapBase, validatePutSoapBase } = require('../models/soapBase');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

// GET all SoapBases from the database
//  don't allow non-admins to see SoapBases
router.get('/', [auth, admin], async (req, res) => {
  const soaps = await SoapBase.find({});
  res.status(200).send(soaps);
});

// GET SoapBase by id from database
//  don't allow non-admins to see SoapBases
router.get('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const soap = await SoapBase.findById(req.params.id);
  if (!soap) return res.status(404).send('Could not find SoapBase with matching Id.');

  res.status(200).send(soap);
});

// POST SoapBase to database
//  don't allow non-admins to post SoapBase
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validatePostSoapBase(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const query = await SoapBase.find({ name: req.body.name });
  if (query.length > 0) return res.status(400).send('SoapBase with that name already exists.');

  const soapBase = new SoapBase(_.pick(req.body,
    ['name',
      'vegan',
      'ecoFriendly',
      'type']
  ));

  await soapBase.save();

  res.status(200).send(soapBase);
});

// PUT SoapBase to database
//  don't allow non-admins to put SoapBase
router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const { error } = validatePutSoapBase(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const soapBase = await SoapBase.findByIdAndUpdate(req.params.id,
    {
      $set: _.pick(req.body,
        ['name',
          'vegan',
          'ecoFriendly',
          'type'])
    }, { new: true });

  if (!soapBase) return res.status(404).send('Could not find SoapBase with matching Id.');

  logger.log({
    level: 'info',
    message: `SoapBase Updated: ${soapBase}`
  });

  res.status(200).send(soapBase);
});

// DELETE SoapBase from database
//  don't allow non-admins to delete SoapBase
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const soapBase = await SoapBase.findByIdAndDelete(req.params.id);
  if (!soapBase) return res.status(404).send('Could not find SoapBase with matching Id.');

  logger.log({
    level: 'info',
    message: `SoapBase Deleted: ${soapBase}`
  });

  res.status(200).send(soapBase);
});

module.exports = router;