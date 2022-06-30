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
            <div className={styles.cta}>
                <a className={styles.ctaText} href="/api/login">get started</a>
            </div>
        </div>
    )
}

export default Page