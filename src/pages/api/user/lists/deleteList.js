import { generateId } from '../../../../common/lib/util'
import { getUser } from '../index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            if (!user.lists)
                return

            user.lists = user.lists.filter(list => {
                return list.id != req.body.listId
            })

            await user.save()
            res.status(200).json(user)
        },
        onNotFound: () => {
            res.status(500).end('Authentication token is invalid, please log in')
        }
    })
}

export default Route