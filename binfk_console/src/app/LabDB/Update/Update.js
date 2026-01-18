import { NavBar } from "@/components/NavBar";
import { DbNav } from "../components/DbNav";
import { UpdateComp } from './UpdateComp';
import styles from '../LabDB.module.css'

export function Update() {

  return (
    <>
      <div className={styles.container}>
        <NavBar />
        <DbNav />
        <UpdateComp />
      </div>
    </>
  );
}