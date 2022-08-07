import { useAppContext } from '../lib/context'
import { useUser } from '../lib/hooks'
import { useMediaQuery } from 'react-responsive'

import Userbar from './userbar'

import styles from './layout.module.scss'
import DateControl from './dateControl'



function Component({ children }) {
    const [user] = useUser()
    const [context, setContext] = useAppContext()

    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })

    if (user === undefined) {
        return (
            <div />
        )
    }

    function mouseUpEvent() {
        context.lastMouseUp = new Date().getTime()
        setContext({ ...context })
    }

    var style = {}
    if (!isMobile) {
        style.paddingLeft = context.userbarOpen ? "210px" : "50px"
    }

    return (user ?
        (
            <div className={styles.container} onMouseUp={mouseUpEvent} style={style}>
                <ToggleUserbar />
                <Userbar />

                {isMobile ?
                    context.userbarOpen ? "" : children
                    : (
                        <>
                            <DateControl />
                            {children}
                        </>
                    )
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
    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })

    function toggleSidebar() {
        context.userbarOpen = !context.userbarOpen
        setContext({ ...context })
    }

    return (
        <div className={context.userbarOpen ? styles.buttonClose : styles.buttonOpen} style={{ transition: context.userbarOpen && !isMobile ? "left 500ms cubic-bezier(.60,.03,.52,.96)" : "left 500ms cubic-bezier(.46,.03,.52,.96)" }} onClick={toggleSidebar}>
            <div className={styles.buttonText}>{context.userbarOpen ? "<" : ">"}</div>
        </div>
    )
}

export default Component