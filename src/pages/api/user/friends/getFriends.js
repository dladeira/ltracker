import User from '../../../../common/models/User'
import { getUser } from '../index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            if (!user.friends)
                return []

            const friends = []

            for (var friendId of user.friends) {
                friends.push(await User.findOne({ _id: friendId.id }))
            }

            for (var friend of friends) {
                friend.tasks = friend.tasks.filter(task => task.public)
            }

            res.status(200).json(friends)
        },
        onNotFound: () => {
            res.status(500).end('Authentication token is invalid, please log in')
        }
    })
}

export default Route