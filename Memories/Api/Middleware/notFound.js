const { StatusCodes } = require('http-status-codes')

const notFound = async (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({ msg: 'Invalid Route' })
}

module.exports = notFound
