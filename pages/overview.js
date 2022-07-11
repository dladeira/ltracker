import { useUser } from '../lib/hooks'

import Tasks from '../components/overview/tasks'
import Checklist from '../components/overview/checklist'

import styles from '../styles/overview.module.scss'

function Page() {
    const [user] = useUser({ userOnly: true })

    return (
        <div className={styles.grid}>
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
        </div >
    )
}

export default Page