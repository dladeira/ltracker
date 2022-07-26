import { useEffect, useState } from 'react'
import { useAppContext } from '../lib/context'

import styles from './formInput.module.scss'

export default function FormInput({ defaultValue, type, onSave, contextKey, width }) {
    const [context, setContext] = useAppContext()
    const [lastValue, setLastValue] = useState(defaultValue)
    const [value, setValue] = useState(defaultValue)

    function setData(index, value) {
        if (!context.data || !context.data[contextKey]) {
            context.data = {}
            context.data[contextKey] = {}
        }

        context.data[contextKey][index] = value
        setContext({ ...context })
    }

    function getData(index) {
        if (context.data && context.data[contextKey])
            return context.data[contextKey][index]
        return undefined
    }

    const timeToSave = 700

    useEffect(() => {
        if (lastValue != getData("value") && getData("value") !== undefined) {
            setData("timeModified", Date.now())
            setLastValue(getData("value"))
        }
        save()
    }, [value])

    function save() {
        if (Date.now() - getData("timeModified") >= timeToSave) {
            if (getData("value") != getData("valueSaved")) {
                onSave(getData("value"))
                setData("valueSaved", getData("value"))
            }
        } else {
            new Promise(res => {
                setTimeout(res, timeToSave)
            }).then(save)
        }
    }

    function handleChange(value) {
        setValue(Math.random())
        setData("value", value)
    }


    switch (type) {
        case "text":
            return (
                <div>
                    <input className={getData("valueSaved") == getData("value") ? styles.text : styles.textModified} style={{ width: width }} type="text" value={getData("value") ? getData("value") : defaultValue} onChange={e => handleChange(e.target.value)} />
                </div>
            )
        case "checkbox":
            const thisValue = getData("value") !== undefined ? getData("value") : defaultValue
            return (
                <div>
                    <input className={getData("valueSaved") == getData("value") ? styles.checkbox : styles.checkboxModified} style={{ width: width }} type="checkbox" checked={thisValue} onChange={e => handleChange(!thisValue)} />
                </div>
            )
        case "number":
            return (
                <div>
                    <input className={getData("valueSaved") == getData("value") ? styles.text : styles.textModified} style={{ width: width }} type="number" value={getData("value") ? getData("value") : defaultValue} onChange={e => handleChange(e.target.value)} />
                </div>
            )
    }
}