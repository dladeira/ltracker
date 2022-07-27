import { useUser } from '../common/lib/hooks'


import Grid from '../common/components/grid'
import GridItem from '../common/components/gridItem'
import { Tasks, Checklist, Sleep, TimeSpent } from '../common/page_components/overview/index'

function Page() {
    useUser({ userOnly: true })

    return (
        <Grid>
            <Tasks />

            <Sleep />

            <Checklist />

            <GridItem title="Physical Activity" />

            <TimeSpent />

            <GridItem colSpan="1" rowSpan="2" title="Friends Recent" />


            <GridItem colSpan="1" rowSpan="2" title="Muscle Impact" />

        </Grid>
    )
}

export default Page