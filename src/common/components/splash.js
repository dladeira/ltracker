import { useState } from "react"
import { getTip } from "../lib/util"

import styles from './splash.module.scss'

function Component({ display }) {
    const [tip] = useState(getTip())
    return (
        <div className={display ? styles.container : styles.containerHidden}>
            <div className={styles.wrapper}>
                <div className={styles.title}>LTracker</div>
                <div className={styles.subtitle}>Steam library but for productivity</div>
                <div className={styles.tipHeader}>Random tip</div>
                <div className={styles.tip}>{tip}</div>
            </div>
        </div>
    )
}

export default Component