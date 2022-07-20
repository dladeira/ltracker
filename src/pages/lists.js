import { useUser } from '../common/lib/hooks'

import Grid from '../common/components/grid'
import List from '../common/page_components/lists/list'
import AddList from '../common/page_components/lists/addList'

function Page() {
    const [user] = useUser({ userOnly: true })

    return (
        <Grid>
            {user.lists ? user.lists.map(list => {
                return <List key={list.id} list={list} />
            }) : ""}
            <AddList />
        </Grid>
    )
}

export default Page