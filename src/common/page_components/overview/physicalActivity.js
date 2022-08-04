import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getIncrementInfo } from '../../lib/util'
import GridItem from '../../components/gridItem'


import styles from './tasks.module.scss'

export function PhysicalActivity() {
    const [context] = useAppContext()
    const [user] = useUser({ userOnly: true })
    const [lastWeek, lastYear] = getIncrementInfo(context.week, context.year, -1)

    return (
        <GridItem title="Physical Activity">

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
                    {Math.round(user.getPhysicalForWeek(context.week, context.year))}h
                </div>

                <div className={styles.slash}>
                    /
                </div>

                <div className={styles.hoursLast}>
                    {Math.round(user.getPhysicalForWeek(lastWeek, lastYear))}h
                </div>

            </div>
        </GridItem>
    )
}