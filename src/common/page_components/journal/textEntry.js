import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import { getDay } from '../../lib/util'

import styles from './textEntry.module.scss'

function Component() {
    const [context] = useAppContext()
    const [user, setUser] = useUser({ userOnly: true })
    const [text, setText] = useState(getDefaultText())
    const [lastSaveText, setLastSaveText] = useState(new Date().getTime())
    const [initial, setInitial] = useState(true)
    const [lastDate, setLastDate] = useState(context.day + context.week + context.year)

    useEffect(() => {
        if (initial)
            return setInitial(false)

        if ((new Date().getTime() - lastSaveText) > 4000) {
            saveText()
            setLastSaveText(new Date().getTime())
        }
    }, [text])

    useEffect(() => {
        return saveText.bind(null, true)
    }, [])

    useEffect(() => {
        const date = context.day + context.week + context.year
        if (date != lastDate) {
            setLastDate(date)
            setText(getDefaultText())
        }
    }, [context])

    function getDefaultText() {
        const day = getDay(user, context.day, context.week, context.year)

        return day && day.text ? day.text : ""
    }

    async function saveText(dontUpdateUser) {
        const res = await fetch("/api/user/setText", {
            method: "POST",
            body: JSON.stringify({
                day: context.day,
                week: context.week,
                year: context.year,
                text: text
            })
        })
        if (!dontUpdateUser) {
            const newUser = await res.json()
            setUser({ ...newUser })
        }
    }

    return (
        <div className="flex flex-col relative h-full w-full bg-white rounded-lg p-3.5 pt-1 col-span-2">
            <h3 className="text-lg font-medium">Text Entry</h3>

            <textarea className={styles.textArea} value={text} onChange={e => { setText(e.target.value) }} onBlur={e => { saveText() }} >
            </textarea>
        </div>
    )
}

export default Component