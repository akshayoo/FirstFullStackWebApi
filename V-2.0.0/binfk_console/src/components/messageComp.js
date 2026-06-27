
import styles from './messageComp.module.css'




export function MessageComp({ condition, message }) {
    return (
        <div className={`${styles.toast} 
            ${condition ? styles.success : styles.error}`}>

            <div className={styles.iconBox}>
                {condition ? "✔" : "⚠"}
            </div>

            <div className={styles.message}>
                {message}
            </div>

            <div className={styles.progress}></div>
        </div>
    );
}