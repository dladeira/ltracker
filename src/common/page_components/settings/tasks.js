import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useUser } from '../../lib/hooks'


import styles from './tasks.module.scss'

export function Tasks() {
    const [user, setUser] = useUser({ userOnly: true })

    function getSortedTasks() {
        var tasks = user.getTasks()
        return tasks.sort((a, b) => a.name.localeCompare(b.name))
    }

    async function submitNewTask(e) {
        e.preventDefault()

        var tasks = [...user.getTasks()]
        tasks.push({
            name: "---",
            id: user.generateId(),
            public: false,
            color: "#E9807F"
        })

        const res = await fetch(window.origin + "/api/user/setTasks", {
            body: JSON.stringify({
                tasks: tasks
            }),
            method: "POST"
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    // <div className="h-full w-full bg-white rounded-lg p-3.5 pt-1">
    //     <h3 className="text-lg font-medium">Sleep</h3>

    return (
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
    )
}

function Task({ task }) {
    const [user, setUser] = useUser({ userOnly: true })
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

    useEffect(() => {
        var newTask = user.getTask(task.id)
        setName(newTask.name)
        setColor(newTask.color)
        setPub(newTask.public)
    }, [user])

    async function save() {
        var tasks = [...user.getTasks()]
        var index = tasks.findIndex(loopTask => loopTask.id == task.id)

        console.log(pub)

        tasks[index].name = name
        tasks[index].public = pub
        tasks[index].color = color

        const res = await fetch(window.origin + "/api/user/setTasks", {
            body: JSON.stringify({
                tasks: tasks
            }),
            method: "POST"
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    async function onDeletePress() {
        var tasks = [...user.getTasks()]
        tasks = tasks.filter(loopTask => task.id != loopTask.id)

        const res = await fetch(window.origin + "/api/user/setTasks", {
            body: JSON.stringify({
                tasks: tasks
            }),
            method: "POST"
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    return (
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
    )
}