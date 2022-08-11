import { useEffect, useState } from "react"
import { useMediaQuery } from "react-responsive"
import { useAppContext } from "../lib/context"
import { useUser } from '../lib/hooks'
import { getTip } from "../lib/util"

import styles from "./tips.module.scss"

function Component() {
    const [context, setContext] = useAppContext()
    const [lastMouseUp, setLastMouseUp] = useState(context.lastMouseUp)
    const [user] = useUser({ userOnly: true })
    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })
    const [popup, setPopup] = useState(false)
    const [regen, setRegen] = useState(Math.random())

    useEffect(() => {
        if (lastMouseUp != context.lastMouseUp) {
            setPopup(false)
            setLastMouseUp(context.lastMouseUp)
        }
    }, [context])

    useEffect(() => {
        const { top, left } = document.getElementById("tips-button").getBoundingClientRect()
        const height = document.getElementById("tips-popup").style.height.substring(0, document.getElementById("tips-popup").style.height.length - 2)

        document.getElementById("tips-popup").style.top = top - 20 - height + "px"
        document.getElementById("tips-popup").style.left = left + "px"
    }, [popup])

    return (
        <div className={styles.container}>
            <button id="tips-button" className={styles.button} onClick={e => { setRegen(Math.random()); setPopup(true) }}>
                <div className={styles.buttonBall} />
                <p className={styles.buttonText}>Random Tip</p>
            </button>
            <Popup display={popup ? "flex" : "none"} regen={regen} />
        </div>
    )
}

function Popup({ display, regen }) {
    const [tip, setTip] = useState(getTip())

    useEffect(() => {
        setTip(getTip())
    }, [regen])

    return (
        <div className={styles.popup} onMouseUp={e => e.stopPropagation()} id="tips-popup" style={{ display: display, height: "100px" }}>
            {tip}
        </div>
    )
}

export default Component