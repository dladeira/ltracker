import nextConnect from 'next-connect';
import passport from '../../../lib/passport';

const handler = nextConnect();

handler.get(passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
    session: false
}))


export default handler;