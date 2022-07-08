import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useUser } from '../lib/hooks'
import { generateId } from '../lib/util'

import styles from '../styles/settings.module.scss'

function Page() {
    const [user, setUser] = useUser()

    function getSortedTasks() {
        var tasks = [...user.tasks]
        return tasks.sort((a, b) => a.name.localeCompare(b.name))
    }

    function getSortedChecklist() {
        var checklist = [...user.checklist]
        return checklist.sort((a, b) => a.name.localeCompare(b.name))
    }

    async function submitNewTask(e) {
        e.preventDefault()

        user.tasks.push({
            name: "---",
            id: generateId(user),
            public: false,
            color: "#E9807F"
        })

        setUser({ ...user })

        await fetch(window.origin + "/api/tasks", {
            body: JSON.stringify({
                tasks: user.tasks
            }),
            method: "POST"
        })
    }

    return (user ? (
        <div className={styles.grid}>
            <div className={styles.gridItem} />
            <div className={styles.gridItem + " " + styles.itemTasks}>
                <div className={styles.itemHeader}>
                    <div className={styles.itemTitle}>
                        Tasks
                    </div>
                    <div className={styles.addButton} onClick={submitNewTask}>
                        +
                    </div>
                </div>
                <div className={styles.itemList}>
                    <div className={styles.listHeader}>
                        <div style={{ marginRight: "114%" }}>
                            NAME
                        </div>
                        <div style={{ marginRight: "5%" }}>
                            COLOR
                        </div>
                        <div>
                            PUBLIC
                        </div>
                    </div>

                    {getSortedTasks().map(task => {
                        return <Task task={task} key={task.id} />
                    })}
                </div>

            </div>
            <div className={styles.gridItem}>
                <div className={styles.itemHeader}>
                    <div className={styles.itemTitle}>
                        Checklist
                    </div>
                    <div className={styles.addButton} onClick={submitNewTask}>
                        +
                    </div>
                </div>
                <div className={styles.itemList}>
                    <div className={styles.listHeader}>
                        <div>
                            NAME
                        </div>
                    </div>

                    {getSortedChecklist().map(checklist => {
                        return <Checklist checklist={checklist} key={checklist.id} />
                    })}
                </div>

            </div>
            <div className={styles.gridItem} />
            <div className={styles.gridItem} />
            <div className={styles.gridItem} />
            <div className={styles.gridItem} />
            <div className={styles.gridItem} />
            <div className={styles.gridItem} />
            <div className={styles.gridItem} />
            <div className={styles.gridItem} />
        </div >) : <div />
    )
}

function Task({ task }) {
    const [user, setUser] = useUser()
    const [name, setName] = useState(task.name)
    const [color, setColor] = useState(task.color)
    const [picker, setPicker] = useState(false) // Whether the color picker is open
    const [pub, setPub] = useState(task.public)
    const [initial, setInitial] = useState(true)

    useEffect(() => {
        if (!initial)
            save()
        else
            setInitial(false)
    }, [name, color, pub])

    function getIndex() {
        for (var i = 0; i < user.tasks.length; i++) {
            if (user.tasks[i].id == task.id) {
                return i
            }
        }
    }

    async function save() {
        var taskIndex = getIndex()

        user.tasks[taskIndex].name = name
        user.tasks[taskIndex].public = pub
        user.tasks[taskIndex].color = color


        setUser({ ...user })
        await fetch(window.origin + "/api/user/setTasks", {
            body: JSON.stringify({
                tasks: user.tasks
            }),
            method: "POST"
        })
    }

    async function onDeletePress() {
        user.tasks = user.tasks.filter(currentTask => task.id != currentTask.id)

        await fetch(window.origin + "/api/user/setTasks", {
            body: JSON.stringify({
                tasks: user.tasks
            }),
            method: "POST"
        })

        setUser({ ...user })
    }

    return (user ? (
        <div className={styles.task}>
            <input className={styles.taskName} type="text" value={name} onChange={e => { setName(e.target.value) }} />
            <div className={styles.taskColor} style={{ backgroundColor: color }} onClick={e => { setPicker(!picker) }} />
            {picker ? (
                <div className={styles.pickerWrapper} onClick={e => { setPicker(false) }}>
                    <div className={styles.taskPicker}>
                        <div className={styles.pickerGrid}>
                            <div className={styles.pickerColor} style={{ backgroundColor: "#99C1F1" }} onClick={e => { setColor("#99C1F1"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#A7D35F" }} onClick={e => { setColor("#A7D35F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                            <div className={styles.pickerColor} style={{ backgroundColor: "#E9807F" }} onClick={e => { setColor("#E9807F"), setPicker(false) }} />
                        </div>
                    </div>
                </div>
            ) : <div />}
            <div className={pub ? styles.pub : styles.pubFalse} onClick={() => { setPub(!pub) }}>
                <Image src={"/public-icon.svg"} height={16} width={16} />
            </div>
            <div className={styles.taskDelete} type="button" onClick={onDeletePress}>
                <Image src={"/trash-icon.svg"} height={20} width={20} />
            </div>
        </div>
    ) : <div />)
}

function Checklist({ checklist }) {
    const [user, setUser] = useUser()
    const [name, setName] = useState(checklist.name)
    const [initial, setInitial] = useState(true)

    useEffect(() => {
        if (!initial)
            save()
        else
            setInitial(false)
    }, [name])

    function getIndex() {
        for (var i = 0; i < user.checklist.length; i++) {
            if (user.checklist[i].id == checklist.id) {
                return i
            }
        }
    }

    async function save() {
        var index = getIndex()

        user.checklist[index].name = name


        setUser({ ...user })
        await fetch(window.origin + "/api/user/setChecklist", {
            body: JSON.stringify({
                checklist: user.checklist
            }),
            method: "POST"
        })
    }

    async function onDeletePress() {
        user.checklist = user.checklist.filter(item => checklist.id != item.id)

        await fetch(window.origin + "/api/user/Checklist", {
            body: JSON.stringify({
                checklist: user.checklist
            }),
            method: "POST"
        })

        setUser({ ...user })
    }

    return (user ? (
        <div className={styles.checklist}>
            <input className={styles.checklistName} type="text" name="title" value={name} onChange={e => { setName(e.target.value) }} />
            <div className={styles.checklistDelete} type="button" onClick={onDeletePress}>
                <Image src={"/trash-icon.svg"} height={20} width={20} />
            </div>
        </div>
    ) : <div />)
}

export default Page