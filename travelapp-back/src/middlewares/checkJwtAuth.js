const passport = require('passport');
require('../services/Authentication/jwt.strategy')

const requireJwtAuth = passport.authenticate('jwt', { session: false });

module.exports = requireJwtAuth;