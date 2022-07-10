import { useUser } from '../lib/hooks'

import styles from '../styles/overview.module.scss'

function Page() {
    const [user] = useUser({ userOnly: true })

    return (
        <div className={styles.grid}>
            <div className={`${styles.gridItem} ${styles.gridItemTasks}`}>
                <h3 className={styles.gridTitle}>Tasks</h3>
            </div>

            <div className={`${styles.gridItem} ${styles.gridItemSleep}`}>
                <h3 className={styles.gridTitle}>Sleep</h3>
            </div>

            <div className={`${styles.gridItem} ${styles.gridItemChecklist}`}>
                <h3 className={styles.gridTitle}>Checklist</h3>
            </div>

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