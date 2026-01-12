"use client";
import { useState } from "react";
import styles from './ChatWin.module.css'

const chats = [{
        "chatId" : 747393,
        "sender" : "user",
        "message" : "Hi Hello"
    },
    {
        "chatId" : 7443493,
        "sender" : "bot",
        "message" : "Hi How are you how can I help you"
    },
    {
        "chatId" : 74723,
        "sender" : "user",
        "message" : "What is the average price of all the ont service"
    },
    {
        "chatId" : 73393,
        "sender" : "bot",
        "message" : "The price averages between 100000 to 200000"       
    },
    {
        "chatId" : 7475693,
        "sender" : "user",
        "message" : "Is it"
    },
    {
        "chatId" : 7475345693,
        "sender" : "bot",
        "message" : "Yes"
    },
        {
        "chatId" : 74553593,
        "sender" : "user",
        "message" : "Thankyou"
    },
        {
        "chatId" : 775733,
        "sender" : "bot",
        "message" : "You are welcome"
    }

]



export function ChatBar() {

    const [chatHist, setChatHist] = useState(chats)

    return(
        <div className={styles.chatContainer}> 
            {chatHist.map(chathist => (
                <div key={chathist.chatId} className={chathist.sender === 'user' ? styles.chatCompUser : styles.chatCompBot}>
                    <div>
                        {chathist.message}
                    </div>
                </div>
            ))}
        </div>
    );

}