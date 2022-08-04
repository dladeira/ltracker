import { useUser } from '../common/lib/hooks'


import Grid from '../common/components/grid'
import GridItem from '../common/components/gridItem'
import { Tasks, Checklist, Sleep, TimeSpent, MuscleImpact, PhysicalActivity } from '../common/page_components/overview/index'

function Page() {
    useUser({ userOnly: true })

    return (
        <Grid>
            <Tasks />

            <Sleep />

            <Checklist />

            <PhysicalActivity />

            <TimeSpent />

            <GridItem colSpan="1" rowSpan="2" title="Friends Recent" />


            <MuscleImpact />

        </Grid>
    )
}

export default Page