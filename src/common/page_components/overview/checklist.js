import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getWeeklyChecklistInfo } from '../../lib/util'

import styles from './checklist.module.scss'

function Component() {
    const [context] = useAppContext()
    const [user] = useUser({ userOnly: true })
    const info = getWeeklyChecklistInfo(user, context.week, context.year)

    return (
        <div className={styles.gridItem}>
            <h3 className={styles.gridTitle}>Checklist</h3>

            <div className={styles.header}>

                <div className={styles.headerThis}>
                    complete
                </div>

                <div className={styles.headerLast}>
                    incomplete
                </div>

            </div>
            <div className={styles.hours}>

                <div className={styles.hoursThis}>
                    {info.complete}
                </div>

                <div className={styles.slash}>
                    /
                </div>

                <div className={styles.hoursLast}>
                    {info.incomplete}
                </div>

            </div>
        </div>
    )
}

export default Component