import { useEffect, useState } from 'react'
import { getDateText } from '../lib/util'
import { useAppContext } from '../lib/context'

import styles from '../styles/schedule.module.scss'

function Page() {
    return (
        <div className={styles.grid}>
            <div className={styles.hours} />
            <Day index={1} name={"Monday"} />
            <Day index={2} name={"Tuesday"} />
            <Day index={3} name={"Wednesday"} />
            <Day index={4} name={"Thursday"} />
            <Day index={5} name={"Friday"} />
            <Day index={6} name={"Saturday"} />
            <Day index={7} name={"Sunday"} />
        </div>
    )
}

function Day({ index, name }) {
    const [context, setContext] = useAppContext()
    var dragging = false
    var yOnMouseDown
    const [events, setEvents] = useState([{
        quarterStart: 7,
        quarterEnd: 9
    }])

    var firstQuarter = 0
    var lastQuarter = 0

    const hours = []
    var quarterIndex = 1
    for (var i = 1; i <= 4; i++) {
        hours.push(i)
    }

    useEffect(() => {
        document.addEventListener("mousemove", moveHandler, true)
        document.addEventListener("mouseup", mouseUpHandler, true)


        return () => {
            document.removeEventListener("mousemove", moveHandler, true)
            document.removeEventListener("mouseup", mouseUpHandler, true)

        }
    })

    function moveHandler(e) {
        if (dragging) {
            var topOffset = document.getElementById(`weekDay-${index}-clickable`).getBoundingClientRect().top
            for (var i = 1; i <= hours.length * 4; i++) {
                var el = document.getElementById(`weekDay-${index}-${i}`)
                var top = el.offsetTop
                var bottom = top + el.clientHeight
                if (bottom > yOnMouseDown - topOffset && e.clientY - topOffset > top) {
                    el.classList.add(styles.hourHighlighted)
                    lastQuarter = i
                } else {
                    el.classList.remove(styles.hourHighlighted)
                }
            }
        }
    }

    function mouseUpHandler() {
        if (dragging && firstQuarter != 0 && lastQuarter != 0) {
            events.push({
                quarterStart: firstQuarter,
                quarterEnd: lastQuarter
            })

            console.log(events)
            setEvents([...events])
        }

        dragging = false
    }

    function mouseDownHandler(e, quarter) {
        dragging = true
        yOnMouseDown = e.clientY
        firstQuarter = quarter
    }

    return (
        <div className={styles.weekDay}>
            {getDateText(index, context.week, context.year)}
            {name}

            <div id={`weekDay-${index}-clickable`} className={styles.clickableArea}>
                {hours.map(() => {
                    var i1 = quarterIndex++
                    var i2 = quarterIndex++
                    var i3 = quarterIndex++
                    var i4 = quarterIndex++
                    return <>
                        <div id={`weekDay-${index}-${i1}`} className={styles.quarterDivider} onMouseDown={e => { mouseDownHandler(e, i1) }} />
                        <div id={`weekDay-${index}-${i2}`} className={styles.quarterDivider} onMouseDown={e => { mouseDownHandler(e, i2) }} />
                        <div id={`weekDay-${index}-${i3}`} className={styles.quarterDivider} onMouseDown={e => { mouseDownHandler(e, i3) }} />
                        <div id={`weekDay-${index}-${i4}`} className={styles.quarterDivider} onMouseDown={e => { mouseDownHandler(e, i4) }} />
                    </>
                })}

                {events.map(event => <div className={styles.event} style={{
                    position: "absolute", top: ((event.quarterStart - 1) * 12.5) + "px", height: ((event.quarterEnd - event.quarterStart + 1) * 12.5) + "px"
                }} >&zwnj;</div>)}
            </div>
        </div>
    )
}

export default Page