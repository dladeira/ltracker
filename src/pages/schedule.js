import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getDateText, getDay, getTask, getWeekDay } from '../common/lib/util'
import { useAppContext } from '../common/lib/context'

import styles from '../styles/schedule.module.scss'
import { useUser } from '../common/lib/hooks'

function Page() {
    useUser({ userOnly: true })

    const hours = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM", "12 AM"]
    var i = 0

    return (
        <div className={styles.wrapper} onContextMenu={e => e.preventDefault()}>
            <div className={styles.grid}>
                <div className={styles.displayHours}>
                    {hours.map(hour => {
                        if (i++ == 24)
                            return <div key={"displayHour-" + hour + "-last"} className={styles.displayHourLast}>{hour}</div>
                        return <div key={"displayHour-" + hour} className={styles.displayHour}>{hour}</div>
                    })}
                </div>
                <Day index={0} name={"Monday"} first={true} />
                <Day index={1} name={"Tuesday"} />
                <Day index={2} name={"Wednesday"} />
                <Day index={3} name={"Thursday"} />
                <Day index={4} name={"Friday"} />
                <Day index={5} name={"Saturday"} />
                <Day index={6} name={"Sunday"} />
            </div>
        </div>
    )
}

function Day({ index, name, first }) {
    const [context] = useAppContext()
    const [user, setUser] = useUser({ userOnly: true })

    const [dragging, setDragging] = useState(false)
    const [yOnMouseDown, setYOnMouseDown] = useState(0)
    const [clickTime, setClickTime] = useState(0)
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
            if (new Date().getTime() - clickTime > 300) {
                setLastMouseUp(context.lastMouseUp)
                mouseUpHandler()
            } else {
                resetMouse()
            }
        }
    }, [context])

    useEffect(() => {
        if (!dragging) {
            document.getElementById(`${index}-placeholder`).style.display = "none"
        }
    })

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

    function resetMouse() {
        setDragging(false)
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
            resetMouse()
        }
    }

    function mouseDownHandler(e, quarter) {
        setYOnMouseDown(e.clientY)
        setDragging(true)
        quarterData.first = quarter
        setQuarterData(quarterData)
        setClickTime(new Date().getTime())
    }

    return (
        <div className={styles.weekDay} onMouseMove={moveHandler}>
            <div className={styles.dayHeader}>
                <div className={styles.dayDate}>
                    {getDateText(index, context.week, context.year)}
                </div>
                <div className={index == getWeekDay(new Date()) ? styles.dayNameToday : styles.dayName}>
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

                {getEvents().map(event =>
                    <Event key={`event-${event._id}`} event={event} quarterHeight={quarterHeight} index={index} />
                )}

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

function Event({ event, quarterHeight, index }) {
    const [context] = useAppContext()
    const [user, setUser] = useUser({ userOnly: true })
    const { quarterStart, quarterEnd, task, plan } = event
    const { name, color } = getTask(user, task)
    const [panel, setPanel] = useState(false)
    const [initial, setInitial] = useState(true)
    const [lastMouseUp, setLastMouseUp] = useState(0)

    const [panelData, setPanelData] = useState({
        task: task,
        from: quarterStart,
        to: quarterEnd,
        plan: plan
    })
    const [tempTime, setTempTime] = useState({
        from: quarterToTime(quarterStart),
        to: quarterToTime(quarterEnd + 1)
    })

    function getEvents() {
        const day = getDay(user, index, context.week, context.year)
        if (day)
            return day.events
        return []
    }

    function getEvent(quarter) {
        for (var event of getEvents()) {
            for (var i = event.quarterStart; i <= event.quarterEnd; i++) {
                if (i == quarter)
                    return event
            }
        }
    }

    useEffect(() => {
        if (Math.abs(context.lastMouseUp - lastMouseUp) > 200 && panel) {
            setLastMouseUp(context.lastMouseUp)
            setPanel(false)
        }
    }, [context])

    useEffect(() => {
        if (initial)
            return setInitial(false)

        fetch("/api/user/events/updateEvent", {
            method: "POST",
            body: JSON.stringify({
                day: index,
                week: context.week,
                year: context.year,
                firstQuarter: quarterStart,
                lastQuarter: quarterEnd,
                task: panelData.task,
                quarterStart: panelData.from,
                quarterEnd: panelData.to,
                plan: panelData.plan
            })
        }).then(res => res.json().then(newUser => setUser({ ...newUser })))

        setTempTime({
            from: quarterToTime(panelData.from),
            to: quarterToTime(panelData.to + 1)
        })
    }, [panelData])

    const wrapperStyle = {
        position: "absolute",
        top: ((quarterStart - 1) * quarterHeight) + "px",
        height: ((quarterEnd - quarterStart + 1) * quarterHeight - 1) + "px"
    }

    function onSelect(e) {
        panelData.task = e.target.value
        setPanelData({ ...panelData })
    }

    async function onDeletePress() {
        const res = await fetch("/api/user/events/deleteEvent", {
            method: "POST",
            body: JSON.stringify({
                day: index,
                week: context.week,
                year: context.year,
                firstQuarter: quarterStart,
                lastQuarter: quarterEnd
            })
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    function onTimeChange(e, from) {
        const newTime = timeToQuarter(e.target.value)
        if (newTime != null) {
            var overlapping = false
            if (from) {
                for (var quarter = newTime + 1; quarter <= panelData.to; quarter++) {
                    if (getEvent(quarter) != null && getEvent(quarter)._id != event._id) {
                        overlapping = true
                    }
                }
            } else {
                for (var quarter = panelData.from; quarter <= newTime; quarter++) {
                    if (getEvent(quarter) != null && getEvent(quarter)._id != event._id) {
                        overlapping = true
                    }
                }
            }

            if (!overlapping) {
                if (from && quarterEnd >= newTime + 1) {

                    panelData.from = newTime + 1
                    return setPanelData({ ...panelData })
                }
                if (!from && quarterStart <= newTime) {
                    panelData.to = newTime
                    return setPanelData({ ...panelData })
                }
            }
        }
        setTempTime({
            from: quarterToTime(panelData.from),
            to: quarterToTime(panelData.to + 1)
        })
    }

    function onTempChange(e, from) {
        if (from) {
            tempTime.from = e.target.value;
        } else {
            tempTime.to = e.target.value;
        }

        setTempTime({ ...tempTime })
    }

    function quarterToTime(quarter) {
        var hours = Math.floor((quarter - 1) / 4)
        const am = hours < 12
        hours = hours < 12 ? hours : hours == 12 ? 12 : hours - 12
        hours = ("0" + hours).slice(-2)
        const minutes = ("0" + (((quarter - 1) % 4) * 15)).slice(-2)

        if (am) {
            return `${hours}:${minutes} AM`
        } else {
            return `${hours}:${minutes} PM`
        }
    }

    function timeToQuarter(string) {
        const hours = parseInt(string.slice(0, 2))
        const minutes = roundTo15(parseInt(string.slice(3, 5)))
        const am = string.slice(6, 8) == "AM"

        if (isNaN(hours) || isNaN(minutes) || string.length != 8 || !(/^[0-9]*$/).test(string.slice(0, 2)) || !/^[0-9]*$/.test(string.slice(3, 5)))
            return null;

        return ((hours + (am ? 0 : hours == 12 ? 0 : 12)) * 4) + (minutes / 15)
    }

    function onPlanPress() {
        panelData.plan = !panelData.plan
        setPanelData({ ...panelData })
    }

    function onClick() {
        setLastMouseUp(new Date().getTime())
    }

    return (
        <div className={styles.eventWrapper} style={wrapperStyle} onMouseUp={onClick}>
            <div className={(quarterEnd - quarterStart + 1 > 2 ? styles.event : styles.eventSmall) + (panelData.plan ? " " + styles.eventPlan : "")} style={{ backgroundColor: color }} onClick={() => { setPanel(true) }} onContextMenu={e => { onDeletePress(); e.preventDefault(); }}>
                <div className={styles.eventTime}>{formatMinutes((quarterEnd - quarterStart + 1) * 15)}</div>
                <div className={styles.eventName}>{name}</div>
            </div>
            {panel ? (
                <div className={styles.panel}>
                    <div className={styles.panelControl}>
                        <select className={styles.panelType} defaultValue={"Task"}>
                            <option value="Task">Task</option>
                        </select>
                        <div className={styles.panelControlSide}>
                            <div className={panelData.plan ? styles.panelPlanActive : styles.panelPlan} type="button" onClick={onPlanPress}>
                                <Image src={"/plan-icon.svg"} height={17} width={17} />
                            </div>
                            <div className={styles.panelDelete} type="button" onClick={onDeletePress}>
                                <Image src={"/trash-icon.svg"} height={20} width={20} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.panelTime}>
                        <div className={styles.panelTimeFrom}>From <input className={styles.panelTimeInput} type="text" value={tempTime.from} onBlur={e => { onTimeChange(e, true) }} onChange={e => { onTempChange(e, true) }} /></div>
                        <div className={styles.panelTimeTo}>To <input className={styles.panelTimeInput} type="text" value={tempTime.to} onBlur={e => { onTimeChange(e, false) }} onChange={e => { onTempChange(e, false) }} /></div>
                    </div>
                    <div className={styles.eventBody}>
                        <div className={styles.entry}>
                            <div className={styles.key}>
                                task
                            </div>
                            <div className={styles.value}>
                                <select className={styles.taskSelect} onChange={onSelect} defaultValue={task}>
                                    {user.tasks.map(task => <option key={task.id} value={task.id}>{task.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            ) : <div />}

        </div>
    )
}

function formatMinutes(minutes) {
    if (minutes < 60)
        return minutes + "m"

    return minutes / 60 + "h"
}

function roundTo15(number) {
    var remainder = number % 15
    number -= remainder
    number = remainder > 7.5 ? number + 15 : number

    return number
}

export default Page