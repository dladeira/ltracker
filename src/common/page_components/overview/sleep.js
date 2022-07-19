import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getIncrementInfo, getWeekSleepAverage } from '../../lib/util'

import styles from './sleep.module.scss'

function Component() {
    const [context] = useAppContext()
    const [user] = useUser({ userOnly: true })
    const [lastWeek, lastYear] = getIncrementInfo(context.week, context.year, false)

    return (
        <div className="h-full w-full bg-white rounded-lg p-3.5 pt-1">
            <h3 className="text-lg font-medium">Sleep</h3>

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
                    {getWeekSleepAverage(user, context.week, context.year)}h
                </div>

                <div className={styles.slash}>
                    /
                </div>

                <div className={styles.hoursLast}>
                    {getWeekSleepAverage(user, context.week - 1, lastYear)}h
                </div>

            </div>
        </div>
    )
}

export default Component