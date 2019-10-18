module.exports = function (err, req, res, next) {
  console.log('Internal Server Error.')
  res.status(500).send('Internal server error.');
}