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
    var physicalId = generateId()
    var educationId = generateId()
    var csId = generateId()

    return new User({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        tasks: [
            { id: generateId(), name: "Running", category: physicalId, color: "#ffa348" },
            { id: generateId(), name: "Work out", category: physicalId, color: "#ffa348" },
            { id: generateId(), name: "Swimming", category: physicalId, color: "#ffa348" },
            { id: generateId(), name: "WebDev", category: csId, color: "#ed333b" },
            { id: generateId(), name: "SysAdmin", category: csId, color: "#ed333b" },
            { id: generateId(), name: "Unity", category: csId, color: "#ed333b" },
            { id: generateId(), name: "Homework", category: educationId, color: "#8ac52a" },
            { id: generateId(), name: "Math", category: educationId, color: "#8ac52a" },
            { id: generateId(), name: "Guitar", category: educationId, color: "#8ac52a" }
        ],
        categories: [
            { id: physicalId, name: "Physical" },
            { id: educationId, name: "Education" },
            { id: csId, name: "Computer Science" }
        ],
        ratings: [
            { id: generateId(), name: "Organization" },
            { id: generateId(), name: "Sleep" },
            { id: generateId(), name: "Happiness" }
        ]
    })
}

export default passport;