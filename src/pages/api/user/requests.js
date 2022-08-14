import User from '../../../common/models/User'
import { getUser } from './index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            const target = await User.findOne({ _id: req.body.id })

            if (target == null)
                return res.status(404).json(user)

            if (!user.friends)
                user.friends = []

            if (!user.friendRequests)
                user.friendRequests = []

            if (!target.friendRequests)
                target.friendRequests = []

            switch (req.method) {
                case "PUT":
                    if (user.friendRequests.findIndex(loopUser => loopUser.target == req.body.id) != -1)
                        return res.status(400).json(user)

                    target.friendRequests.push({
                        target: user._id,
                        sent: false
                    })
                    await target.save()


                    user.friendRequests.push({
                        target: target._id,
                        sent: true
                    })
                    await user.save()
                    break;
                case "DELETE":
                    var indexInUser = user.friendRequests.findIndex(loopUser => loopUser.target == req.body.id || loopUser.target == user._id)
                    var indexInTarget = target.friendRequests.findIndex(loopUser => loopUser.target == req.body.id || loopUser.target == user._id)

                    if (indexInUser == -1 || indexInTarget == -1)
                        return res.status(404).json(user)


                    user.friendRequests.splice(indexInUser, 1)
                    await user.save()
                    target.friendRequests.splice(indexInTarget, 1)
                    await target.save()
                    break;
                case "POST":
                    var indexInUser = user.friendRequests.findIndex(loopUser => loopUser.target == req.body.id && loopUser.sent == false)
                    var indexInTarget = target.friendRequests.findIndex(loopUser => loopUser.target == user._id && loopUser.sent == true)

                    if (indexInUser == -1 || indexInTarget == -1)
                        return res.status(404).json(user)


                    user.friendRequests.splice(indexInUser, 1)
                    target.friendRequests.splice(indexInTarget, 1)

                    const fIndexInUser = user.friends.findIndex(loopUser => loopUser.target == user._id || loopUser.target == target._id)
                    const fIndexInTarget = target.friends.findIndex(loopUser => loopUser.target == user._id || loopUser.target == target._id)

                    if (fIndexInUser != -1 || fIndexInTarget != -1)
                        return res.status(400).json(user)

                    user.friends.push({
                        id: target._id,
                        pairedTasks: []
                    })
                    target.friends.push({
                        id: user._id,
                        pairedTasks: []
                    })

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