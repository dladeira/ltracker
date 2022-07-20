import { getUser } from '../index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            if (!user.lists)
                return

            const listIndex = user.lists.findIndex(list => {
                return list.id == req.body.listId
            })

            if (listIndex > -1) {
                user.lists[listIndex] = req.body.list
            } else {
                return res.status(400).send()
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