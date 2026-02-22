import styles from './ChatWin.module.css';

export function ChatOption({ chatDelete, chatRename }) {
    return (
        <div className={styles.chatOptionsFloating}>
            <button className={styles.chatOptionsBtn} onClick={chatRename}>Rename</button>
            <button className={styles.chatOptionsBtn} onClick={chatDelete}>Delete</button>
        </div>
    );
}