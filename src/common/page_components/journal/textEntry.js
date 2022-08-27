import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context'
import { useUser } from '../../lib/hooks'
import GridItem from '../../components/gridItem'

import styles from './textEntry.module.scss'

function Component() {
    const [context] = useAppContext()
    const [user, setUser] = useUser({ userOnly: true })
    const [text, setText] = useState(user.getTextForDay(context.day, context.week, context.year))
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
            setText(user.getTextForDay(context.day, context.week, context.year))
        }
    }, [context])

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
        <GridItem title="Text Entry" colSpan="2">

            <textarea className={styles.textArea} value={text} onChange={e => { setText(e.target.value) }} onBlur={e => { saveText() }} >
            </textarea>
        </GridItem>
    )
}

export default Component