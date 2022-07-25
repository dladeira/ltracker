import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getIncrementInfo } from '../../lib/util'

import styles from './tasks.module.scss'

export function Tasks() {
    const [context] = useAppContext()
    const [user] = useUser({ userOnly: true })
    const [lastWeek, lastYear] = getIncrementInfo(context.week, context.year, -1)

    return (
        <div className="h-full w-full bg-white rounded-lg p-3.5 pt-1">
            <h3 className="text-lg font-medium">Tasks</h3>

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
                    {Math.round(user.getHoursForWeek(context.week, context.year))}h
                </div>

                <div className={styles.slash}>
                    /
                </div>

                <div className={styles.hoursLast}>
                    {Math.round(user.getHoursForWeek(lastWeek, lastYear))}h
                </div>

            </div>
        </div>
    )
}