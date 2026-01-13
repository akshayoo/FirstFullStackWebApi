"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import styles from './ChatWin.module.css'



function InputBar() {
  return <input />;
}

export function ChatBar() {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() =>{
    axios.get("http://localhost:4000/chat/chatContent").then(response => {
      setChatMessages(response.data.conversations[0].messages)
    })
  }, [])

  return (
    <div className={styles.chatBar}>
        <div className={styles.chatMessages}>
        {chatMessages.map(chat => (
            <div key={chat.createdAt} className={chat.role == 'user' ? styles.chatUserMessage : styles}>
                {chat.content}
            </div>
        ))}
        </div>

        <div className={styles.chatInputBar}>
            <InputBar />
        </div>
    </div>
  );
}
