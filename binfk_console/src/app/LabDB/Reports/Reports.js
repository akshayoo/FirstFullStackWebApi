import { NavBar } from "@/components/NavBar";
import { DbNav } from "../components/DbNav";
import { ReportsComp } from './ReportsComp';
import styles from "../LabDB.module.css";

export function Reports() {

  return (
    <>
      <NavBar />
      <div className={styles.InitialDiv}>
        <DbNav />
      </div>
      <div className={styles.InitialComp}>
        <ReportsComp />
      </div>
    </>
  );
}