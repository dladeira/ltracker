import { useEffect, useState } from 'react'
import Router from 'next/router'
import useSWR from 'swr'

import { useAppContext } from './context'

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
    }, [finished])
    // return error ? null : [context.user, e => { setUser(e); context.user = e; setContext({ ...context }) }]
    // return error ? null : [user, e => { setUser(e); }]
    return error ? null : [context.user, e => { context.user = e; setContext({ ...context }) }]
}
