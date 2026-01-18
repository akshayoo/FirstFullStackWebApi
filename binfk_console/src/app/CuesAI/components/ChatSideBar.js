"use client";

import styles from './ChatWin.module.css';
import { useState, useEffect } from "react";
import axios from 'axios';




export function ChatSlideBar() {

    const [previousChats, setPreviousChats] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:4000/chat/chatContent").then(resp => {
            console.log(resp.data)
            setPreviousChats(resp.data.conversations);
        });
    }, [])

     return(
        <div className= {styles.chatSideBarComp}>
            <div className={styles.chatNewChatDIV}>
                <button>New Chat</button>
            </div>
            <h2>Chat History</h2>
            <div className={styles.chatHistoryDiv}>
                {previousChats.map(chathist => (
                    <button key={chathist._id}>
                        {chathist.conversationId}
                    </button>
                ))}
            </div>
        </div>
     );

}