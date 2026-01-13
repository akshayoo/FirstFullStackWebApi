import styles from './ChatWin.module.css'
import { ChatSlideBar } from './ChatSideBar';
import { ChatBar } from './ChatBar'



export function ChatWin() {
     return(

        <>
            <div className={styles.chatWin}>
                <ChatSlideBar />
                <ChatBar />
            </div>
        </>

     );
}

