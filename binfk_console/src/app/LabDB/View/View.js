import { NavBar } from "@/components/NavBar";
import { DbNav } from "../components/DbNav";
import { ViewComp } from './ViewComp';

export function View() {

  return (
    <>
      <NavBar />

      <DbNav />

      <ViewComp />

    </>
  );
}