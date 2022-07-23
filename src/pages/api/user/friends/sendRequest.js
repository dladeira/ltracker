import User from '../../../../common/models/User'
import { getUser } from '../index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            const target = await User.findOne({ _id: req.body.id })

            if (target != null) {
                if (!user.friendRequests)
                    user.friendRequests = []
                if (!target.friendRequests)
                    target.friendRequests = []

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