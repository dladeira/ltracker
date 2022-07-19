import { useUser } from '../common/lib/hooks'

import Grid from '../common/components/grid'
import Tasks from '../common/page_components/overview/tasks'
import Checklist from '../common/page_components/overview/checklist'
import Sleep from '../common/page_components/overview/sleep'
import TimeSpent from '../common/page_components/overview/timeSpent'

import styles from '../styles/overview.module.scss'

function Page() {
    const [user] = useUser({ userOnly: true })

    return (
        <Grid>
            <Tasks />

            <Sleep />

            <Checklist />

            <div className={`${styles.gridItem} ${styles.gridItemPhysical}`}>
                <h3 className={styles.gridTitle}>Physical Activity</h3>
            </div>

            <TimeSpent />

            <div className={`${styles.gridItem} ${styles.gridItemFriends}`}>
                <h3 className={styles.gridTitle}>Friends Recent</h3>
            </div>

            <div className={`${styles.gridItem} ${styles.gridItemMuscle}`}>
                <h3 className={styles.gridTitle}>Muscle Impact</h3>
            </div>
        </Grid>
    )
}

export default Page