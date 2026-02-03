import styles from './Catalog.module.css'
import Image from 'next/image';



export function CatalogComp(){
    return(
        <div className={styles.CatalogMainWin}>
            <SideBar />
            <MainWin />
        </div>
    );
}


function SideBar() {
    return(
        <>
        
            <div className={styles.sideBar}>
                <div className={styles.sideBarIn}>
                    <div>Bulk Transcriptomics</div>
                    <button><Image className={styles.PushImage} src="/down.png" alt="push-down" width={120} height={60}/></button>
                </div> 
                <SideBarComps />
                <div className={styles.sideBarIn}>
                    <div>Metagenomics and Applied Genomics</div>
                    <button><Image className={styles.PushImage} src="/down.png" alt="push-down" width={120} height={60}/></button>
                </div>
                <SideBarComps />
                <div className={styles.sideBarIn}>
                    <div>Human Genetics</div>
                    <button><Image className={styles.PushImage} src="/down.png" alt="push-down" width={120} height={60}/></button>
                </div>
                <SideBarComps />
                <div className={styles.sideBarIn}>
                    <div>Targeted Panels</div>
                    <button><Image className={styles.PushImage} src="/down.png" alt="push-down" width={120} height={60}/></button>
                </div>
                <SideBarComps />
                <div className={styles.sideBarIn}>
                    <div>Applied</div>
                    <button><Image className={styles.PushImage} src="/down.png" alt="push-down" width={120} height={60}/></button>
                </div>
                <SideBarComps />
                <div className={styles.sideBarIn}>
                    <div>Human DNA</div>
                    <button><Image className={styles.PushImage} src="/down.png" alt="push-down" width={120} height={60}/></button>
                </div>
                <SideBarComps />
                <div className={styles.sideBarIn}>
                    <div>Custom Services</div>
                    <button><Image className={styles.PushImage} src="/down.png" alt="push-down" width={120} height={60}/></button>
                </div>
                <SideBarComps />

            </div>
        
        </>
    )
}

function SideBarComps() {
    return(
        <>
            <button className={styles.InComp}>hebdwjbfhjwbfhewh</button>
            <button className={styles.InComp}>egfuhghfueggfehugr</button>
            <button className={styles.InComp}>ehrfbhefueghfberhfberhu</button>
            <button className={styles.InComp}>hefruyehrjebruyegh</button>
            <button className={styles.InComp}>ekdfbebfrnhuegfueghfuge</button>
            <button className={styles.InComp}>hebdwjbfhjwbfhewh</button>
            <button className={styles.InComp}>egfuhghfueggfehugr</button>
            <button className={styles.InComp}>ehrfbhefueghfberhfberhu</button>
            <button className={styles.InComp}>hefruyehrjebruyegh</button>
            <button className={styles.InComp}>ekdfbebfrnhuegfueghfuge</button>
            <button className={styles.InComp}>hebdwjbfhjwbfhewh</button>
            <button className={styles.InComp}>egfuhghfueggfehugr</button>
            <button className={styles.InComp}>ehrfbhefueghfberhfberhu</button>
            <button className={styles.InComp}>hefruyehrjebruyegh</button>
            <button className={styles.InComp}>ekdfbebfrnhuegfueghfuge</button>
            <button className={styles.InComp}>hebdwjbfhjwbfhewh</button>
            <button className={styles.InComp}>egfuhghfueggfehugr</button>
            <button className={styles.InComp}>ehrfbhefueghfberhfberhu</button>
            <button className={styles.InComp}>hefruyehrjebruyegh</button>
            <button className={styles.InComp}>ekdfbebfrnhuegfueghfuge</button>
        </>
    );
}


