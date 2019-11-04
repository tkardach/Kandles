const express = require('express');
const auth = require('../routes/auth');
const users = require('../routes/users');
const scents = require('../routes/scents');
const dyes = require('../routes/dyes');
const waxes = require('../routes/waxes');
const soapBases = require('../routes/soapBases');
const home = require('../routes/home');
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/auth', auth);
  app.use('/api/users', users);
  app.use('/api/scents', scents);
  app.use('/api/dyes', dyes);
  app.use('/api/waxes', waxes);
  app.use('/api/soapBases', soapBases);
  app.use('/', home);

  // Error handling middleware
  app.use(error);
}