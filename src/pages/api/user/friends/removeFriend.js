import User from '../../../../common/models/User'
import { getUser } from '../index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            const target = await User.findOne({ _id: req.body.id })

            if (target != null) {
                if (!user.friends)
                    return res.status(500).json(user)
                if (!target.friends)
                    return res.status(500).json(user)

                const indexInUser = user.friends.indexOf(target._id)
                const indexInTarget = target.friends.indexOf(user._id)

                if (indexInUser == -1 || indexInTarget == -1)
                    return res.status(500).json(user)


                user.friends.splice(indexInUser, 1)
                target.friends.splice(indexInTarget, 1)

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