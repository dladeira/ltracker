import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getWeeklyHours } from '../../lib/util'

import styles from './tasks.module.scss'

function Component() {
    const [context] = useAppContext()
    const [user] = useUser({ userOnly: true })

    return (
        <div className={styles.gridItem}>
            <h3 className={styles.gridTitle}>Tasks</h3>

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
                    {getWeeklyHours(user, context.week, context.year)}h
                </div>

                <div className={styles.slash}>
                    /
                </div>

                <div className={styles.hoursLast}>
                    {getWeeklyHours(user, context.week - 1, context.year)}h
                </div>

            </div>
        </div>
    )
}

export default Component