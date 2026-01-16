import Link from 'next/link'
import Image from "next/image"
import styles from "./NavBar.module.css"

function Logo() {
    return (
        <Image
            src="/logo.webp"
            alt="Theracues logo"
            width={120}
            height={60}
            className={styles.navLogo}
        />
    );
}

const navLink = {
    home: "Home",
    labdb: "LabDB",
    aws: "AWSup",
    aichat: "CuesAI"
}

function NavBtns() {
    return (
        <div className= {styles.navBtnsDiv}>
            <Link href= "/">
                <button
                    className= {styles.navBtns}>
                    {navLink.home}
                </button>
            </Link>

            <Link href = "/CuesAI">
                <button
                    className= {styles.navBtns}>
                    {navLink.aichat}
                </button>
            </Link>

            <Link href="/LabDB">
                <button
                    className= {styles.navBtns}>
                    {navLink.labdb}
                </button>
            </Link>

            <Link href="/SSubTrack">
                <button 
                    className= {styles.navBtns}>
                    {navLink.aws}
                </button>
            </Link>

            <Link href="/AWSup">
                <button 
                    className= {styles.navBtns}>
                    {navLink.aws}
                </button>
            </Link>
        </div>
    );
}

export function NavBar() {
    return (
        <nav className= {styles.navBar}>
            <Logo />
            <NavBtns />
        </nav>
    )
}
