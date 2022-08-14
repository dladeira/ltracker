import User from '../../common/models/User'
import { getUser } from './user/index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            const rawUsers = await User.find({})
            const users = []
            for (var rawUser of rawUsers) {
                if (rawUser.public || user.friends.findIndex(loopFriend => loopFriend.id == rawUser._id) != -1)
                    users.push({
                        username: rawUser.username,
                        id: rawUser._id,
                        profilePicture: rawUser.profilePicture
                    })
            }

            res.status(200).json(users)
        },
        onNotFound: async () => {
            const rawUsers = await User.find({})
            const users = []
            for (var rawUser of rawUsers) {
                if (rawUser.public)
                    users.push({
                        username: rawUser.username,
                        id: rawUser._id,
                        profilePicture: rawUser.profilePicture
                    })
            }

            res.status(200).json(users)
        }
    })

}

export default Route