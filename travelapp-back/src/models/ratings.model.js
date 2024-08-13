const Rating = require('./ratings.mongo')

async function postRating(data) {
    return await Rating.create(data)
}

async function getLastRatingForUser(user_id) {
    return await Rating.find({ user_id }).sort({ 'createdAt': -1 }).limit(1)
}

module.exports = {
    postRating,
    getLastRatingForUser
}