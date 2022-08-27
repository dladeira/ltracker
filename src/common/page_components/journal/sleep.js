import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import GridItem from '../../components/gridItem'

import styles from './sleep.module.scss'

function Component() {
    const [context] = useAppContext()
    const [user, setUser] = useUser({ userOnly: true })
    const [sleep, setSleep] = useState(user.getSleepForDay(context.day, context.week, context.year))
    const [lastMouseUp, setLastMouseUp] = useState(context.lastMouseUp)
    const [initial, setInitial] = useState(true)
    const [lastDate, setLastDate] = useState(context.day + context.week + context.year)

    useEffect(() => {
        if (initial)
            return setInitial(false)

        const date = context.day + context.week + context.year
        if (date != lastDate) {
            setLastDate(date)
            setSleep(user.getSleepForDay(context.day, context.week, context.year))
            return
        }

        if (context.lastMouseUp != lastMouseUp) {
            setLastMouseUp(context.lastMouseUp)
            saveSleep()
        }
    }, [context])

    async function saveSleep() {
        const res = await fetch("/api/user/setSleep", {
            method: "POST",
            body: JSON.stringify({
                day: context.day,
                week: context.week,
                year: context.year,
                sleep: sleep
            })
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    async function updateSleep(e) {
        setSleep(e.target.value)
    }

    return (
        <GridItem title="Sleep">
            <div className={styles.container}>

                <div className={styles.levelsContainer}>
                    <h3 className={styles.sleep}>{sleep}h</h3>
                    <h4 className={styles.header}>Levels of Sleep</h4>
                    <p className={styles.level}><span className={styles.red}>{"<6h"}</span> Not enough</p>
                    <p className={styles.level}><span className={styles.green}>{">7h"}</span> Sufficient</p>
                    <p className={styles.level}><span className={styles.blue}>{">9h"}</span> Excellent</p>
                </div>

                <div className={styles.sliderWrapper}>
                    <div className={styles.sliderContainer}>
                        <input className={styles.slider} type="range" min="1" max="14" step="0.25" value={sleep} onChange={updateSleep} />
                    </div>
                </div>
            </div>
        </GridItem>
    )
}

export default Component