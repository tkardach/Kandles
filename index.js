const config = require('config')
const {logger} = require('./debug/logging');
const express = require('express');
const app = express();

// Initialize api routes
require('./startup/routes')(app);

// Initialize Database
require('./startup/db')();

const port = process.env.PORT || config.get("port");

const server = app.listen(port, () => {
  logger.log({
    level: 'info',
    message: `App listening on port ${port}`
  });
});

module.exports = server;