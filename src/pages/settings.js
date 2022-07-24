import Grid from '../common/components/grid'
import { Tasks, Checklists, General } from '../common/page_components/settings/index'

function Page() {

    return (
        <Grid>
            <General />
            <Tasks />
            <Checklists />
        </Grid>
    )
}

export default Page