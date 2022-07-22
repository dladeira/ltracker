import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useUser } from '../../lib/hooks'

import styles from './checklist.module.scss'

export function Checklists() {
    const [user, setUser] = useUser({ userOnly: true })

    function getSortedChecklists() {
        var checklist = user.getChecklists()
        return checklist.sort((a, b) => a.name.localeCompare(b.name))
    }

    async function submitNewChecklist(e) {
        e.preventDefault()

        var checklist = user.getChecklists()
        checklist.push({
            name: "---",
            id: user.generateId()
        })

        const res = await fetch(window.origin + "/api/user/setChecklist", {
            body: JSON.stringify({
                checklist: checklist
            }),
            method: "POST"
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    return (
        <div className={styles.gridItem}>
            <div className={styles.itemHeader}>
                <div className={styles.itemTitle}>
                    Checklist
                </div>
                <div className={styles.addButton} onClick={submitNewChecklist}>
                    +
                </div>
            </div>
            <div className={styles.itemList}>
                <div className={styles.listHeader}>
                    <div>
                        NAME
                    </div>
                </div>

                {getSortedChecklists().map(checklist => {
                    return <Checklist checklist={checklist} key={checklist.id} />
                })}
            </div>

        </div>
    )
}

function Checklist({ checklist }) {
    const [user, setUser] = useUser({ userOnly: true })
    const [name, setName] = useState(checklist.name)
    const [initial, setInitial] = useState(true)

    useEffect(() => {
        if (!initial)
            save()
        else
            setInitial(false)
    }, [name])

    useEffect(() => {
        var newChecklist = user.getChecklist(checklist.id)
        setName(newChecklist.name)
    }, [user])

    async function save() {
        var checklists = [...user.getChecklists()]
        var index = checklists.findIndex(loopChecklist => loopChecklist.id == checklist.id)

        checklists[index].name = name

        const res = await fetch(window.origin + "/api/user/setChecklist", {
            body: JSON.stringify({
                checklist: checklists
            }),
            method: "POST"
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    async function onDeletePress() {
        var checklists = [...user.getChecklists()]
        checklists = checklists.filter(loopChecklist => checklist.id != loopChecklist.id)

        const res = await fetch(window.origin + "/api/user/setChecklist", {
            body: JSON.stringify({
                checklist: checklists
            }),
            method: "POST"
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    return (
        <div className={styles.checklist}>
            <input className={styles.checklistName} type="text" name="title" value={name} onChange={e => { setName(e.target.value) }} />
            <div className={styles.checklistDelete} type="button" onClick={onDeletePress}>
                <Image src={"/trash-icon.svg"} height={20} width={20} />
            </div>
        </div>
    )
}