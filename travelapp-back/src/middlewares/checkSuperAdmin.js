module.exports = (req, res, next) => {
    if (req.user.role == 'Super-Admin') next();
    else return res.status(404).json({ message: 'Not Authorized To Access' })
}