const mongoose = require('mongoose');
const { logger } = require('../debug/logging');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();

router.get('/', [auth, admin], async (req, res) => {

  res.status(200).send();
});

router.get('/:id', [auth, admin, validateObjectId], async (req, res) => {

  res.status(200).send();
});

router.post('/', [auth, admin], async (req, res) => {

  res.status(200).send();
});

router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {

  res.status(200).send();
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {

  res.status(200).send();
});

module.exports = router;