import { NavBar } from "@/components/NavBar";
import { DbNav } from "../components/DbNav";
import { PushComp } from './PushComp';
import styles from '../LabDB.module.css'

export function Push() {

  
    
  return (
    <div className={styles.container}>
      <NavBar />
      <DbNav />
      <PushComp />
    </div>
  );
}