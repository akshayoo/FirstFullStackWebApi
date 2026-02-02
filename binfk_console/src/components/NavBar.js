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
    projects: "Projects",
    servitems: "Items",
    aws: "AWSup",
    aichat: "CuesAI",
    intake : "Submissions",
    items : "Items"
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
                    {navLink.projects}
                </button>
            </Link>

            <Link href="/Items">
                <button
                    className= {styles.navBtns}>
                    {navLink.items}
                </button>
            </Link>

            <Link href="/SSubTrack">
                <button 
                    className= {styles.navBtns}>
                    {navLink.intake}
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
