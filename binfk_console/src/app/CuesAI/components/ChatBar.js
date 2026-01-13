"use client";

import { useState } from "react";
import styles from './ChatWin.module.css'

const chats = [
  {
    "chatId": 1001,
    "sender": "user",
    "message": "Hi"
  },
  {
    "chatId": 1002,
    "sender": "bot",
    "message": "Hello, how can I help you?"
  },
  {
    "chatId": 1003,
    "sender": "user",
    "message": "Do you provide ONT sequencing services?"
  },
  {
    "chatId": 1004,
    "sender": "bot",
    "message": "Yes, we provide multiple ONT sequencing services."
  },
  {
    "chatId": 1005,
    "sender": "user",
    "message": "Thank you"
  },
  {
    "chatId": 1006,
    "sender": "bot",
    "message": "You're welcome"
  },

  {
    "chatId": 2001,
    "sender": "user",
    "message": "Hello"
  },
  {
    "chatId": 2002,
    "sender": "bot",
    "message": "Hi, how may I assist you?"
  },
  {
    "chatId": 2003,
    "sender": "user",
    "message": "What samples do you accept?"
  },
  {
    "chatId": 2004,
    "sender": "bot",
    "message": "We accept DNA, RNA, and tissue samples."
  },
  {
    "chatId": 2005,
    "sender": "user",
    "message": "Okay"
  },
  {
    "chatId": 2006,
    "sender": "bot",
    "message": "Let us know if you need details"
  },

  {
    "chatId": 3001,
    "sender": "user",
    "message": "Hi there"
  },
  {
    "chatId": 3002,
    "sender": "bot",
    "message": "Hello! How can I help?"
  },
  {
    "chatId": 3003,
    "sender": "user",
    "message": "What is the turnaround time?"
  },
  {
    "chatId": 3004,
    "sender": "bot",
    "message": "Typically 2 to 4 weeks depending on project scope."
  },
  {
    "chatId": 3005,
    "sender": "user",
    "message": "Got it"
  },
  {
    "chatId": 3006,
    "sender": "bot",
    "message": "Happy to help"
  },

  {
    "chatId": 4001,
    "sender": "user",
    "message": "Hello support"
  },
  {
    "chatId": 4002,
    "sender": "bot",
    "message": "Hi, how can we assist you?"
  },
  {
    "chatId": 4003,
    "sender": "user",
    "message": "Do you offer data analysis?"
  },
  {
    "chatId": 4004,
    "sender": "bot",
    "message": "Yes, we provide end-to-end analysis support."
  },
  {
    "chatId": 4005,
    "sender": "user",
    "message": "Thanks"
  },
  {
    "chatId": 4006,
    "sender": "bot",
    "message": "You're welcome"
  },

  {
    "chatId": 5001,
    "sender": "user",
    "message": "Hi"
  },
  {
    "chatId": 5002,
    "sender": "bot",
    "message": "Hello!"
  },
  {
    "chatId": 5003,
    "sender": "user",
    "message": "Is human genome sequencing available?"
  },
  {
    "chatId": 5004,
    "sender": "bot",
    "message": "Yes, whole genome sequencing is available."
  },
  {
    "chatId": 5005,
    "sender": "user",
    "message": "Great"
  },
  {
    "chatId": 5006,
    "sender": "bot",
    "message": "Feel free to reach out anytime"
  },

  {
    "chatId": 6001,
    "sender": "user",
    "message": "Hello"
  },
  {
    "chatId": 6002,
    "sender": "bot",
    "message": "Hi there"
  },
  {
    "chatId": 6003,
    "sender": "user",
    "message": "What platforms do you use?"
  },
  {
    "chatId": 6004,
    "sender": "bot",
    "message": "We use ONT PromethION and other advanced platforms."
  },
  {
    "chatId": 6005,
    "sender": "user",
    "message": "Okay thanks"
  },
  {
    "chatId": 6006,
    "sender": "bot",
    "message": "You're welcome"
  },

  {
    "chatId": 7001,
    "sender": "user",
    "message": "Hi"
  },
  {
    "chatId": 7002,
    "sender": "bot",
    "message": "Hello"
  },
  {
    "chatId": 7003,
    "sender": "user",
    "message": "Do you support cancer genomics?"
  },
  {
    "chatId": 7004,
    "sender": "bot",
    "message": "Yes, cancer genomics is a key focus area."
  },
  {
    "chatId": 7005,
    "sender": "user",
    "message": "Nice"
  },
  {
    "chatId": 7006,
    "sender": "bot",
    "message": "Glad to hear that"
  },

  {
    "chatId": 8001,
    "sender": "user",
    "message": "Hello team"
  },
  {
    "chatId": 8002,
    "sender": "bot",
    "message": "Hi! How can we help?"
  },
  {
    "chatId": 8003,
    "sender": "user",
    "message": "Do you offer long-read sequencing?"
  },
  {
    "chatId": 8004,
    "sender": "bot",
    "message": "Yes, we specialize in long-read sequencing."
  },
  {
    "chatId": 8005,
    "sender": "user",
    "message": "Thanks"
  },
  {
    "chatId": 8006,
    "sender": "bot",
    "message": "Anytime"
  },

  {
    "chatId": 9001,
    "sender": "user",
    "message": "Hi"
  },
  {
    "chatId": 9002,
    "sender": "bot",
    "message": "Hello"
  },
  {
    "chatId": 9003,
    "sender": "user",
    "message": "Can I get a quotation?"
  },
  {
    "chatId": 9004,
    "sender": "bot",
    "message": "Yes, please share your project details."
  },
  {
    "chatId": 9005,
    "sender": "user",
    "message": "Sure"
  },
  {
    "chatId": 9006,
    "sender": "bot",
    "message": "We will assist you"
  }
]

function InputBar() {
  return <input />;
}

export function ChatBar() {
  const [chatMessages, setChatMessages] = useState(chats);

  return (
    <div className={styles.chatBar}>
        <div className={styles.chatMessages}>
        {chatMessages.map(chat => (
            <div key={chat.chatId} className={chat.sender == 'user' ? styles.chatUserMessage : styles}>
                {chat.message}
            </div>
        ))}
        </div>

        <div className={styles.chatInputBar}>
            <InputBar />
        </div>
    </div>
  );
}
