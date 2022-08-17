import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { useMediaQuery } from "react-responsive"
import { useAppContext } from "../lib/context"
import { useUser } from '../lib/hooks'
import DateControl from "./dateControl"

import styles from "./userbar.module.scss"

function Component() {
    const [context, setContext] = useAppContext()
    const [user] = useUser({ userOnly: true })
    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })

    return (
        <div className={context.userbarOpen ? styles.containerOpen : styles.containerClosed}>

            <div className={styles.brand}>
                Tracker
            </div>

            <PageLink text="Overview" url="/overview" icon="/overview-icon.svg" />
            <PageLink text="Schedule" url="/schedule" icon="/schedule-icon.svg" />
            <PageLink text="Journal" url="/journal" icon="/journal-icon.svg" />
            <PageLink text="Statistics" url="/statistics" icon="/statistics-icon.svg" />
            <PageLink text="Friends" url="/friends" icon="/friends-icon.svg" />
            <PageLink text="Lists" url="/lists" icon="/lists-icon.svg" />
            <PageLink text="Settings" url="/settings" icon="/settings-icon.svg" />
            {isMobile ? <DateControl /> : ""}
            <Patch />
            <div className={styles.divider} />

            <div className={styles.userCard}>
                <div className={styles.pfp}><Image src={user.getProfilePicture()} layout="fill" /></div>
                <div className={styles.username}>{user.getUsername()}</div>
                <div className={styles.email}>{user.getEmail()}</div>
                <a className={styles.logout} href="/api/logout">
                    <Image height="20px" width="20px" src="/logout-icon.svg" />
                </a>
            </div>
        </div>
    )
}

function Patch() {
    const [visible, setVisible] = useState(true)

    return (
        <div className={visible ? styles.patch : styles.patchHidden}>
            <h1 className={styles.patchTitle}>
                Release 1.0
            </h1>
            <ul className={styles.patchList}>
                <li className={styles.patchItem}>-- Navbar UI change</li>
                <li className={styles.patchItem}>-- 7 bug fixes</li>
                <li className={styles.patchItem}>-- Speed improvements</li>
            </ul>

            <div className={styles.patchControl}>
                <button onClick={() => setVisible(false)}>Dismiss</button>
                <a href="https://github.com/dladeira/ltracker">github.com</a>
            </div>
        </div>
    )
}

function PageLink({ text, url, icon = "/overview-icon.svg", height = 14, width = 14 }) {
    const [context, setContext] = useAppContext()
    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })
    const router = useRouter()
    const active = router.pathname == url

    router.events.on('routeChangeComplete', () => {
        if (isMobile) {
            context.userbarOpen = false
            setContext({ ...context })
        }
    })

    return (
        <a className={active ? styles.linkActive : styles.link}>
            <Link href={url}>
                <div className={styles.linkInside}>
                    <div className={active ? styles.imageActive : styles.image}>
                        <Image src={icon} height={height} width={width} />
                    </div>
                    <div className={styles.linkInsideText}>{text}</div>
                </div>
            </Link>
        </a>
    )
}

export default Component