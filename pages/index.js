import Link from 'next/link'
import Image from 'next/image'
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

            <nav className={styles.navbar}>

                <div className={styles.brand}>
                    LadeiraTracker
                </div>

                <Link href="/api/login"><a className={styles.login}>
                    Login
                </a></Link>

            </nav>


            <section className={styles.sectionMain}>
                <header className={styles.header}>

                    <h1 className={styles.title}>
                        The only time tracking app you need
                    </h1>

                    <h2 className={styles.subtitle}>
                        Manage your busy life and see what you spend your time on
                    </h2>

                    <Link href="/api/login"><button className={styles.cta}>
                        Get Started
                    </button></Link>
                    
                </header>

                <figure className={styles.pages}>

                    <image className={styles.page1}>
                        <Image src="/page-overview.png" layout="fill" />
                    </image>

                    <image className={styles.page3}>
                        <Image src="/page-journal.png" layout="fill" />
                    </image>

                    <image className={styles.page2}>
                        <Image src="/page-schedule.png" layout="fill" />
                    </image>

                </figure>

            </section>


            <section className={styles.sectionSecondary}>
                
            </section>
        </div>
    )
}

export default Page