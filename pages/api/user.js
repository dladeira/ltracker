import { getLoginSession } from '../../lib/auth'
import dbConnect from '../../lib/dbConnect'
import User from '../../models/User'

export default async function user(req, res) {
    await dbConnect();

    await getUser(req, {
        onFound: user => {
            res.status(200).json({ user })
        },

        onNotFound: () => {
            res.status(500).end('Authentication token is invalid, please log in')
        }
    })
}

export async function getUser(req, { onFound, onNotFound }) {
    await dbConnect()

    try {
        const session = await getLoginSession(req)
        const user = (session && (await findUser({ _id: session._doc._id }))) ?? null


        await onFound(user)
    } catch (error) {
        console.error(error)
        await onNotFound()
    }
}

async function findUser(data) {
    const userFound = await User.findOne(data)
    return userFound
}