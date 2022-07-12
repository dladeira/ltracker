import { useUser } from '../common/lib/hooks'

import styles from '../styles/journal.module.scss'

import Productivity from '../common/page_components/journal/productivity'
import Checklist from '../common/page_components/journal/checklist'

function Page() {
    useUser({ userOnly: true })

    return (
        <div className={styles.grid}>
            <Productivity />

            <div className={`${styles.gridItem} ${styles.gridItemEnergy}`}>
                <h3 className={styles.gridTitle}>Energy Levels</h3>
            </div>

            <div className={`${styles.gridItem} ${styles.gridItemSleep}`}>
                <h3 className={styles.gridTitle}>Sleep</h3>
            </div>

            <div className={`${styles.gridItem} ${styles.gridItemEntry}`}>
                <h3 className={styles.gridTitle}>Text Entry</h3>
            </div>

            <Checklist />
        </div >
    )
}

export default Page