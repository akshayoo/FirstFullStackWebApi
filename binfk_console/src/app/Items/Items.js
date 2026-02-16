import { NavBar} from "@/components/NavBar";
import { ItemsNav } from "./components/ItemsNav";
import { ItemsComp } from "./itemsComp";

export function Items(){
    return(
        <>
            <NavBar />
            <ItemsNav />
            <ItemsComp />
        </>
    );
}