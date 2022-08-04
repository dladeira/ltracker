import Grid from '../common/components/grid'
import { Tasks, Checklists, General, SpecialTasks } from '../common/page_components/settings/index'

function Page() {

    return (
        <Grid>
            <General />
            <Tasks />
            <Checklists />
            <SpecialTasks />
        </Grid>
    )
}

export default Page