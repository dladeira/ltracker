import { useUser } from '../common/lib/hooks'

import Tasks from '../common/page_components/overview/tasks'
import Checklist from '../common/page_components/overview/checklist'
import Grid from '../common/components/grid'

import styles from '../styles/overview.module.scss'

function Page() {
    const [user] = useUser({ userOnly: true })

    return (
        <Grid>
            <Tasks />

            <div className={`${styles.gridItem} ${styles.gridItemSleep}`}>
                <h3 className={styles.gridTitle}>Sleep</h3>
            </div>

            <Checklist />

            <div className={`${styles.gridItem} ${styles.gridItemPhysical}`}>
                <h3 className={styles.gridTitle}>Physical Activity</h3>
            </div>

            <div className={`${styles.gridItem} ${styles.gridItemTime}`}>
                <h3 className={styles.gridTitle}>Time Spent</h3>
            </div>

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