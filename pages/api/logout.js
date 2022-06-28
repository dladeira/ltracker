import { removeLoginSession } from '../../lib/auth'

export default async function logout(req, res) {
    removeLoginSession(res)
    res.redirect('/')
}