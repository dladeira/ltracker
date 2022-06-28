import { useUser } from '../lib/hooks'

import Userbar from '../components/userbar'

function Component({ children }) {
    const [user] = useUser()

    if (user === undefined) {
        return (
            <div>LOADING YOU RETARD</div>
        )
    }

    console.log(user)

    return (user ?
        (
            <div>
                <Userbar />
                {children}
            </div>
        ) : (
            <div>

                {children}
            </div>
        )
    )
}

export default Component