import User from '../../../../common/models/User'
import { getUser } from '../index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {

            if (req.body)
                req.body = JSON.parse(req.body)

            if (!user.friends)
                user.friends = []

            switch (req.method) {
                case "GET":
                    const friends = []

                    for (var friendId of user.friends) {
                        const friend = await User.findOne({ _id: friendId.id })
                        friend.tasks = friend.tasks.filter(task => task.public)
                        friends.push(friend)
                    }

                    return res.status(200).json(friends)
                case "DELETE":
                    const target = await User.findOne({ _id: req.body.id })

                    if (target == null || !target.friends)
                        return res.status(404).json(user)

                    const indexInUser = user.friends.findIndex(loop => loop.id == target._id)
                    const indexInTarget = target.friends.findIndex(loop => loop.id == user._id)
                    if (indexInUser == -1 || indexInTarget == -1)
                        return res.status(500).json(user)

                    user.friends.splice(indexInUser, 1)
                    target.friends.splice(indexInTarget, 1)

                    await user.save()
                    await target.save()

                    break;
            }
            return res.status(200).json(user)
        },
        onNotFound: () => {
            res.status(500).end('Authentication token is invalid, please log in')
        }
    })
}

export default Route