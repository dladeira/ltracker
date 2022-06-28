import nextConnect from 'next-connect';
import passport from '../../../lib/passport';
import { setLoginSession } from '../../../lib/auth';

const handler = nextConnect();

const authenticate = (req, res) => {
    return new Promise((resolve, reject) => {
        passport.authenticate("google", (error, userObject) => {
            if (error) {
                reject(error)
            } else {
                resolve(userObject)
            }
        })(req, res)
    })
}

handler.use(passport.initialize())
    .get(async (req, res) => {
        try {
            const user = await authenticate(req, res)
            const session = { ...user }

            await setLoginSession(res, { email: session._doc.email })
            res.redirect('/')
        } catch (error) {
            res.status(401).send(error.message)
        }
    })

export default handler