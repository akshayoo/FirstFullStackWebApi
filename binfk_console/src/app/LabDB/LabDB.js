
import { NavBar } from "@/components/NavBar";
import { DbNav } from "./components/DbNav";
import { PushComp } from './components/PushComp';
import styles from "./LabDB.module.css";

export function LabDB() {

  
    
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
