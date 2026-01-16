import { NavBar } from "@/components/NavBar";
import { DbNav } from "../components/DbNav";
import { UpdateComp } from './UpdateComp';
import styles from "../LabDB.module.css";

export function Update() {

  return (
    <>
      <NavBar />
      <div className={styles.InitialDiv}>
        <DbNav />
      </div>
      <div className={styles.InitialComp}>
        <UpdateComp />
      </div>
    </>
  );
}