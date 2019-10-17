const express = require('express');
const auth = require('../routes/auth');
const users = require('../routes/users');
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/auth', auth);
  app.use('/api/users', users);

  // Error handling middleware
  app.use(error);
}