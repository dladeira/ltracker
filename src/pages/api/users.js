import User from '../../common/models/User'
import { getUser } from './user/index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async () => {
            const rawUsers = await User.find({})
            const users = []
            for (var rawUser of rawUsers) {
                users.push({
                    username: rawUser.lastName,
                    id: rawUser._id
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
                        username: rawUser.lastName,
                        id: rawUser._id
                    })
            }

            res.status(200).json(users)
        }
    })

}

export default Route