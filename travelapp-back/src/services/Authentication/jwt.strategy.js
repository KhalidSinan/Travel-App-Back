require('dotenv').config();
const passport = require('passport');
const User = require('../../models/users.mongo')
const Admin = require('../../models/admins.mongo')
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
        const admin = await Admin.findById(jwt_payload.id);
        if (user) {
            const check = await checkBlacklist(user.id, token)
            if (!check) return done(null, false);
            return done(null, user);
        }
        else if (admin) {
            const check = await checkBlacklist(admin.id, token)
            if (!check) return done(null, false);
            return done(null, admin);
        } else {
            return done(null, false);
        }

    } catch (err) {
        return done(err, false);
    }
}));

async function checkBlacklist(user_id, token) {
    const check = await getBlacklist(user_id, token)
    if (check) return false
    return true
}