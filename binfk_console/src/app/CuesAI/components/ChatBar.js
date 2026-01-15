"use client";

import axios from "axios";
import { useState } from "react";
import styles from './ChatWin.module.css'
import Image from "next/image";


export function ChatBar() {


  const [inputMessage, setInputMessage] = useState("");

  const [llmchatMessages, setLlmchatMessages] = useState([])

  async function InputMessagePost() {

    if(!inputMessage.trim()) return;

    const QueryMessage =         
    {
      messageId : crypto.randomUUID(),
      role: 'user',
      content: inputMessage.trim()
    }

    setLlmchatMessages(prev => [...prev, QueryMessage]);
    setInputMessage("")

    try{
      const res = await axios.post("http://localhost:4040/chat/llm", QueryMessage)

      const llmMessage = {
        messageId : res.data.messageId,
        role : "assistant",
        content: res.data.content
      }

      setLlmchatMessages(prev => [...prev, llmMessage]);

    }

    catch (error){

      console.log(error);

    }
  }
  

  return (
    <div className={styles.chatBar}>
        <div className={styles.chatMessages}>
        {llmchatMessages.map(chat => (
            <div key={chat.messageId} className={chat.role === 'user' ? styles.chatUserMessage : styles.chatBotMessage}>
                {chat.content}
            </div>
        ))}
        </div>
        <div className={styles.chatInputBar}>
            <InputBar inputMessage={inputMessage} SendIn={InputMessagePost} setInputMessage={setInputMessage} />
        </div>
    </div>
  );
}


function InputBar({inputMessage,setInputMessage, SendIn}) {
  return (
    <>
      <input value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}/>
      <button className={styles.InputButton} onClick={SendIn}>
        <Image
          src={"/send.png"} alt="Send_Message" width={30} height={30}/>
      </button>
    </>
  )
}
