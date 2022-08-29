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
        return ""
    }

    return (
        <div>

            <nav className={styles.navbarWrapper}>
                <div className={`${styles.navbar} flex flex-row justify-between items-center`}>

                    <div className={styles.brand}>
                        Tracker
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

            <div className={styles.postMain}>
                <section className={styles.sectionObjectives}>
                    <h3 className={styles.objectivesTitle}>A calendar designed with productivity in mind</h3>

                    <div className={styles.objectives}>
                        <article className={styles.objective}>
                            <h4 className={styles.objectiveTitle}>The hour count in question</h4>
                            <div className={styles.objectiveImage}>

                            </div>
                        </article>

                        <article className={styles.objective}>
                            <h4 className={styles.objectiveTitle}>Record sleep and get ahold of your sleep schedule</h4>
                            <div className={styles.objectiveImage}>

                            </div>
                        </article>

                        <article className={styles.objective}>
                            <h4 className={styles.objectiveTitle}>Keep track of your workouts and plan ahead</h4>
                            <div className={styles.objectiveImage}>

                            </div>
                        </article>
                    </div>
                </section>

                <section className={styles.sectionGithub}>
                    <div className={styles.githubLogo} />

                    <div className={styles.githubHeader}>
                        <h3 className={styles.githubTitle}>A calendar designed with productivity in mind</h3>
                        <h3 className={styles.githubSubtitle}>Suggest new features, report bugs, and directly talk with developers on the github repository</h3>
                        <h3 className={styles.githubRepo}>Repo</h3>
                    </div>

                    <div className={styles.githubChanges}>
                    &zwnj;
                    </div>
                    <div className={styles.githubSidebar}>
                    &zwnj;
                    </div>
                </section>

                <section className={styles.sectionFeatures}>
                    <h3 className={styles.cardsTitle}>Features list</h3>
                    <section className={styles.sectionCards}>
                        <article className={styles.card}>
                            <h3 className={styles.cardTitle}>Keep track of weekly productivity</h3>
                        </article>


                        <article className={styles.card}>
                            <h3 className={styles.cardTitleRight}>See what you spend your time on</h3>
                        </article>


                        <article className={styles.card}>
                            <h3 className={styles.cardTitle}>Organize yourself with a schedule</h3>
                        </article>


                        <article className={styles.card}>
                            <h3 className={styles.cardTitleRight}>Check off daily TODO items</h3>
                        </article>


                        <article className={styles.card}>
                            <h3 className={styles.cardTitle}>Record your energy and sleep</h3>
                        </article>


                        <article className={styles.card}>
                            <h3 className={styles.cardTitleRight}>Compare against friends</h3>
                        </article>


                        <article className={styles.card}>
                            <h3 className={styles.cardTitle}>A built-in diary</h3>
                        </article>


                        <article className={styles.card}>
                            <h3 className={styles.cardTitleRight}>And a bulit-in packing list</h3>
                        </article>


                        <article className={styles.card}>
                            <h3 className={styles.cardTitle}>Track your workouts and muscle impact</h3>
                        </article>


                        <article className={styles.card}>
                            <h3 className={styles.cardTitleRight}>Set goals and push yourself</h3>
                        </article>

                    </section>
                </section>
            </div>
        </div>
    )
}

export default Page