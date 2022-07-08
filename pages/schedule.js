import { useEffect, useState } from 'react'
import { getDateText, getDay, getDayIndex, getTask } from '../lib/util'
import { useAppContext } from '../lib/context'

import styles from '../styles/schedule.module.scss'
import { useUser } from '../lib/hooks'

function Page() {
    const hours = []
    for (var i = 1; i <= 24; i++) {
        if (i - 12 <= 0) {
            hours.push(`${i} AM`)
        } else {
            hours.push(`${i - 12} PM`)
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.grid}>
                <div className={styles.displayHours}>
                    {hours.map(hour => {
                        return <div key={"displayHour-" + hour} className={styles.displayHour}>{hour}</div>
                    })}
                </div>
                <Day index={1} name={"Monday"} first={true} />
                <Day index={2} name={"Tuesday"} />
                <Day index={3} name={"Wednesday"} />
                <Day index={4} name={"Thursday"} />
                <Day index={5} name={"Friday"} />
                <Day index={6} name={"Saturday"} />
                <Day index={7} name={"Sunday"} />
            </div>
        </div>
    )
}

function Day({ index, name, first }) {
    const [context, setContext] = useAppContext()
    const [user, setUser] = useUser({ userOnly: true })


    const [dragging, setDragging] = useState(false)
    const [yOnMouseDown, setYOnMouseDown] = useState(0)
    const [lastMouseUp, setLastMouseUp] = useState(0)

    const placeHolderEvent = useState({
        quarterStart: 0,
        quarterEnd: 0
    })

    const [quarterData, setQuarterData] = useState({
        first: 0,
        last: 0
    })

    const quarterHeight = 20
    const hours = []
    var quarterIndex = 1
    for (var i = 1; i <= 24; i++) {
        hours.push(i)
    }

    useEffect(() => {
        if (context.lastMouseUp != lastMouseUp && dragging) {
            setLastMouseUp(context.lastMouseUp)
            mouseUpHandler()
        }
    }, [context])

    function getEvents() {
        const day = getDay(user, index, context.week, context.year)
        if (day)
            return day.events
        return []
    }

    function moveHandler(e) {
        if (dragging) {
            var topOffset = document.getElementById(`weekDay-${index}-clickable`).getBoundingClientRect().top
            var placeholder = document.getElementById(`${index}-placeholder`)
            for (var quarter = 1; quarter <= hours.length * 4; quarter++) {
                var el = document.getElementById(`weekDay-${index}-${quarter}`)
                var top = el.offsetTop
                var bottom = top + el.clientHeight
                if (bottom > yOnMouseDown - topOffset && e.clientY - topOffset > top) {
                    if (!getEvent(quarter)) {
                        quarterData.last = quarter
                        setQuarterData(quarterData)
                    } else {
                        break;
                    }
                }
            }
            placeholder.style.display = "block"
            placeholder.style.top = (quarterData.first - 1) * quarterHeight + "px"
            placeholder.style.height = (quarterData.last - quarterData.first + 1) * quarterHeight - 1 + "px"
        }
    }

    function getEvent(quarter) {
        for (var event of getEvents()) {
            for (var i = event.quarterStart; i <= event.quarterEnd; i++) {
                if (i == quarter)
                    return event
            }
        }
    }

    async function mouseUpHandler() {
        if (dragging && quarterData.first != 0 && quarterData.last != 0) {
            const res = await fetch("/api/user/events/addEvent", {
                method: "POST",
                body: JSON.stringify({
                    day: index,
                    week: context.week,
                    year: context.year,
                    firstQuarter: quarterData.first,
                    lastQuarter: quarterData.last,
                    task: user.tasks[0].id
                })
            })
            const newUser = await res.json()
            setUser({ ...newUser })
            setDragging(false)
            document.getElementById(`${index}-placeholder`).style.display = "none"
        }
    }

    function mouseDownHandler(e, quarter) {
        setDragging(true)
        setYOnMouseDown(e.clientY)
        quarterData.first = quarter
        setQuarterData(quarterData)
    }

    return (
        <div className={styles.weekDay} onMouseMove={moveHandler}>
            <div className={styles.dayHeader}>
                <div className={styles.dayDate}>
                    {getDateText(index, context.week, context.year)}
                </div>
                <div className={styles.dayName}>
                    {name}
                </div>
            </div>

            <div className={first ? styles.clickableAreaFirstTop : styles.clickableAreaTop}>&zwnj;</div>
            <div id={`weekDay-${index}-clickable`} className={first ? styles.clickableAreaFirst : styles.clickableArea}>
                {hours.map(hour => {
                    var i1 = quarterIndex++
                    var i2 = quarterIndex++
                    var i3 = quarterIndex++
                    var i4 = quarterIndex++
                    return <div key={"hour-" + hour} className={styles.hour}>
                        <div id={`weekDay-${index}-${i1}`} className={styles.quarterDivider} onMouseDown={e => { mouseDownHandler(e, i1) }} />
                        <div id={`weekDay-${index}-${i2}`} className={styles.quarterDivider} onMouseDown={e => { mouseDownHandler(e, i2) }} />
                        <div id={`weekDay-${index}-${i3}`} className={styles.quarterDivider} onMouseDown={e => { mouseDownHandler(e, i3) }} />
                        <div id={`weekDay-${index}-${i4}`} className={styles.quarterDivider} onMouseDown={e => { mouseDownHandler(e, i4) }} />
                    </div>
                })}

                {getEvents().map(event => <Event key={`event-${event.quarterStart}-${event.quarterEnd}`} event={event} quarterHeight={quarterHeight} />)}

                <div id={`${index}-placeholder`} className={styles.eventWrapper} style={{
                    position: "absolute",
                    top: ((placeHolderEvent.quarterStart - 1) * quarterHeight) + "px",
                    height: ((placeHolderEvent.quarterEnd - placeHolderEvent.quarterStart + 1) * quarterHeight - 1) + "px",
                    display: "none"
                }} >
                    <div className={styles.eventPlaceholder}>
                        &zwnj;
                    </div>
                </div>
            </div>
        </div>
    )
}

function Event({ event, quarterHeight }) {
    const [user] = useUser({ userOnly: true })
    const { quarterStart, quarterEnd, task } = event
    const { name, color } = getTask(user, task)

    return (
        <div className={styles.eventWrapper} style={{
            position: "absolute",
            top: ((quarterStart - 1) * quarterHeight) + "px",
            height: ((quarterEnd - quarterStart + 1) * quarterHeight - 1) + "px"
        }} >
            <div className={styles.event} style={{ backgroundColor: color }}>
                &zwnj;
            </div>
        </div>
    )
}

export default Page