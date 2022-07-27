import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getIncrementInfo } from '../../lib/util'
import GridItem from '../../components/gridItem'


import styles from './sleep.module.scss'

export function Sleep() {
    const [context] = useAppContext()
    const [user] = useUser({ userOnly: true })
    const [lastWeek, lastYear] = getIncrementInfo(context.week, context.year, -1)

    return (
        <GridItem title="Sleep">

            <div className={styles.header}>

                <div className={styles.headerThis}>
                    avg this week
                </div>

                <div className={styles.headerLast}>
                    avg last week
                </div>

            </div>
            <div className={styles.hours}>

                <div className={styles.hoursThis}>
                    {Math.round(user.getSleepForWeek(context.week, context.year) / 7 * 2) / 2}h
                </div>

                <div className={styles.slash}>
                    /
                </div>

                <div className={styles.hoursLast}>
                    {Math.round(user.getSleepForWeek(lastWeek, lastYear) / 7 * 2) / 2}h
                </div>

            </div>
        </GridItem>
    )
}