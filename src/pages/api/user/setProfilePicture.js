import { getUser } from './index'
import fs from 'fs'

async function Route(req, res) {
    await getUser(req, {
        onFound: async user => {
            req.body = JSON.parse(req.body)
            if (!req.body.image || (req.body.image && req.body.image.indexOf("data:image/jpeg;base64,") == -1))
                return res.status(400).json(user)

            var newImage = req.body.image.replace("data:image/jpeg;base64,", "")
            const buffer = Buffer.from(newImage, "base64");

            const oldImage = user.profilePicture + ""
            const random = Math.round(Math.random() * 1000)

            if (fs.existsSync(oldImage)) {
                fs.unlinkSync(oldImage)
            }

            fs.writeFileSync(`public/uploads/${user._id}_profilePicture_${random}.jpg`, buffer);

            user.profilePicture = `/uploads/${user._id}_profilePicture_${random}.jpg`
            await user.save()
            res.status(200).json(user)
        },
        onNotFound: () => {
            res.status(500).end('Authentication token is invalid, please log in')
        }
    })
}

export default Route