function MainWin() {
    return(
        <>
            <div className={styles.MainWin}>
                <div className={styles.MainSub}>
                    <div className={styles.ItemInitial}>
                        <div>Item Title</div>
                        <div>Catlogue numbers</div>
                    </div>
                    <div className={styles.ItemAppl}>
                        <div>Application</div>
                        <div>gwedwuguywghuew gfheug huegfuehwjb beihfbheifbhiefh iefbhiebfiegfheibfheigfuhebfhuegfeuhugfhjebfhgjvfhgevfhge  v fuev uegv uveu vfuegv ueg uevuegv uegvfuhegfbheu gfeuhgfehjfgeuygfehufe gfeuhbehjfvbehjgfhejfbhejrgfjhevfgfvhejvfegh</div>
                    </div>
                    <div className={styles.ItemPrNo}>
                        <div>
                            <div>Pros</div>
                            <ul>
                                <li>ehrfierfefehgfhjergfheg</li>
                                <li>ehrfierfefehgfhjergfheg</li>
                                <li>ehrfierfefehgfhjergfheg</li>
                                <li>ehrfierfefehgfhjergfheg</li>
                                <li>ehrfierfefehgfhjergfheg</li>
                            </ul>
                        </div>
                        <div>
                            <div>Notes</div>
                            <ul>
                                <li>ehrfierfefehgfhjergfheg</li>
                                <li>ehrfierfefehgfhjergfheg</li>
                                <li>ehrfierfefehgfhjergfheg</li>
                                <li>ehrfierfefehgfhjergfheg</li>
                                <li>ehrfierfefehgfhjergfheg</li>
                            </ul>
                        </div>
                        <div className={styles.ItemSamp}>
                            <div>
                                <div>Sample Input</div>
                                <div>hwuegdhwgbewhvwhhjwwhjwjhvewvfevfejvfjhevfevfevjveb</div>
                            </div>
                            <div>
                                <div>Sample Types</div>
                                <ul>
                                    <li>ehrfierfefehgfhjergfheg</li>
                                    <li>ehrfierfefehgfhjergfheg</li>
                                    <li>ehrfierfefehgfhjergfheg</li>
                                    <li>ehrfierfefehgfhjergfheg</li>
                                    <li>ehrfierfefehgfhjergfheg</li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.ItemProcess}>
                            <div>Process map</div>
                            <div>
                                <div>ewvdwuyegfeg</div>
                                <div>ewvdwuyegfeg</div>
                                <div>ewvdwuyegfeg</div>
                                <div>ewvdwuyegfeg</div>
                                <div>ewvdwuyegfeg</div>
                                <div>ewvdwuyegfeg</div>
                                <div>ewvdwuyegfeg</div>
                            </div>
                        </div>
                        <div className={styles.ItemAppl}>
                            <div>Standard Deliverables</div>
                            <div>
                                <ul>
                                    <li>wgfuygweeugfegfvgevfghervfgefhejfbhuegfhjerbfhegfhefhjegfhehfervfegvfhevef</li>
                                    <li>wgfuygweeugfegfvgevfghervfgefhejfbhuegfhjerbfhegfhefhjegfhehfervfegvfhevef</li>
                                    <li>wgfuygweeugfegfvgevfghervfgefhejfbhuegfhjerbfhegfhefhjegfhehfervfegvfhevef</li>
                                    <li>wgfuygweeugfegfvgevfghervfgefhejfbhuegfhjerbfhegfhefhjegfhehfervfegvfhevef</li>
                                    <li>wgfuygweeugfegfvgevfghervfgefhejfbhuegfhjerbfhegfhefhjegfhehfervfegvfhevef</li>
                                    <li>wgfuygweeugfegfvgevfghervfgefhejfbhuegfhjerbfhegfhefhjegfhehfervfegvfhevef</li>
                                    <li>wgfuygweeugfegfvgevfghervfgefhejfbhuegfhjerbfhegfhefhjegfhehfervfegvfhevef</li>
                                    <li>wgfuygweeugfegfvgevfghervfgefhejfbhuegfhjerbfhegfhefhjegfhehfervfegvfhevef</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )
}