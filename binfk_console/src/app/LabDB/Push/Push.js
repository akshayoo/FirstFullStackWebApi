import { NavBar } from "@/components/NavBar";
import { DbNav } from "../components/DbNav";
import { PushComp } from './PushComp';
import styles from "../LabDB.module.css";

export function Push() {

  
    
  return (
    <>
      <NavBar />
      <div className={styles.InitialDiv}>
        <DbNav />
      </div>
      <div className={styles.InitialComp}>
        <PushComp />
      </div>
    </>
  );
}