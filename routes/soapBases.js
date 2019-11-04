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
  res.status(200).send();
});

// POST SoapBase to database
//  don't allow non-admins to post SoapBase
router.post('/', [auth, admin], async (req, res) => {
  res.status(200).send();
});

// PUT SoapBase to database
//  don't allow non-admins to put SoapBase
router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {
  res.status(200).send();
});

// DELETE SoapBase from database
//  don't allow non-admins to delete SoapBase
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  res.status(200).send();
});

module.exports = router;