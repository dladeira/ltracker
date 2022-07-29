import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
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
            <div className={styles.pfp}>
                <Image src={user.getProfilePicture()} layout="fill" />
            </div>

            <div className={styles.username}>{user.getUsername()}</div>

            <div className={styles.email}>{user.getEmail()}</div>

            <div className={styles.divider} />

            <PageLink text="Overview" url="/overview" icon="/overview-icon.svg" />
            <PageLink text="Schedule" url="/schedule" icon="/schedule-icon.svg" />
            <PageLink text="Journal" url="/journal" icon="/journal-icon.svg" />
            <PageLink text="Statistics" url="/statistics" icon="/statistics-icon.svg" />
            <PageLink text="Friends" url="/friends" icon="/friends-icon.svg" />
            <PageLink text="Lists" url="/lists" icon="/lists-icon.svg" />

            {isMobile ? <DateControl /> : ""}
            <div className={styles.bottomLinks}>
                <PageLink text="Settings" url="/settings" icon="/settings-icon.svg" />
                <PageLink text="Logout" url="/api/logout" icon="/logout-icon.svg" />
            </div>
        </div>
    )
}

function PageLink({ text, url, icon = "/overview-icon.svg", height = 14, width = 14 }) {
    const router = useRouter()
    const active = router.pathname == url

    return (
        <a className={styles.link} style={{ color: active ? "#008BFF" : "#7D7D7D" }}>
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