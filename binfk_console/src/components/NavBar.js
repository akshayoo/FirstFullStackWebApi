"use client"

import Link from 'next/link'
import Image from "next/image"
import styles from "./NavBar.module.css"
import { useState } from 'react';

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

function UserProfile() {

    const [open, setOpen] = useState(false)

    return(
        <>
            <button 
                className={styles.UserButton}
                onClick={() => setOpen(true)}
            >
                Hi, Gopalakrishna Ramaswamy &#128100;
            </button>

            {open && <div 
                className={styles.overlay}
                onClick={() => setOpen(false)}
            />}

            <div className={`${styles.sidePanel} ${open ? styles.open : ""}`}>
                <div className={styles.panelHeader}>
                    <h3>User Profile</h3>
                    <button onClick={() => setOpen(false)}>✕</button>
                </div>

                <div className={styles.panelBody}>
                    <p><b>Name:</b> Gopalakrishna Ramaswamy</p>
                    <p><b>Email:</b> user@theracues.com</p>
                    <p><b>Role:</b> Scientist</p>
                </div>

                <div className={styles.panelFooter}>
                    <button className={styles.logoutBtn}>Logout</button>
                </div>
            </div>
        </>
    )
}

export function NavBar() {
    return (
        <nav className= {styles.navBar}>
            <Logo />
            <NavBtns />
            <UserProfile />
        </nav>
    )
}
