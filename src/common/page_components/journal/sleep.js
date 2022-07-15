import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getDay, getWeekDay } from '../../lib/util'

import styles from './sleep.module.scss'

function Component() {
    const [context] = useAppContext()
    const [user, setUser] = useUser({ userOnly: true })
    const dayIndex = getWeekDay(new Date())
    const [sleep, setSleep] = useState(getDefaultSleep())
    const [lastMouseUp, setLastMouseUp] = useState(context.lastMouseUp)

    useEffect(() => {
        if (context.lastMouseUp != lastMouseUp) {
            setLastMouseUp(context.lastMouseUp)
            saveSleep()
        }
    }, [context])

    function getDefaultSleep() {
        const day = getDay(user, dayIndex, context.week, context.year)

        return day.sleep ? day.sleep : 0
    }

    async function saveSleep() {
        const res = await fetch("/api/user/setSleep", {
            method: "POST",
            body: JSON.stringify({
                day: dayIndex,
                week: context.week,
                year: context.year,
                sleep: sleep
            })
        })
        const newUser = await res.json()
        setUser({ ...newUser })
        console.log(newUser)
    }

    async function updateSleep(e) {
        setSleep(e.target.value)
    }

    return (
        <div className="flex flex-col relative h-full w-full bg-white rounded-lg p-3.5 pt-1">
            <h3 className="text-lg font-medium">Sleep</h3>

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
        </div>
    )
}

export default Component