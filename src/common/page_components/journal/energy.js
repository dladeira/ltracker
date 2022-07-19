import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getDayIndex, getWeekDay } from '../../lib/util'

import styles from './energy.module.scss'

function Component() {
    return (
        <div className="flex flex-col relative h-full w-full bg-white rounded-lg p-3.5 pt-1 col-span-3 row-span-2">
            <h3 className="text-lg font-medium">Energy Levels</h3>
            <Canvas />
        </div>
    )
}

function Canvas() {
    const [context] = useAppContext()
    const [user, setUser] = useUser({ userOnly: true })

    const [dragging, setDragging] = useState()
    var htmlDragging = false
    var htmlUp = false
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

    const dayIndex = getDayIndex(user, getWeekDay(new Date), context.week, context.year)
    const day = user.days[dayIndex]

    const [lastMouseUp, setLastMouseUp] = useState()
    const [points, setHardPoints] = useState(day && day.points ? day.points : [])

    function setPoints(points) {
        savePoints(points)
    }

    async function savePoints(points) {
        const res = await fetch("/api/user/setPoints", {
            method: "POST",
            body: JSON.stringify({
                day: getWeekDay(new Date()),
                week: context.week,
                year: context.year,
                points: points
            })
        })
        const newUser = await res.json()
        setUser({ ...newUser })


    }

    const hours = ["6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "19PM", "10 PM", "11 PM", "12 AM"]
    const percents = ["0%", "", "20%", "", "40%", "", "60%", "", "80%", "", "100%"]
    const pointSize = 15

    useEffect(() => {
        const day = user.days[getDayIndex(user, getWeekDay(new Date), context.week, context.year)]
        setHardPoints(day && day.points ? day.points : [])
    }, [user])

    useEffect(() => {
        var i = 0
        for (var point of points) {
            const nextPoint = points[i + 1]
            if (nextPoint != null) {
                const point1 = getPointData(document.getElementById("energyPoint-" + point.id));
                const point2 = getPointData(document.getElementById("energyPoint-" + nextPoint.id));
                drawLineXY(point1, point2, i)
            }

            i++
        }
    })

    useEffect(() => {
        if (context.lastMouseUp != lastMouseUp) {
            setLastMouseUp(context.lastMouseUp)
            if (dragging !== undefined)
                mouseUpHandler()
        } else {
            clearCanvas()
        }
    }, [context])

    useEffect(() => {
        return clearCanvas
    }, [])

    function moveHandler(e) {
        if (dragging !== undefined && !htmlUp) {
            const data = { hour: posToValue(e.clientX, true), energyLevel: posToValue(e.clientY, false), id: dragging }

            for (var point of points) {
                // We didn't move it anyhwere new
                if (point.id == dragging && point.hour == data.hour && point.energyLevel == data.energyLevel)
                    return

                // We are trying to put point the same hour as another one
                if (point.hour == data.hour && point.id != dragging)
                    return
            }

            for (var point of points) {
                if (point.id == dragging) {
                    point.hour = data.hour
                    point.energyLevel = data.energyLevel
                }
            }

            points.sort((a, b) => a.hour - b.hour)
            setPoints([...points])
        }
    }

    function getPosInfo(isX) {
        var offset = isX ? 35 : 5
        var size = isX ? 59 : 36.75
        var range = isX ? [6, 24] : [0, 10]

        return [offset, size, range]
    }

    function posToValue(pos, isHours) {

        var [offset, size, range] = getPosInfo(isHours)

        const canvasRect = document.getElementById("energyCanvas").getBoundingClientRect()
        var pos = pos - (isHours ? canvasRect.left : canvasRect.top) - pointSize
        var remainder = (pos - offset) % size
        var value = (pos - offset - remainder) / size

        if (remainder > (size / 2))
            value++

        if (isHours)
            value += 6

        return clamp(value, range[0], range[1])
    }

    function valueToPos(value, isHours) {
        var [offset, size, range] = getPosInfo(isHours)
        value = clamp(value, range[0], range[1])

        if (isHours)
            value -= 6

        return value * size + offset
    }

    function mouseDownHandler(id) {
        setDragging(id)
        htmlDragging = true
    }

    function mouseUpHandler() {
        setDragging(undefined)
        htmlUp = true
    }

    function contextMenuHandler(e, index) {
        clearCanvas()

        e.preventDefault()
        points.splice(index, 1)
        setPoints([...points])
        setDragging(undefined)
    }

    function clearCanvas() {
        var oldLength = points.length
        for (var i = 0; i < oldLength - 1; i++) {
            const el = document.getElementById("energyLineCanvas-" + i)
            if (el)
                el.remove()
        }
    }

    function canvasDownHandler(e) {
        if (e.button == 0 && !htmlDragging) {
            const data = { hour: posToValue(e.clientX, true), energyLevel: posToValue(e.clientY, false), id: generatePointId() }

            for (var point of points)
                if (point.hour == data.hour && points.indexOf(point) != dragging)
                    return

            points.push(data)
            points.sort((a, b) => a.hour - b.hour)
            setPoints([...points])
            setDragging(data.id)
        }
    }

    function canvasContextMenuHandler(e) {
        e.preventDefault()
    }

    function generatePointId() {
        while (true) {
            var result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (var i = 0; i < 6; i++) {
                result += characters.charAt(Math.floor(Math.random() *
                    characters.length));
            }

            for (var point of points) {
                if (point.id == result)
                    continue
            }

            return result
        }
    }

    return (
        <div id="energyCanvas" className={styles.wrapper}>
            <div className={styles.targetCanvas} onMouseMove={moveHandler} onMouseDown={canvasDownHandler} onContextMenu={canvasContextMenuHandler} />
            <div className={styles.graphicHorizontalCanvas}>
                {percents.map(percent =>
                    <>
                        <div key={`energyHorizontalPercent-${percent}`} className={styles.percent} >{percent}</div>
                        <div />
                        <div key={`energyHorizontalLine-${percent}`} className={styles.horizontalLine} />
                    </>
                )}
            </div>
            <div className={styles.graphicCanvas}>
                {hours.map(hour => <div key={`energyLine-${hour}`} className={styles.line} />)}
                {hours.map(hour => <div key={`energyHour-${hour}`} className={styles.hour} >{hour}</div>)}
            </div>
            {
                points.map(point => {
                    return <div key={`energyPoint-${point.id}`} id={`energyPoint-${point.id}`} className={styles.point} style={{ top: valueToPos(point.energyLevel, false) + "px", left: valueToPos(point.hour, true) + "px", borderWidth: pointSize + "px" }} onMouseMove={moveHandler} onMouseDown={e => mouseDownHandler(point.id)} onContextMenu={e => { contextMenuHandler(e, point.id) }} />
                })
            }
        </div >
    )
}

// ==========
// UTIL
// ==========

function getPointData(point) {
    return {
        x: point.getBoundingClientRect().x + (point.getBoundingClientRect().width / 2),
        y: point.getBoundingClientRect().y + (point.getBoundingClientRect().height / 2)
    }
}

// Credit to Phil H on StackOverflow (https://stackoverflow.com/questions/20752723/draw-line-from-html-element-id-to-another-html-element-with-jquery-and-canvas)
function drawLineXY(fromXY, toXY, canvasNum) {
    var lineElem = document.getElementById("energyLineCanvas-" + canvasNum)
    if (!lineElem) {
        lineElem = document.createElement('canvas');
        lineElem.style.position = "absolute";
        lineElem.classList.add(styles.drawnCanvas)
        lineElem.id = "energyLineCanvas-" + canvasNum
        document.body.appendChild(lineElem);
    }
    var leftpoint, rightpoint;
    if (fromXY.x < toXY.x) {
        leftpoint = fromXY;
        rightpoint = toXY;
    } else {
        leftpoint = toXY;
        rightpoint = fromXY;
    }

    var lineWidthPix = 4;
    var gutterPix = 10;
    var origin = {
        x: leftpoint.x - gutterPix,
        y: Math.min(fromXY.y, toXY.y) - gutterPix
    };
    lineElem.width = Math.max(rightpoint.x - leftpoint.x, lineWidthPix) +
        2.0 * gutterPix;
    lineElem.height = Math.abs(fromXY.y - toXY.y) + 2.0 * gutterPix;
    lineElem.style.left = origin.x + "px";
    lineElem.style.top = origin.y + "px";
    var ctx = lineElem.getContext('2d');
    // Use the identity matrix while clearing the canvas
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, lineElem.width, lineElem.height);
    ctx.restore();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#52afff';
    ctx.beginPath();
    ctx.moveTo(fromXY.x - origin.x, fromXY.y - origin.y);
    ctx.lineTo(toXY.x - origin.x, toXY.y - origin.y);
    ctx.stroke();
}

export default Component