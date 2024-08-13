const { validationErrors } = require("../../../middlewares/validationErrors")
const { postRating, getLastRatingForUser } = require("../../../models/ratings.model")
const { validatePostRating } = require("./ratings.validation")

async function httpPostRating(req, res) {
    const { error } = validatePostRating(req.body)
    if (error) return res.status(400).json({ message: validationErrors(error.details) })
    const latestRating = await getLastRatingForUser(req.user._id)
    if (latestRating[0]) {
        const now = new Date();
        const ratingDate = new Date(latestRating[0].createdAt);
        const diffInDays = (now - ratingDate) / (1000 * 60 * 60 * 24);

        if (diffInDays < 15) {
            return res.status(400).json({ message: 'Cannot Rate More Than once Every 15 Days' });
        }
    }
    const data = {
        user_id: req.user._id,
        rating: req.body.rating
    }
    await postRating(data)
    return res.status(200).json({ message: 'Rating Successful' })
}

module.exports = { httpPostRating }