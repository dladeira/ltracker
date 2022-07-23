import User from '../../../../common/models/User'
import { getUser } from '../index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            const target = await User.findOne({ _id: req.body.id })

            if (target != null) {
                if (!user.friendRequests)
                    res.status(404).json(user)
                if (!target.friendRequests)
                    res.status(404).json(user)

                const indexInUser = user.friendRequests.findIndex(loopUser => loopUser.target == req.body.id && loopUser.sent == false)
                const indexInTarget = target.friendRequests.findIndex(loopUser => loopUser.target == user._id && loopUser.sent == true)

                if (indexInUser == -1 || indexInTarget == -1)
                    return res.status(404).json(user)


                user.friendRequests.splice(indexInUser, 1)
                target.friendRequests.splice(indexInTarget, 1)


                if (!user.friends)
                    user.friends = []
                if (!target.friends)
                    target.friends = []

                user.friends.push(target._id)
                target.friends.push(user._id)

                await user.save()
                await target.save()

                return res.status(200).json(user)
            }

            res.status(404).json(user)
        },
        onNotFound: () => {
            res.status(500).end('Authentication token is invalid, please log in')
        }
    })
}

export default Route