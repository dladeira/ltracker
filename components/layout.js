import Image from 'next/image'
import { useRouter } from 'next/router'
import { useAppContext } from '../lib/context'
import { useUser } from '../lib/hooks'
import { getWeeksInYear, toTitleCase } from '../lib/util'

import Userbar from '../components/userbar'

import styles from '../styles/layout.module.scss'


function Component({ children }) {
    const [user] = useUser()

    if (user === undefined) {
        return (
            <div />
        )
    }

    return (user ?
        (
            <div className={styles.outerLoggedInContainer}>
                <div className={styles.loggedInContainer}>
                    <Userbar />
                    <div className={styles.controlContainer}>
                        <PageTitle />
                        <WeekNavigation />
                    </div>
                    {children}
                </div>
            </div>
        ) : (
            <div>
                {children}
            </div>
        )
    )
}

function PageTitle() {
    const router = useRouter()

    return (
        <div className={styles.title}>
            {toTitleCase(router.pathname.substring(1))}
        </div>
    )
}

function WeekNavigation() {
    const [context, setContext] = useAppContext()
    const arrowSize = 48;
    const currentWeek = new Date().getCurrentWeek()
    const currentYear = new Date().getFullYear()

    function toggleWeek(increment) {
        if (increment) {
            console.log(context.year)
            if (context.week + 1 > getWeeksInYear(context.year)) {
                context.week = 1
                context.year = context.year + 1
                setContext({ ...context })
            } else {
                context.week = context.week + 1
                setContext({ ...context })
            }
        } else {
            if (context.week - 1 <= 0) {
                context.week = getWeeksInYear(context.year - 1)
                context.year = context.year - 1
                setContext({ ...context })
            } else {
                context.week = context.week - 1
                setContext({ ...context })
            }
        }
    }

    return (
        <div className={styles.weekContainer}>
            <div className={styles.arrow} style={{ height: `${arrowSize}px`, width: `${arrowSize}px` }} onClick={() => { toggleWeek(false) }}><Image src="/arrow.svg" height={arrowSize} width={arrowSize} /></div>
            <div className={styles.date}>
                <div className={styles.year}>
                    {context.year}
                </div>
                <div className={currentWeek == context.week && currentYear == context.year ? styles.currentWeek : styles.week}>
                    Week {context.week}
                </div>
            </div>
            <div className={styles.arrowRight} style={{ height: `${arrowSize}px`, width: `${arrowSize}px` }} onClick={() => { toggleWeek(true) }}><Image src="/arrow.svg" height={arrowSize} width={arrowSize} /></div>
        </div>
    )
}

export default Component