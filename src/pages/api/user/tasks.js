import { generateId } from '../../../common/lib/util';
import { getUser } from './index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            switch (req.method) {
                case "POST":
                    user.tasks.push({
                        id: generateId(),
                        name: req.body.name,
                        color: req.body.color,
                        public: req.body.public
                    })
                    break;
                case "PATCH":
                    var index = user.tasks.findIndex(task => task.id == req.body.id)

                    if (index == -1)
                        return res.status(404).json(user)

                    user.tasks[index].name = req.body.name ? req.body.name : user.tasks[index].name
                    user.tasks[index].color = req.body.color ? req.body.color : user.tasks[index].color
                    user.tasks[index].public = req.body.public !== undefined ? req.body.public == true : user.tasks[index].public
                    break;
                case "DELETE":
                    user.tasks = user.tasks.filter(task => task.id != req.body.id)
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