import { NavBar } from "@/components/NavBar";
import { DbNav } from "../components/DbNav";
import { ViewComp } from './ViewComp';
import styles from "../LabDB.module.css";

export function View() {

  return (
    <>
      <NavBar />
      <div className={styles.InitialDiv}>
        <DbNav />
      </div>
      <div className={styles.InitialComp}>
        <ViewComp />
      </div>
    </>
  );
}