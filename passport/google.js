const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth.Strategy;
const User = require('../models/user');
const keys = require('../config/keys');

passport.serializeUser((user,done) => {
    return done(null, user,id);
});
passport.deserializeUser((id,done) => {
    User.findById(id, (err, user) => {
        return done(err,user);
    });
});

passport.use(new GoogleStrategy ({
    clientID: keys.GoogleClientID,
    clientSecret: keys.GoogleClientSecret,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, RefreshToken, profile, done) => {
    console.log(profile)
}));