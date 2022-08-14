import { getUser } from './index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            switch (req.method) {
                case "PATCH":
                    user.username = req.body.username ? req.body.username : user.username
                    user.public = req.body.public !== undefined ? req.body.public == true : user.public
                    user.weeklyHourGoal = !isNaN(req.body.weeklyHourGoal) ? req.body.weeklyHourGoal : user.weeklyHourGoal
                    break;
            }

            await user.save()
            res.status(200).json(user)
        },
        onNotFound: () => {
            res.status(500).end('Authentication token is invalid, please log in')
        }
    })
}

export default Route