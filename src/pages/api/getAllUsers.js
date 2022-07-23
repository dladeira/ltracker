import dbConnect from '../../common/lib/dbConnect'
import User from '../../common/models/User'

async function Route(req, res) {
    await dbConnect()

    const rawUsers = await User.find({})
    const users = []
    for (var rawUser of rawUsers) {
        users.push({
            username: rawUser.lastName,
            id: rawUser._id
        })
    }


    res.status(200).json(users)
}

export default Route