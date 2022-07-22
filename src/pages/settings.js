import Grid from '../common/components/grid'
import { Tasks, Checklists } from '../common/page_components/settings/index'

import styles from '../styles/settings.module.scss'

function Page() {

    return (
        <Grid>
            <div className={styles.gridItem} />
            <Tasks />
            <Checklists />
            <div className={styles.gridItem} />
            <div className={styles.gridItem} />
            <div className={styles.gridItem} />
            <div className={styles.gridItem} />
            <div className={styles.gridItem} />
            <div className={styles.gridItem} />
            <div className={styles.gridItem} />
            <div className={styles.gridItem} />
        </Grid>
    )
}

export default Page