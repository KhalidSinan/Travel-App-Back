const mongoose = require('mongoose')

module.exports = (req, res, next) => {
    if (mongoose.isValidObjectId(req.params.id)) next();
    else return res.status(404).json({ message: 'Not Found' })
}