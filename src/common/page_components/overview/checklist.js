import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'

import styles from './checklist.module.scss'

export function Checklist() {
    const [context] = useAppContext()
    const [user] = useUser({ userOnly: true })

    return (
        <div className="h-full w-full bg-white rounded-lg p-3.5 pt-1">
            <h3 className="text-lg font-medium">Checklist</h3>

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
                    {user.getChecklistForWeek(context.week, context.year)[0]}
                </div>

                <div className={styles.slash}>
                    /
                </div>

                <div className={styles.hoursLast}>
                    {user.getChecklistForWeek(context.week, context.year)[1]}
                </div>

            </div>
        </div>
    )
}