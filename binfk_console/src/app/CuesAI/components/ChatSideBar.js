"use client";

import styles from './ChatWin.module.css';
import { useState, useEffect } from "react";
import axios from 'axios';




export function ChatSlideBar() {

    const [previousChats, setPreviousChats] = useState([]);

    useEffect(() => {

        async function fetcHistory(){

            try{
                const response = await axios.get("http://localhost:6050/cuesai/history")
                const data = response.data

                setPreviousChats(data.payload)
            }

            catch(err){
                console.log(err)
            }
        }
        fetcHistory()
    }, [])

     return(
        <div className= {styles.chatSideBarComp}>
            <div className={styles.chatNewChatDIV}>
                <button>New Chat</button>
            </div>
            <h2>Your chats</h2>
            <div className={styles.chatHistoryDiv}>
                {previousChats.map(chathist => (
                    <button key={chathist._id}>
                        {chathist.createdAt}
                    </button>
                ))}
            </div>
        </div>
     );

}