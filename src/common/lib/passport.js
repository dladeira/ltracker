import passport from 'passport';
import User from '../models/User'
import dbConnect from './dbConnect'

import { generateId } from './util';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((req, id, done) => {
    User.findOne({ _id: id }, (err, user) => {
        if (err)
            done(err)
        done(null, user)
    })
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.ORIGIN + "/api/login/google",
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    await dbConnect()

    User.findOne({ email: profile.emails[0].value }, (err, user) => {
        if (err)
            return done(err)

        if (user != null)
            return done(null, user)

        var user = getDefaultUser(profile)

        user.save().then(() => done(null, user))
    })
}
));

function getDefaultUser(profile) {

    return new User({
        username: profile.name.familyName,
        email: profile.emails[0].value,
        tasks: [
            { id: generateId(), name: "Running", public: false, color: "#E9807F" },
            { id: generateId(), name: "Work out", public: false, color: "#E9807F" },
            { id: generateId(), name: "Swimming", public: false, color: "#E9807F" },
            { id: generateId(), name: "WebDev", public: false, color: "#99C1F1" },
            { id: generateId(), name: "SysAdmin", public: false, color: "#99C1F1" },
            { id: generateId(), name: "Unity", public: false, color: "#99C1F1" },
            { id: generateId(), name: "Cooking", public: false, color: "#A7D35F" },
            { id: generateId(), name: "Math", public: false, color: "#A7D35F" },
            { id: generateId(), name: "Guitar", public: false, color: "#A7D35F" }
        ],
        checklist: [
            { id: generateId(), name: "6am sigma grindset" },
            { id: generateId(), name: "beat wife" },
            { id: generateId(), name: "run" },
            { id: generateId(), name: "league" },
            { id: generateId(), name: "Tabletka" }
        ]
    })
}

export default passport;