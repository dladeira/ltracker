import { useEffect, useState } from 'react'
import { useUser } from '../common/lib/hooks'
import Grid from '../common/components/grid'
import GridItem from '../common/components/gridItem'
import { Tasks, Checklist, Sleep, TimeSpent, MuscleImpact, PhysicalActivity } from '../common/page_components/overview/index'
import Splash from '../common/components/splash'

function Page({ firstLoad }) {
    const [initial, setInitial] = useState(firstLoad)
    useUser({ userOnly: true })

    useEffect(() => {
        setTimeout(() => {
            setInitial(false)
        }, 1000)
    }, [])

    return (
        <Grid>
            <Splash display={initial} />

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

Page.getInitialProps = async ({ req }) => {
    return {
        firstLoad: req !== undefined
    }
}

export default Page