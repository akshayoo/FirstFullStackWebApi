import styles from './ViewComp.module.css'


export function ViewComp(){

    return(

        <div className={styles.View}>
            <div className={styles.ViewSideBar} >
                <SerachById />
                <h2>Recent Entries</h2>
                <RecentEntries />
            </div>
            <div className= {styles.ViewWin}>
                <ViewWelcome />
            </div>
        
        </div>
    );
}

function SerachById() {
    return (
        <div className={styles.SidebarSrch}>
            <h2>Search</h2>
            <input type="text" id="updateprojectId" name="project_id" placeholder='project Id' required />
        </div>
    );
}


function RecentEntries(){
    return(
        <div className= {styles.SidebarProp}>
            <button />
            <button />
            <button />
            <button />
            <button />
            <button />
            <button />
            <button />
            <button />
            <button />
            <button />
            <button />
            <button />
            <button />
            <button />
        </div>
    );
}


function ViewWelcome() {
    return(
        <div>
            <div>
                This is the window page
            </div>
            <div>
                Search for changing
            </div>
        </div>
    )
}


