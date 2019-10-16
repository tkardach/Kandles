const config = require('config')
const express = require('express');
const app = express();

// Initialize api routes
require('./startup/routes')(app);

const port = process.env.PORT || config.get("port");

app.listen(port, () => console.log(`App listening on port ${port}`));