"use client"

import styles from "./SopsView.module.css"
import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import axiosApi from "@/lib/api"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {Download, Share2, ClipboardCheck, Clock3, GitBranchPlus, ArchiveX } from "lucide-react";
import { ShareSop, AckSop, ExtendSop, RetireSop } from "../pipelines/components/SopAssistComp"
import { toastSet } from "@/components/toastfunc"
import { MessageComp } from '@/components/messageComp';


export function SopsViewComp() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SopsViewInner />
        </Suspense>
    )
}


function SopsViewInner() {
    const [allSops, setAllSops] = useState([])
    const [allSopPop, setAllSopPop] = useState([])

    const searchParams = useSearchParams()
    const sopid = searchParams.get("sopid")

    useEffect(() => {
        async function sopPopulate() {
            try {
                const response = await axiosApi.get("/sops/sopspopulate")
                const payload = response.data.payload || []

                setAllSops(payload)
                setAllSopPop(payload)

            } catch (err) {
                console.log(err)
            }
        }

        sopPopulate()
    }, [])

    return (
        <div className={styles.SopsView}>
            <div className={styles.SideBar}>
                <div className={styles.BtnWrap}>
                    <button onClick={() => setAllSopPop( allSops.filter( sop => sop.sopstatus === "APPROVED"))}>
                        Active SOP's
                    </button>
                </div>

                <div className={styles.BtnWrap}>
                    <button onClick={() => setAllSopPop( allSops.filter( sop => sop.sopstatus === "OBSOLETE"))} >
                        Obsolete SOP's
                    </button>
                </div>

                <div className={styles.BtnWrap}>
                    <button onClick={() => setAllSopPop( allSops.filter( sop => sop.sopstatus === "FOR_REVISION"))} >
                        For Revision
                    </button>
                </div>

                <div className={styles.BtnWrap}>
                    <button onClick={() => setAllSopPop(allSops.filter(sop => sop.sopstatus === "RETIRED"))}>
                        Retired SOP's
                    </button>
                </div>
            </div>

            {sopid ? <SopView sopid = {sopid}/> : <SopTable allSopPop={allSopPop}/>}

        </div>
    )
}

