import { getUser } from './index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            switch (req.method) {
                case "PATCH":
                    var index = user.specialTasks.findIndex(task => task.id == req.body.id)

                    if (index == -1)
                        return res.status(404).json(user)

                    user.specialTasks[index].color = req.body.color ? req.body.color : user.specialTasks[index].color
                    user.specialTasks[index].public = req.body.public !== undefined ? req.body.public == true : user.specialTasks[index].public
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