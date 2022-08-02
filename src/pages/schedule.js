import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getDateText, getWeekDay } from '../common/lib/util'
import { useAppContext } from '../common/lib/context'

import styles from '../styles/schedule.module.scss'
import { useUser } from '../common/lib/hooks'
import { useMediaQuery } from 'react-responsive'

function Page() {
    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })
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

    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })

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
        return user.getEventsForDay(index, context.week, context.year)
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

    async function mouseUpHandler(e) {
        if (dragging && quarterData.first != 0 && quarterData.last != 0) {
            const res = await fetch("/api/user/events", {
                method: "PUT",
                body: JSON.stringify({
                    day: index,
                    week: context.week,
                    year: context.year,
                    quarterStart: quarterData.first,
                    quarterEnd: quarterData.last,
                    task: user.getTasks()[0].id,
                    eventType: "task"
                })
            })
            const newUser = await res.json()
            setUser({ ...newUser })
            resetMouse()
        }
    }

    async function mouseDownHandler(e, quarter) {
        if (isMobile) {
            const res = await fetch("/api/user/events", {
                method: "PUT",
                body: JSON.stringify({
                    day: index,
                    week: context.week,
                    year: context.year,
                    quarterStart: quarter,
                    quarterEnd: quarter,
                    task: user.getTasks()[0].id,
                    eventType: "task"
                })
            })
            const newUser = await res.json()
            setUser({ ...newUser })
        } else {
            setYOnMouseDown(e.clientY)
            setDragging(true)
            quarterData.first = quarter
            setQuarterData(quarterData)
            setClickTime(new Date().getTime())
        }

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
    const { quarterStart, quarterEnd, task, plan, eventType } = event
    const { name, color } = user.getTask(task) ? user.getTask(task) : { name: "ERROR", color: "#000000" }
    const [panel, setPanel] = useState(false)
    const [initial, setInitial] = useState(true)
    const [lastMouseUp, setLastMouseUp] = useState(0)

    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })

    const [panelData, setPanelData] = useState({
        task: task,
        from: quarterStart,
        to: quarterEnd,
        plan: plan,
        type: eventType,
        workoutData: {
            shoulders: 0,
            chest: 0,
            biceps: 0,
            abs: 0,
            obliques: 0,
            traps: 0,
            triceps: 0,
            lats: 0,
            lowerBack: 0,
            glutes: 0,
            hamstrings: 0,
            calves: 0,
            quads: 0
        }
    })
    const [tempTime, setTempTime] = useState({
        from: quarterToTime(quarterStart),
        to: quarterToTime(quarterEnd + 1)
    })

    function getEvents() {
        return user.getEventsForDay(index, context.week, context.year)
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
        if (Math.abs(context.lastMouseUp - lastMouseUp) > 200 && panel && !isMobile) {
            setLastMouseUp(context.lastMouseUp)
            setPanel(false)
        }
    }, [context])

    useEffect(() => {
        if (initial)
            return setInitial(false)

        fetch("/api/user/events", {
            method: "POST",
            body: JSON.stringify({
                day: index,
                week: context.week,
                year: context.year,
                id: event._id,
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
        const res = await fetch("/api/user/events", {
            method: "DELETE",
            body: JSON.stringify({
                day: index,
                week: context.week,
                year: context.year,
                id: event._id
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

    function setTaskType(newType) {
        panelData.type = newType
        setPanelData({ ...panelData })
    }

    function onPlanPress() {
        panelData.plan = !panelData.plan
        setPanelData({ ...panelData })
    }

    function onClick() {
        setLastMouseUp(new Date().getTime())
    }

    function onClickMuscle(type) {
        panelData.workoutData[type]++

        if (panelData.workoutData[type] > 3) {
            panelData.workoutData[type] = 0
        }

        console.log("Clicked on muscle " + type + " and now the value is: " + panelData.workoutData[type])

        setPanelData({ ...panelData })
    }

    function getMuscleFill(type) {
        switch (panelData.workoutData[type]) {
            case 0:
                return "#d2dbed"
            case 1:
                return "#f09e9e"
            case 2:
                return "#ed5a5a"
            case 3:
                return "#f52525"
        }
    }

    return (
        <div className={styles.eventWrapper} style={wrapperStyle} onMouseUp={onClick}>
            <div className={(quarterEnd - quarterStart + 1 > 2 ? styles.event : styles.eventSmall) + (panelData.plan ? " " + styles.eventPlan : "")} style={{ backgroundColor: color }} onClick={() => { setPanel(!panel) }} onContextMenu={e => { onDeletePress(); e.preventDefault(); }}>
                <div className={styles.eventTime}>{formatMinutes((quarterEnd - quarterStart + 1) * 15)}</div>
                <div className={styles.eventName}>{name}</div>
            </div>
            {panel ? (
                <div className={isMobile ? styles.panelMobile : styles.panel + (index > 4 ? " " + styles.panelLeft : "")}>
                    <div className={styles.panelControl}>
                        <select className={styles.panelType} value={panelData.type} onChange={e => setTaskType(e.target.value)} defaultValue={panelData.type}>
                            <option value="task">Task</option>
                            <option value="workout">Workout</option>
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

                    {panelData.type == "task" ? (
                        <div className={styles.eventBody}>
                            <div className={styles.entry}>
                                <div className={styles.key}>
                                    task
                                </div>
                                <div className={styles.value}>
                                    <select className={styles.taskSelect} onChange={onSelect} defaultValue={task}>
                                        {user.getTasks().map(task => <option key={task.id} value={task.id}>{task.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.eventBody}>
                            {/* {JSON.stringify(panelData.workoutData)} */}
                            <svg id="e1rWyE6pdS51" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 525" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
                                <g transform="matrix(1 0 0 1.020455-151.693085-251.94997)">
                                    <rect onClick={e => onClickMuscle("biceps")} fill={getMuscleFill("biceps")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.937262 0.348627-.348627 0.937262 210.326109 287.05409)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("biceps")} fill={getMuscleFill("biceps")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.937282-.348572 0.348572 0.937282 409.390963 308.319492)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("shoulders")} fill={getMuscleFill("shoulders")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(1.756757 0 0 0.269724 225.747607 241.691107)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("shoulders")} fill={getMuscleFill("shoulders")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(1.756757 0 0 0.269724 343.974155 241.691107)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("chest")} fill={getMuscleFill("chest")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(1.072276 0 0 0.35709 267.506035 308.322833)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("chest")} fill={getMuscleFill("chest")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(1.072276 0 0 0.35709 343.974155 308.322833)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("abs")} fill={getMuscleFill("abs")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(1.323984 0 0 0.663883 295.909693 387.138408)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("quads")} fill={getMuscleFill("quads")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.663883 267.506035 521.278876)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("quads")} fill={getMuscleFill("quads")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.663883 348.278901 521.278876)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("calves")} fill={getMuscleFill("calves")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.663883 348.278901 649.722329)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("calves")} fill={getMuscleFill("calves")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.663883 267.506035 649.722329)" strokeWidth="0" />
                                    <g transform="translate(151.693097-38.62571)">
                                        <rect onClick={e => onClickMuscle("obliques")} fill={getMuscleFill("obliques")} width="20.486182" height="111.655236" rx="0" ry="0" transform="translate(115.81295 425.760761)" strokeWidth="0" />
                                        <rect onClick={e => onClickMuscle("obliques")} fill={getMuscleFill("obliques")} width="20.486182" height="111.655236" rx="0" ry="0" transform="translate(232.90695 425.762474)" strokeWidth="0" />
                                    </g>
                                </g>
                                <g transform="matrix(1 0 0 1.03 279.108887-259.893521)">
                                    <rect onClick={e => onClickMuscle("triceps")} fill={getMuscleFill("triceps")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.937262 0.348627-.348627 0.937262 210.326109 297.688463)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("triceps")} fill={getMuscleFill("triceps")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.937282-.348572 0.348572 0.937282 405.086217 318.952194)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("shoulders")} fill={getMuscleFill("shoulders")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(1.015984 0 0 0.269724 236.514747 252.323809)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("shoulders")} fill={getMuscleFill("shoulders")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(1.015984 0 0 0.269724 374.094929 252.323809)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("lowerBack")} fill={getMuscleFill("lowerBack")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(2.255138 0 0 0.337897 267.506035 444.68854)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("hamstrings")} fill={getMuscleFill("hamstrings")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.663883 267.506035 521.278876)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("hamstrings")} fill={getMuscleFill("hamstrings")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.663883 348.278901 521.278876)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("calves")} fill={getMuscleFill("calves")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.67169 348.278901 649.065828)" strokeWidth="0" />
                                    <rect onClick={e => onClickMuscle("calves")} fill={getMuscleFill("calves")} width="61.007434" height="168.182657" rx="0" ry="0" transform="matrix(.931154 0 0 0.67169 267.506035 649.065828)" strokeWidth="0" />
                                    <g transform="translate(-274.804085-32.440568)">
                                        <rect onClick={e => onClickMuscle("obliques")} fill={getMuscleFill("obliques")} width="37.131351" height="63.090358" rx="0" ry="0" transform="matrix(1 0 0 1.099195 536.170057 393.741747)" strokeWidth="0" />
                                        <rect onClick={e => onClickMuscle("obliques")} fill={getMuscleFill("obliques")} width="37.131351" height="63.090358" rx="0" ry="0" transform="matrix(2.175325 0 0 0.520432 570.713889 430.256116)" strokeWidth="0" />
                                        <rect onClick={e => onClickMuscle("obliques")} fill={getMuscleFill("obliques")} width="37.131351" height="63.090358" rx="0" ry="0" transform="matrix(1 0 0 1.099195 648.899014 393.741747)" strokeWidth="0" />
                                    </g>
                                    <polygon onClick={e => onClickMuscle("traps")} fill={getMuscleFill("traps")} points="-4.284312,-85.257355 39.219686,-58.61571 58.29886,41.78042 -66.867298,41.777927 -47.696197,-58.61571 -4.284312,-85.257355" transform="matrix(-.603978 0 0-.704135 333.708552 327.105764)" strokeWidth="0" />
                                </g>
                            </svg>
                        </div>
                    )}

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