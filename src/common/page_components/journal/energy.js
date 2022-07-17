import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getDay, getWeekDay } from '../../lib/util'

import styles from './energy.module.scss'

function Component() {
    return (
        <div className="flex flex-col relative h-full w-full bg-white rounded-lg p-3.5 pt-1 col-span-3 row-span-2">
            <h3 className="text-lg font-medium">Energy Level</h3>
            <Canvas />
        </div>
    )
}

function Canvas() {
    const [context] = useAppContext()
    const [user, setUser] = useUser({ userOnly: true })

    const [initial, setInitial] = useState(true)

    const [dragging, setDragging] = useState()
    var htmlDragging = false
    var htmlUp = false
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
    const day = getDay(user, getWeekDay(new Date()), context.week, context.year)

    const [lastMouseUp, setLastMouseUp] = useState()
    const [points, setPoints] = useState(day && day.points ? day.points : [])

    async function savePoints() {
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
        console.log("saving points")
    }

    const hours = ["6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "19PM", "10 PM", "11 PM", "12 AM"]
    const percents = ["0%", "", "20%", "", "40%", "", "60%", "", "80%", "", "100%"]
    const pointSize = 15

    useEffect(() => {
        if (initial)
            return setInitial(false)

        savePoints()
    }, [points])

    useEffect(() => {
        for (var point of points) {
            const index = points.indexOf(point)
            const nextPoint = points[index + 1]
            if (nextPoint != null) {
                const point1 = getPointData(document.getElementById("energyPoint-" + index));
                const point2 = getPointData(document.getElementById("energyPoint-" + (index + 1)));
                drawLineXY(point1, point2, index)
            }
        }
    })

    useEffect(() => {
        if (context.lastMouseUp != lastMouseUp) {
            setLastMouseUp(context.lastMouseUp)
            if (dragging !== undefined)
                mouseUpHandler()
        }
    }, [context])

    function moveHandler(e) {
        if (dragging !== undefined && !htmlUp) {
            const data = { hour: posToValue(e.clientX, true), energyLevel: posToValue(e.clientY, false) }
            for (var point of points) {
                if (points.indexOf(point) == dragging && point.hour == data.hour && point.energyLevel == data.energyLevel)
                    return
                if (point.hour == data.hour && points.indexOf(point) != dragging)
                    return
            }

            points[dragging] = data
            points.sort((a, b) => a.hour - b.hour)
            setDragging(points.findIndex(point => data.hour == point.hour))
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

    function mouseDownHandler(index) {
        setDragging(index)
        htmlDragging = true
    }

    function mouseUpHandler() {
        console.log("mouse up")
        setDragging(undefined)
        htmlUp = true
    }

    function contextMenuHandler(e, index) {
        var oldLength = points.length
        for (var i = 0; i < oldLength - 1; i++) {
            document.getElementById("energyLineCanvas-" + i).remove()
        }

        e.preventDefault()
        points.splice(index, 1)
        setPoints([...points])
        setDragging(undefined)
    }

    function canvasDownHandler(e) {
        if (!htmlDragging) {
            const data = { hour: posToValue(e.clientX, true), energyLevel: posToValue(e.clientY, false) }

            for (var point of points)
                if (point.hour == data.hour && points.indexOf(point) != dragging)
                    return

            points.push(data)
            points.sort((a, b) => a.hour - b.hour)
            setPoints([...points])
            setDragging(points.length - 1)
        }
    }

    function canvasContextMenuHandler(e) {
        e.preventDefault()
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
                    const index = points.indexOf(point)
                    return <div key={`energyPoint-${index}`} id={`energyPoint-${index}`} className={styles.point} style={{ top: valueToPos(point.energyLevel, false) + "px", left: valueToPos(point.hour, true) + "px", borderWidth: pointSize + "px" }} onMouseMove={moveHandler} onMouseDown={e => mouseDownHandler(index)} onContextMenu={e => { contextMenuHandler(e, index) }} />
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