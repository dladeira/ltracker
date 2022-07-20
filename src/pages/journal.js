import { useUser } from '../common/lib/hooks'

import styles from '../styles/journal.module.scss'

import Productivity from '../common/page_components/journal/productivity'
import Checklist from '../common/page_components/journal/checklist'
import Sleep from '../common/page_components/journal/sleep'
import Energy from '../common/page_components/journal/energy'
import TextEntry from '../common/page_components/journal/textEntry'
import { useAppContext } from '../common/lib/context'

function Page() {
    useUser({ userOnly: true })

    return (
        <div className={styles.grid}>
            <Productivity />

            <Energy />

            <Sleep />

            <TextEntry />

            <Checklist />
        </div >
    )
}

export default Page