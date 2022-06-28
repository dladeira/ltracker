import Iron from '@hapi/iron'
import { serialize, parse } from 'cookie'

import User from '../models/User'

const TOKEN_SECRET = process.env.TOKEN_SECRET
const TOKEN_NAME = 'token'
const MAX_AGE = 60 * 60 * 8 // 8 hours

export async function setLoginSession(res, session) {
    const createdAt = Date.now()
    // Create a session object with a max age that we can validate later
    const obj = { ...session, createdAt, maxAge: MAX_AGE }

    const token = await Iron.seal(obj, TOKEN_SECRET, Iron.defaults)
    setTokenCookie(res, token)
}

export async function getLoginSession(req) {
    const token = getTokenCookie(req)

    if (!token) return

    const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults)
    const expiresAt = session.createdAt + session.maxAge * 1000

    const user = User.findOne({ email: session.email })

    // Validate the expiration date of the session
    if (Date.now() > expiresAt) {
        throw new Error('Session expired')
    }

    return user
}

export async function removeLoginSession(req) {
    return removeTokenCookie(req)
}

// COOKIES

function setTokenCookie(res, token) {
    const cookie = serialize(TOKEN_NAME, token, {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    })

    res.setHeader('Set-Cookie', cookie)
}

function removeTokenCookie(res) {
    const cookie = serialize(TOKEN_NAME, '', {
        maxAge: -1,
        path: '/',
    })

    res.setHeader('Set-Cookie', cookie)
}

function parseCookies(req) {
    // For API Routes we don't need to parse the cookies.
    if (req.cookies) return req.cookies

    // For pages we do need to parse the cookies.
    const cookie = req.headers?.cookie
    return parse(cookie || '')
}

function getTokenCookie(req) {
    const cookies = parseCookies(req)
    return cookies[TOKEN_NAME]
}