import { NavBar } from "@/components/NavBar";
import {ItemsNav} from '../components/ItemsNav'
import { InsertComp } from "./InsertComp";
import styles from '../Items.module.css'

export function Insert(){
    return(
        <div className={styles.container}>
            <NavBar />
            <ItemsNav />
            <InsertComp />
        </div>
    );
}