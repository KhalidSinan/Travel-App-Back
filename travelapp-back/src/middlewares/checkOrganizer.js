module.exports = (req, res, next) => {
    if (req.user.is_guide) next();
    else return res.status(401).json({ message: 'Not An Organizer' })
}