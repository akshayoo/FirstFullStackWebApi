"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import styles from './ChatWin.module.css'
import Image from "next/image";
import { INFINITE_CACHE } from "next/dist/lib/constants";


export function ChatBar() {


  const [inputMessage, setInputMessage] = useState("");

  async function InputMessagePost() {

    if(!inputMessage.trim()) return;

    try {

      const res = await axios.post("http://localhost:4000/chat/chatInputs", {
        "userID" : "u_001",
        "conversationId" : crypto.randomUUID(),
        "role" : "user",
        "content"  : inputMessage.trim()
      });

      console.log("Message sent", res.data)

    }
    catch(error) {
      console.error(error)
    }
    
  }
  

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

function InputBar() {
  return (
    <>
      <input value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}/>
      <button className={styles.InputButton} onClick={InputMessagePost}>
        <Image
          src={"/send.png"} alt="Send_Message" width={30} height={30}/>
      </button>
    </>
  )
}
