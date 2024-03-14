const {StatusCodes} = require('http-status-codes');

const notFound = (req,res) => res.status(StatusCodes.NOT_FOUND).send('This page is probably not what you are looking for');

module.exports = notFound;
