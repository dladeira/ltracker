import Image from 'next/image'
import { useState } from 'react'
import { useUser } from '../../lib/hooks'
import { generateId } from '../../lib/util'

import styles from './list.module.scss'

function Component({ list }) {
    const [panelOpen, setPanelOpen] = useState(false)
    const rows = [0, 2, 4, 6, 8, 10]

    return (
        <div className="flex flex-col h-full w-full bg-white rounded-lg p-3.5 pt-1">
            <Panel list={list} openData={[panelOpen, setPanelOpen]} />
            <div className={styles.control}>
                <h3 className={"text-lg font-medium " + styles.title}>{list.name}</h3>
                <div className={styles.options} onClick={e => setPanelOpen(true)}>
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                </div>
            </div>

            <div className={styles.items}>
                {rows.map(row => {
                    const leftItem = list.items[row]
                    const rightItem = list.items[row + 1]

                    return (
                        <div key={"list-row-" + row} className={styles.row}>
                            {leftItem ? <Item key={"list-" + list.id + "-" + leftItem.id} name={leftItem.name} /> : <Item key={"list-empty-" + Math.random()} name={""} />}
                            <div className={styles.divider} key={"list-divider-" + Math.random()} />
                            {rightItem ? <Item key={"list-" + list.id + "-" + rightItem.id} name={rightItem.name} right={true} /> : <Item key={"list-empty-" + Math.random()} name={""} />}
                        </div>
                    )
                })}
            </div>
        </div >
    )
}

function Item({ name, right }) {
    const [checked, setChecked] = useState(false)
    return (right ?
        <div className={styles.itemRight}>
            {name ? <input type="checkbox" value={checked} onChange={e => { setChecked(!checked) }} className={styles.checkboxRight} /> : ""}
            {name}
        </div>
        :
        <div className={styles.itemLeft} >
            {name}
            {name ? <input type="checkbox" value={checked} onChange={e => { setChecked(!checked) }} className={styles.checkboxLeft} /> : ""}
        </ div >
    )
}

function Panel({ list, openData }) {
    const [user, setUser] = useUser({ userOnly: true })
    const [name, setName] = useState(list.name)
    const [items, setItems] = useState(list.items)
    const [open, setOpen] = openData

    function setItem(item) {
        for (var i = 0; i < items.length; i++) {
            const loopItem = items[i]
            if (loopItem.id == item.id) {
                items[i].name = item.name
            }
        }

        setItems([...items])
    }

    async function deleteItem(item) {
        for (var i = 0; i < items.length; i++) {
            const loopItem = items[i]
            if (loopItem.id == item.id) {
                items.splice(i, 1)
                setItems([...items])
                list.items = items
                const res = await fetch("/api/user/lists/updateList", {
                    method: "POST",
                    body: JSON.stringify({
                        listId: list.id,
                        list: list
                    })
                })
                const newUser = await res.json()
                setUser({ ...newUser })
            }
        }
    }

    async function addItem() {
        items.push({
            name: "New Item",
            id: generateId(user)
        })
        setItems([...items])
        list.items = items
        const res = await fetch("/api/user/lists/updateList", {
            method: "POST",
            body: JSON.stringify({
                listId: list.id,
                list: list
            })
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    function closePanel() {
        fetch("/api/user/lists/updateList", {
            method: "POST",
            body: JSON.stringify({
                listId: list.id,
                list: list
            })
        })

        setOpen(false)
    }

    async function onDeletePress() {
        const res = await fetch("/api/user/lists/deleteList", {
            method: "POST",
            body: JSON.stringify({
                listId: list.id
            })
        })
        const newUser = await res.json()
        setUser({ ...newUser })
    }

    return (open ? (
        <div className={styles.panelContainer} onClick={() => closePanel()}>
            <div className={styles.panel} onClick={e => e.stopPropagation()}>
                <div className={styles.listDeleteEdit} type="button" onClick={onDeletePress}>
                    <Image src={"/trash-icon.svg"} height={40} width={40} />
                </div>
                <input className={styles.nameInput} type="text" value={name} onChange={e => setName(e.target.value)} />

                <div className={styles.items}>
                    {items.map(item => {
                        return <PanelItem key={"listEdit-" + list.id + "-" + item.id} itemData={[item, setItem, deleteItem]} />
                    })}
                </div>
                <div className={styles.addNewItem} onClick={addItem}>
                    +
                </div>
            </div>
        </div>
    ) : <div />)
}

function PanelItem({ itemData }) {
    const [item, setItem, deleteItem] = itemData

    return (
        <div className={styles.editItem}>
            <input className={styles.itemInput} type="text" value={item.name} onChange={e => { item.name = e.target.value; setItem(item) }} />

            <div className={styles.itemDelete} type="button" onClick={e => deleteItem(item)}>
                <Image src={"/trash-icon.svg"} height={20} width={20} />
            </div>
        </div>
    )
}

export default Component