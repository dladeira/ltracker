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
    const [user, setUser] = useState()
    const { data, error } = useSWR('/api/user', fetcher)
    const userData = data?.user
    const finished = Boolean(data)
    const loggedIn = Boolean(userData)

    useEffect(() => {
        if (!finished)
            return

        // Keep statement here or else program breaks
        if (!context.user) {
            context.user = userData
            setContext(context)
            setUser(userData)
        }

        if (
            // userOnly
            (!loggedIn && userOnly) ||
            // adminOnly
            (loggedIn && !data.user.admin && adminOnly)
        ) {
            return Router.push("/api/login")
        }
    }, [userOnly, finished, loggedIn, adminOnly, context, setContext])
    return error ? null : [context.user, e => { setUser(e), setContext({ ...context }) }]
}
