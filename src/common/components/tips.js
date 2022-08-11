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
        console.log(height)

        document.getElementById("tips-popup").style.top = top - 20 - height + "px"
        document.getElementById("tips-popup").style.left = left + "px"
    }, [popup])

    return (
        <div className={styles.container}>
            <button id="tips-button" className={styles.button} onClick={e => { setPopup(true); setRegen(Math.random()) }}>
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

function getTip() {
    const tips = [
        "Average sleep will show the average so far into the week",
        "Use the lists tab to make sure you never forget to pack something for a trip again",
        "Checkout the github repository for this website on github.com/dladeira/ladeira-tracker"
    ]
    const index = Math.floor(Math.random() * tips.length)
    return tips[index]
}

export default Component