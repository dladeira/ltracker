import { generateId } from '../../../../common/lib/util'
import { getUser } from '../index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            var listNumber = 0

            if (!user.lists)
                user.lists = []

            mainLoop:
            while (true) {
                for (var list of user.lists) {
                    if (list.name == "New List " + listNumber) {
                        listNumber++
                        continue mainLoop
                    }
                }
                break;
            }

            user.lists.push({
                name: "New List " + listNumber,
                dynamic: false,
                items: [
                    {
                        name: "Shirt",
                        id: generateId(user)
                    },
                    {
                        name: "Pants",
                        id: generateId(user)
                    },
                    {
                        name: "Shoes",
                        id: generateId(user)
                }
                ],
                id: generateId(user)
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