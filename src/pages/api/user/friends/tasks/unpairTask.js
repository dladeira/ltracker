import User from '../../../../../common/models/User'
import { getUser } from '../../index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            const target = await User.findOne({ _id: req.body.id })

            const thisTask = req.body.this
            const thatTask = req.body.that

            if (target != null) {
                const indexInUser = user.friends.findIndex(loop => loop.id == target._id)

                if (indexInUser == -1)
                    return res.status(404).json(user)

                const pairedTasks = user.friends[indexInUser].pairedTasks

                const taskIndex = pairedTasks.findIndex(task => task.this == thisTask)
                const targetTaskIndex = pairedTasks.findIndex(task => task.that == thatTask)

                if (taskIndex == -1 || targetTaskIndex == -1)
                    return res.status(404).json(user)

                user.friends[indexInUser].pairedTasks.splice(taskIndex, 1)

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