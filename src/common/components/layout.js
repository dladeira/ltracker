import Image from 'next/image'
import { useAppContext } from '../lib/context'
import { useUser } from '../lib/hooks'
import { useMediaQuery } from 'react-responsive'
import Splash from './splash'

import Userbar from './userbar'

import styles from './layout.module.scss'
import DateControl from './dateControl'
import { useEffect, useState } from 'react'

function Component({ children }) {
    const [user] = useUser()
    const [context, setContext] = useAppContext()
    const [seen, setSeen] = useState(false)
    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })

    useEffect(() => {
        if (user != null & !seen) {
            setTimeout(() => {
                setSeen(true)
            }, 1000)
        }
    }, [user])

    var style = {}
    if (!isMobile) {
        style.paddingLeft = context.userbarOpen ? "230px" : "50px"
    }

    if (user === undefined) {
        return (
            <div />
        )
    }

    function mouseUpEvent() {
        context.lastMouseUp = new Date().getTime()
        setContext({ ...context })
    }

    return (user ?
        (
            <div className={styles.container} onMouseUp={mouseUpEvent} style={style}>
                <Splash display={user != null & !seen} />
                <ToggleUserbar />
                <Userbar />

                {isMobile ?
                    context.userbarOpen ? "" : children
                    : <DateControl />
                }

                {isMobile ?
                    context.userbarOpen ? "" : children
                    : children
                }

            </div>
        ) : (
            <div onMouseUp={mouseUpEvent}>
                {children}
            </div>
        )
    )
}

function ToggleUserbar() {
    const [context, setContext] = useAppContext()

    function toggleSidebar() {
        context.userbarOpen = !context.userbarOpen
        setContext({ ...context })
    }

    return (
        <div className={context.userbarOpen ? styles.buttonClose : styles.buttonOpen} onClick={toggleSidebar}>
            <div className={context.userbarOpen ? styles.buttonTextClose : styles.buttonTextOpen}>
                <Image src="/arrow-2.svg" height="20" width="20" />
            </div>
        </div>
    )
}

export default Component