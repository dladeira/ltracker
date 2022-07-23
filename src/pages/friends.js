import { useUser } from '../common/lib/hooks'

import Grid from '../common/components/grid'

import { ManageFriends } from '../common/page_components/friends'

function Page() {
    useUser({ userOnly: true })

    return (
        <Grid>
            <ManageFriends />
        </Grid>
    )
}

export default Page