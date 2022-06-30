import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useUser } from '../lib/hooks'
import { generateId } from '../lib/util'

import styles from '../styles/settings.module.scss'

function Page() {
    const [user, setUser] = useUser()

    function getSortedTasks() {
        var tasks = [...user.tasks]
        return tasks.sort((a, b) =>  a.name.localeCompare(b.name))
    }

    async function submitNewTask(e) {
        e.preventDefault()

        user.tasks.push({
            name: "---",
            id: generateId(user),
            public: false
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
                <div className={styles.tasks}>
                    <div className={styles.taskHeaders}>
                        <div className={styles.headerName}>
                            NAME
                        </div>

                        <div className={styles.headerPublic}>
                            PUBLIC
                        </div>
                    </div>
                    {getSortedTasks().map(task => {
                        return <Task task={task} key={task.id} />
                    })}
                </div>

            </div>
            <div className={styles.gridItem} />
            <div className={styles.gridItem} />
        </div >) : <div />
    )
}

function Task({ task }) {
    const [user, setUser] = useUser()
    const [name, setName] = useState(task.name)
    const [pub, setPub] = useState(task.public)
    const [initial, setInitial] = useState(true)

    useEffect(() => {
        if (!initial)
            save()
        else
            setInitial(false)
    }, [name, pub])

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
            <input className={styles.taskName} type="text" name="title" value={name} onChange={e => { setName(e.target.value) }} />
            <div className={pub ? styles.pub : styles.pubFalse} onClick={() => { setPub(!pub) }}>
                <Image src={"/public-icon.svg"} height={16} width={16} />
            </div>
            <div className={styles.taskDelete} type="button" onClick={onDeletePress}>
                <Image src={"/trash-icon.svg"} height={20} width={20} />
            </div>
        </div>
    ) : <div />)
}

export default Page