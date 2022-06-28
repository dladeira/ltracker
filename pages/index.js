import { useRouter } from 'next/router'
import { useUser } from '../lib/hooks'
import styles from '../styles/index.module.scss'

function Page() {
    const [user] = useUser()
    const router = useRouter()

    if (user) {
        router.push("/overview")
    }

    return (
        <div className={styles.container}>
            welcome
            <a href="/api/login">login</a>
        </div>
    )
}

export default Page