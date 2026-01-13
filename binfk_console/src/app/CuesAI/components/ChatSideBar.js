"use client";

import styles from './ChatWin.module.css'
import { useState } from "react";

const UserChatTitles = [
    {
        "ChatId" : 236732,
        "ChatTitle" : "Metagenomics"
    },
    {
        "ChatId" : 383883,
        "ChatTitle" : "GeoMx chat"
    },
    {
        "ChatId" : 332883,
        "ChatTitle" : "Chat nanopore"
    },
    {
        "ChatId" : 3344883,
        "ChatTitle" : "Chat pricing"
    },
    {
        "ChatId" : 443883,
        "ChatTitle" : "Chat thera"
    },

]



export function ChatSlideBar() {

    const [previousChats, setPreviousChats] = useState(UserChatTitles);

     return(
        <div className= {styles.chatSideBarComp}>
            <div className={styles.chatNewChatDIV}>
                <button>New Chat</button>
            </div>
            <div className={styles.chatHistoryDiv}>
                <h2>Chat History</h2>
                {previousChats.map(chathist => (
                    <button key={chathist.ChatId}>
                        {chathist.ChatTitle}
                    </button>
                ))}
            </div>
        </div>
     );

}