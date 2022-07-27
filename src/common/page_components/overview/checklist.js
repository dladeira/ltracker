import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import GridItem from '../../components/gridItem'


import styles from './checklist.module.scss'

export function Checklist() {
    const [context] = useAppContext()
    const [user] = useUser({ userOnly: true })

    return (
        <GridItem title="Checklist">

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
        </GridItem>
    )
}