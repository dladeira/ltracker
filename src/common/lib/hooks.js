import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'

import { useAppContext } from './context'
import User from './user'

const fetcher = (url) =>
    fetch(url)
        .then((r) => r.json())
        .then((data) => {
            return { user: data?.user || null }
        })

export function useUser({ userOnly, adminOnly } = {}) {
    const [context, setContext] = useAppContext()
    const { data, error } = useSWR('/api/user', fetcher)
    const userData = data?.user
    const finished = Boolean(data)
    const loggedIn = Boolean(userData)

    useEffect(() => {
        if (!finished)
            return

        if (!context.user) {
            context.user = userData
            setContext({ ...context })
        }

        if (
            // userOnly
            (!loggedIn && userOnly) ||
            // adminOnly
            (loggedIn && !data.user.admin && adminOnly)
        ) {
            return Router.push("/api/login")
        }
    }, [finished, userOnly, adminOnly])

    if (finished || context.user) {
        if (
            // userOnly
            (!loggedIn && userOnly) ||
            // adminOnly
            (loggedIn && !data.user.admin && adminOnly)
        ) {
            Router.push("/api/login")
        }
    }

    async function updateUser() {
        const res = await fetch("/api/user", {
            method: "POST"
        })
        const data = await res.json()
        context.user = data.user;
        setContext({ ...context })
    }

    var user = context.user ? new User(context.user) : context.user
    
    return error ? null : [user, e => { context.user = e; setContext({ ...context }) }, updateUser]
}