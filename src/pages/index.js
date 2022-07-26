import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useUser } from '../common/lib/hooks'
import styles from '../styles/index.module.scss'

function Page() {
    const [user] = useUser()
    const router = useRouter()

    if (user) {
        router.push("/overview")
    }

    return (
        <div>

            <nav className={styles.navbarWrapper}>
                <div className={`${styles.navbar} flex flex-row justify-between items-center`}>

                    <div className={styles.brand}>
                        LadeiraTracker
                    </div>

                    <Link href="/api/login">
                        <a className={styles.login}>
                            Login
                        </a>
                    </Link>

                </div>
            </nav>


            <section className={styles.sectionMain}>
                <header className={styles.header}>

                    <h1 className={styles.title}>
                        A time tracking app
                    </h1>

                    <h2 className={styles.subtitle}>
                        It's like Steam playtime but for productivity
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
                <h3 className={styles.cardsTitle}>Features list</h3>
                <section className={styles.sectionCards}>
                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}>Keep track of weekly productivity</h3>
                    </article>


                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}>See what you spend your time on</h3>
                    </article>


                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}>Organize yourself with a schedule</h3>
                    </article>


                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}>Check off daily TODO items</h3>
                    </article>


                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}>Record your energy and sleep</h3>
                    </article>


                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}>Compare against friends</h3>
                    </article>


                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}>A built-in diary</h3>
                    </article>


                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}>And a bulit-in packing list</h3>
                    </article>


                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}>Track your workouts and muscle impact</h3>
                    </article>


                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}>Set goals and push yourself</h3>
                    </article>

                </section>
            </section>
        </div>
    )
}

export default Page