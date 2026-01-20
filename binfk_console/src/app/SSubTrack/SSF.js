import { NavBar } from "@/components/NavBar";
import{SSFNav} from './components/SSFNav'
import styles from './SSF.module.css'

export function SSF(){
    return(
        <div className={styles.container}>
            <NavBar />
            <SSFNav />
        </div>
    );
}