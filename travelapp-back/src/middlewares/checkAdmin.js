module.exports = (req, res, next) => {
    if (req.user.role) next();
    else return res.status(401).json({ message: 'Not Authorized To Access' })
}