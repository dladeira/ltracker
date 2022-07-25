import Grid from '../common/components/grid'
import { WeeklyStats, TasksData } from '../common/page_components/statistics/index'

function Page() {

    return (
        <Grid>
            <WeeklyStats />
            <TasksData />
        </Grid>
    )
}

export default Page