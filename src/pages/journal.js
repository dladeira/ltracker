import { useUser } from '../common/lib/hooks'

import Grid from '../common/components/grid'
import Productivity from '../common/page_components/journal/productivity'
import Checklist from '../common/page_components/journal/checklist'
import Sleep from '../common/page_components/journal/sleep'
import Energy from '../common/page_components/journal/energy'
import TextEntry from '../common/page_components/journal/textEntry'

function Page() {
    useUser({ userOnly: true })

    return (
        <Grid>
            <Productivity />

            <Energy />

            <Sleep />

            <TextEntry />

            <Checklist />
        </Grid >
    )
}

export default Page