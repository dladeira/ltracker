import { useUser } from '../lib/hooks'

import styles from '../styles/journal.module.scss'

function Page() {
    const [user] = useUser({ userOnly: true })

    return (
        <div className={styles.grid}>
            <div className={`${styles.gridItem} ${styles.gridItemBattery}`}>
                <h3 className={styles.gridTitle}>Productivity</h3>
            </div>

            <div className={`${styles.gridItem} ${styles.gridItemEnergy}`}>
                <h3 className={styles.gridTitle}>Energy Levels</h3>
            </div>

            <div className={`${styles.gridItem} ${styles.gridItemSleep}`}>
                <h3 className={styles.gridTitle}>Sleep</h3>
            </div>

            <div className={`${styles.gridItem} ${styles.gridItemEntry}`}>
                <h3 className={styles.gridTitle}>Text Entry</h3>
            </div>
            
            <div className={`${styles.gridItem} ${styles.gridItemChecklist}`}>
                <h3 className={styles.gridTitle}>Checklist</h3>
            </div>
        </div >
    )
}

export default Page