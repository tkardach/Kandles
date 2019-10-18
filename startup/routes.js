const express = require('express');
const auth = require('../routes/auth');
const users = require('../routes/users');
const home = require('../routes/home');
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/auth', auth);
  app.use('/api/users', users);
  app.use('/', home);

  // Error handling middleware
  app.use(error);
}