const mongoose = require('mongoose');
const config = require('config');

module.exports = async function () {
  const db = config.get('db');
  await mongoose.connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
    .then(() => {
      return console.log('Connected to database');
    });
}