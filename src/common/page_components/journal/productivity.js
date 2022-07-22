import Image from 'next/image'

import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getIncrementInfo, getWeeklyHours } from '../../lib/util'

import styles from './productivity.module.scss'

function Component() {
    const [context] = useAppContext()
    const [user] = useUser({ userOnly: true })
    const [lastWeek, lastYear] = getIncrementInfo(context.week, context.year, false)

    var batteryRatio = Math.round(user.getHoursForWeek(context.week, context.year) / user.getWeeklyHourGoal() * 100)
    batteryRatio = batteryRatio > 100 ? 100 : batteryRatio
    const batteryNumber = 210 - (batteryRatio / 100 * 210)

    return (
        <div className={styles.gridItem}>
            <h3 className={styles.gridTitle}>Productivity</h3>

            <div className={styles.header}>

                <div className={styles.headerThis}>
                    this week
                </div>

                <div className={styles.headerLast}>
                    last week
                </div>

            </div>
            <div className={styles.hours}>

                <div className={styles.hoursThis}>
                    {user.getHoursForWeek(context.week, context.year)}
                </div>

                <div className={styles.slash}>
                    /
                </div>

                <div className={styles.hoursLast}>
                    {user.getHoursForWeek(lastWeek, lastYear)}
                </div>

            </div>

            <section className={styles.batterySection}>
                <div className={styles.battery}>
                    <div className={styles.batteryBackground}><Image src="/battery-icon.svg" height={200} width={120} /></div>
                    <div className={styles.batteryMeter} style={{ top: (batteryNumber) + "px" }} />
                    <Image src="/battery-icon-mask.svg" height={200} width={120} />
                </div>

                <article className={styles.goal}>
                    <h1 className={styles.goalTitle}>
                        Weekly Goal
                    </h1>
                    <p className={styles.goalText}>{batteryRatio}%</p>
                    <p className={styles.goalSubText}>( {user.getHoursForWeek(context.week, context.year)} / {user.getWeeklyHourGoal()} )</p>
                </article>
            </section>
        </div>
    )
}

export default Component