import { getUser } from './index'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)

            const newUsername = req.body.username
            const result = /^[\w\-\s]{4,20}$/.test(newUsername)

            if (result)
                user.username = newUsername

            await user.save()
            res.status(200).json(user)
        },
        onNotFound: () => {
            res.status(500).end('Authentication token is invalid, please log in')
        }
    })
}

export default Route