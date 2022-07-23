import { useUser } from '../../lib/hooks'

import styles from './addList.module.scss'

function Component() {
    const [,setUser] = useUser({ userOnly: true })

    async function clickHandler() {
        const res = await fetch("/api/user/lists/addList", { method: "POST" })
        const newUser = await res.json()
        setUser({ ...newUser })

    }
    return (
        <div onClick={clickHandler} className={"flex justify-center items-center flex-col relative h-full w-full bg-white rounded-lg p-3.5 " + styles.container}>
            <div className={styles.plusArrow1} />
            <div className={styles.plusArrow2} />
        </div>
    )
}

export default Component