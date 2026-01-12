import styles from './ChatWin.module.css'
import { ChatSlideBar } from './ChatSideBar';
import { ChatBar } from './ChatBar'


function InputBar(){

    return(
        <>
            <input />
        </>
    );
}



export function ChatWin() {
     return(
        <div className={styles.chatAI}>
            <div className={styles.SlideBarDiv}>
                <ChatSlideBar />
            </div>
            <div className={styles.InputWindow}>
                <div className= {styles.chatScreen}>
                    <ChatBar />
                </div>
                <InputBar />
            </div>       
        </div>

     );
}

