const Rating = require('./ratings.mongo')

async function postRating(data) {
    return await Rating.create(data)
}

module.exports = {
    postRating
}