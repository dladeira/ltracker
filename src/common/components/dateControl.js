import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMediaQuery } from 'react-responsive'
import { useAppContext } from '../lib/context'
import { getWeekDay, getWeeksInYear, toTitleCase } from '../lib/util'

import styles from './dateControl.module.scss'

export default function DateControl() {
    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })

    return isMobile ?
        (
            <div>
                <DayNavigation />
                <WeekNavigation />
            </div>
        ) : (
            <div className={styles.controlContainer}>
                <PageTitle />
                <DayNavigation />
                <WeekNavigation />
            </div>
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

function DayNavigation() {
    const [context, setContext] = useAppContext()
    const days = [0, 1, 2, 3, 4, 5, 6]
    const dayNames = ["M", "T", "W", "T", "F", "S", "S"]

    function setDay(index) {
        context.day = index
        setContext({ ...context })
    }

    return (
        <div className={styles.dayContainer}>
            {days.map(day =>
                <div key={`weekDaySelect-${day}`} className={styles.day + (context.day == day ? " " + styles.daySelected : "") + (getWeekDay(new Date()) == day ? " " + styles.dayToday : "")} onClick={e => { setDay(day) }}>{dayNames[day]}</div>
            )}
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
            if (context.week + 1 > getWeeksInYear(context.year)) {
                context.week = 1
                context.year = context.year + 1
            } else {
                context.week = context.week + 1
            }
        } else {
            if (context.week - 1 <= 0) {
                context.week = getWeeksInYear(context.year - 1)
                context.year = context.year - 1
            } else {
                context.week = context.week - 1

            }
        }
        setContext({ ...context })
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