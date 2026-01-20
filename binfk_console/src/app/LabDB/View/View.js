import { NavBar } from "@/components/NavBar";
import { DbNav } from "../components/DbNav";
import { ViewComp } from './ViewComp';
import styles from '../LabDB.module.css'

export function View() {

  return (
    <>
      <div className={styles.container}>
        <NavBar />
        <DbNav />
        <ViewComp />
      </div>
    </>
  );
}
