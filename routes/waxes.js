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

module.exports = router;