const { validationErrors } = require("../../../middlewares/validationErrors")
const { postRating } = require("../../../models/ratings.model")
const { validatePostRating } = require("./ratings.validation")

async function httpPostRating(req, res) {
    const { error } = validatePostRating(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) })
    const data = {
        user_id: req.user._id,
        rating: req.body.rating
    }
    await postRating(data)
    return res.status(200).json({ message: 'Rating Successful' })
}

module.exports = { httpPostRating }