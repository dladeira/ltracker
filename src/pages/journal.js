import { useUser } from '../common/lib/hooks'

import styles from '../styles/journal.module.scss'

import Productivity from '../common/page_components/journal/productivity'
import Checklist from '../common/page_components/journal/checklist'
import Sleep from '../common/page_components/journal/sleep'
import Energy from '../common/page_components/journal/energy'

function Page() {
    useUser({ userOnly: true })

    return (
        <div className={styles.grid}>
            <Productivity />

            <Energy />

            <Sleep />

            <div className={`${styles.gridItem} ${styles.gridItemEntry}`}>
                <h3 className={styles.gridTitle}>Text Entry</h3>
            </div>

            <Checklist />
        </div >
    )
}

export default Page