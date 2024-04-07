require('dotenv').config();
const passport = require('passport');
const User = require('../../models/users.mongo')
const { getBlacklist } = require('../../models/blacklist.model')

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;
opts.passReqToCallback = true;
passport.use(new JwtStrategy(opts, async (req, jwt_payload, done) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = await User.findById(jwt_payload.id);
        const check = checkBlacklist(user.id, token)
        if (user && !check) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));

async function checkBlacklist(user_id, token) {
    const check = await getBlacklist(user_id)
    if (!check) return true
    return false
}