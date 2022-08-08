import { useEffect, useState } from "react"
import { useMediaQuery } from "react-responsive"
import { useAppContext } from "../lib/context"
import { useUser } from '../lib/hooks'

import styles from "./tips.module.scss"

function Component() {
    const [context, setContext] = useAppContext()
    const [lastMouseUp, setLastMouseUp] = useState(context.lastMouseUp)
    const [user] = useUser({ userOnly: true })
    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })
    const [popup, setPopup] = useState(false)

    useEffect(() => {
        if (lastMouseUp != context.lastMouseUp) {
            setPopup(false)
            setLastMouseUp(context.lastMouseUp)
        }
    }, [context])

    useEffect(() => {
        const { top, left } = document.getElementById("tips-button").getBoundingClientRect()

        document.getElementById("tips-popup").style.top = top - 270 + "px"
        document.getElementById("tips-popup").style.left = left + "px"
    }, [popup])

    return (
        <div className={styles.container}>
            <button id="tips-button" className={styles.button} onClick={e => setPopup(!popup)}>
                <div className={styles.buttonBall} />
                <p className={styles.buttonText}>Random Tip</p>
            </button>
            <Popup display={popup ? "flex" : "none"} />
        </div>
    )
}

function Popup({ display }) {
    return (
        <div className={styles.popup} id="tips-popup" style={{ display: display }}>
            Average sleep will show the average so far
        </div>
    )
}

export default Component