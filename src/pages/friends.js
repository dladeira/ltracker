import { useUser } from '../common/lib/hooks'

import Grid from '../common/components/grid'

import { ManageFriends, PairedTasks, Compare } from '../common/page_components/friends'

function Page() {
    useUser({ userOnly: true })

    return (
        <Grid>
            <Compare />
            <ManageFriends />
            <PairedTasks />
        </Grid>
    )
}

export default Page