import { generateId } from '../../../common/lib/util';
import { getUser } from './index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            switch (req.method) {
                case "POST":
                    user.checklist.push({
                        id: generateId(),
                        name: req.body.name
                    })
                    break;
                case "PATCH":
                    var index = user.checklist.findIndex(checklist => checklist.id == req.body.id)

                    if (index == -1)
                        return res.status(404).json(user)

                    user.checklist[index].name = req.body.name ? req.body.name : user.checklist[index].name
                    break;
                case "DELETE":
                    user.checklist = user.checklist.filter(checklist => checklist.id != req.body.id)
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