export function SopTable({ allSopPop }) {
    return (
        <div className={styles.MainCont}>
            <table className={styles.TableCont}>
                <thead>
                    <tr>
                        <th>SOP ID</th>
                        <th>Effective Date</th>
                        <th>Prepared By</th>
                        <th>Reviewed By</th>
                        <th>Approved By</th>
                        <th>Next Review Date</th>
                        <th>Department</th>
                        <th>Category</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {allSopPop.length === 0 ? (
                        <tr>
                            <td colSpan="9">
                                No SOPs Found
                            </td>
                        </tr>
                    ) : (
                        allSopPop.map((item, index) => (
                            <tr key={item.sopid || index}>
                                <td><Link href={`/SOPs/sops-view?sopid=${item.sopid}`} className={styles.sopidLink}>{item.sopnameversion}</Link></td>

                                <td>{item.sopeffectivedate ? new Date(item.sopeffectivedate).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                }): "-"}</td>

                                <td>{item.sopcreatedby || "-"}</td>

                                <td>{item.reviewer || "-"}</td>

                                <td>{item.approver || "-"}</td>

                                <td>{item.sopeffectivedate ? new Date(item.soprevisiondate).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                }): "-"}</td>

                                <td>{item.sopdepartment || "-"}</td>

                                <td>{item.sopcategory || "-"}</td>

                                <td>
                                    <button
                                        className={styles.SopOptions}
                                    >
                                        &#8964;
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}


export function SopView({sopid}){

    const[finsopData, setfinsopData] = useState(null)
    const router = useRouter()
    const[sopShareBox, setSopShareBox] = useState(false)
    const[ackno, setAckno] = useState(false)
    const[extnd, setExtnd] = useState(false)
    const[retire, setRetire] = useState(false)
    const[toast, setToast] = useState(null)


    useEffect(() => {


        async function pullfinalSOP() {

            try {

                const response = await axiosApi.get(`/sops/fetchsop/${sopid}`)
                setfinsopData(response.data.payload)

            } catch(err) {

                console.log(err)
            }
        }

        if (sopid) {
            pullfinalSOP()
        }

    }, [sopid])

    if (!finsopData) {
        return <div>Loading...</div>
    }

    async function sopDownload(sopId) {
        try{
            const response = await axiosApi.post("/sops/downloadsop",
                {sop_id : sopId}, {responseType : "blob"}
            )

            const blob = new Blob([response.data], {type : "application/pdf"})

            const url = window.URL.createObjectURL(blob)

            window.open(url, "_blank")

            setTimeout(() => {
                window.URL.revokeObjectURL(url)
            }, 1000) 

        }
        catch(error){
            toastSet(setToast, false, "Unable to process request")
            return
        }
    }

    return(



        <div className={styles.SopOpen}>

            <div className={styles.SopBanner}>
                <div className={styles.SopInfo}>
                    <h2>{finsopData.sopnameversion}</h2>

                    <div className={styles.SopMeta}>
                        <span className={styles.SopMetaTitle}>{finsopData.soptitle}</span>
                        <span className={styles.SopMetaStatus}>{finsopData.sopstatus}</span>
                        <span className={styles.SopMetaDesc}>{finsopData.sopdescription}</span>
                    </div>
                </div>

                <div className={styles.SopActions}>

                    {finsopData.sopstatus == "FOR_REVISION" && 
                    <button title="Extend this version" className={styles.PrimaryBtn} onClick={() => setExtnd(true)}><Clock3/></button>}
                    {finsopData.sopstatus == "FOR_REVISION" && 
                    <button title="Superseed this version and start a new version" className={styles.PrimaryBtn} onClick={() => setAckno(true)}><GitBranchPlus/></button>}
                    {finsopData.sopstatus == "FOR_REVISION" && 
                    <button title="Retire this SOP" className={styles.PrimaryBtn} onClick={() => setRetire(true)}><ArchiveX/></button>}

                    <button title="Achknowledge" className={styles.PrimaryBtn} onClick={() => setAckno(true)}><ClipboardCheck/></button>
                    <button title="Download SOP" className={styles.PrimaryBtn} onClick={() => sopDownload(finsopData.sopid)}><Download/></button>
                    <button title="Share SOP" className={styles.PrimaryBtn} onClick = {() => setSopShareBox(true)}><Share2/></button>

                    <button className={styles.CloseBtn} onClick={() => router.push("/SOPs/sops-view")}>✕</button>
                </div>
            </div>

            <div className={styles.SopViewIns}>

                <div className={styles.SopViewer}>
                    <div className={styles.a4Shell}>
                        <div className={styles.a4Page}>
                            <div className={`ck-content ${styles.content}`} dangerouslySetInnerHTML={{ __html: finsopData?.contenthtml || '' }}/>
                        </div>
                    </div>
                </div>


                <aside className={styles.SopDetailsPanel}>
                    <div className={styles.SopDetailsCard}>

                        <div className={styles.CardHeader}>
                            <h3>SOP Information</h3>
                        </div>

                        <div className={styles.InfoGrid}>

                            <div className={styles.Label}>SOP Name</div>
                            <div className={styles.Value}>{finsopData.sopname}</div>

                            <div className={styles.Label}>SOP Title</div>
                            <div className={styles.Value}>{finsopData.soptitle}</div>

                            <div className={styles.Label}>Version</div>
                            <div className={styles.Value}>V{finsopData.sopversion}</div>

                            <div className={styles.Label}>Category</div>
                            <div className={styles.Value}>{finsopData.sopcategory}</div>

                            <div className={styles.Label}>Department</div>
                            <div className={styles.Value}>{finsopData.sopdepartment}</div>

                            <div className={styles.Label}>Effective Date</div>
                            <div className={styles.Value}>
                                {new Date(finsopData.sopeffectivedate).toLocaleDateString()}
                            </div>

                            <div className={styles.Label}>Revision Date</div>
                            <div className={styles.Value}>
                                {new Date(finsopData.soprevisiondate).toLocaleDateString()}
                            </div>

                            <div className={styles.Label}>Created By</div>
                            <div className={styles.Value}>{finsopData.sopcreatedby}</div>

                            <div className={styles.Label}>Created On</div>
                            <div className={styles.Value}>
                                {new Date(finsopData.sopcreatedat).toLocaleString("en-IN", {day: "2-digit", month: "short", year: "numeric"})}
                            </div>

                            <div className={styles.Label}>Reviewed By</div>
                            <div className={styles.Value}>{finsopData.reviewedby || "-"}</div>

                            <div className={styles.Label}>Reviewed On</div>
                            <div className={styles.Value}>
                                {finsopData.reviewedat
                                    ? new Date(finsopData.reviewedat).toLocaleString("en-IN", {day: "2-digit", month: "short", year: "numeric"})
                                    : "-"}
                            </div>

                            <div className={styles.Label}>Approved By</div>
                            <div className={styles.Value}>{finsopData.approvedby || "-"}</div>

                            <div className={styles.Label}>Approved On</div>
                            <div className={styles.Value}>
                                {finsopData.approvedat
                                    ? new Date(finsopData.approvedat).toLocaleString("en-IN", {day: "2-digit", month: "short", year: "numeric"})
                                    : "-"}
                            </div>

                            <div className={styles.Label}>Last Updated By</div>
                            <div className={styles.Value}>{finsopData.sopupdatedby}</div>

                            <div className={styles.Label}>Last Updated</div>
                            <div className={styles.Value}>
                                {new Date(finsopData.sopupdatedat).toLocaleString("en-IN", {day: "2-digit", month: "short", year: "numeric"})}
                            </div>
                        </div>

                    </div>
                </aside>
                {sopShareBox && <ShareSop sopId = {finsopData.sopid} setSopShareBox = {setSopShareBox}/>}
                {ackno && <AckSop sopId = {finsopData.sopid} setAckno={setAckno}/>}
                {extnd && <ExtendSop sopId = {finsopData.sopid} setExtnd={setExtnd}/>}
                {retire && <RetireSop sopId = {finsopData.sopid} setExtnd={setRetire}/>}
                {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </div> 
    )
}

