'use client'

import styles from './PipeLines.module.css'
import { NewSop, SopView } from './components/SopComp';
import { useState, useEffect, Suspense } from 'react';
import axiosApi from '@/lib/api';
import { MessageComp } from '@/components/messageComp';
import Link from 'next/link';
import { useSearchParams } from "next/navigation"

export function PipeLineComp(){

    const[newSop, setNewSop] = useState(false)
    const[activeTab, setActiveTab] = useState("pipe")
    const [pipesopData, setPipesopData] = useState(null)

    return(
        <div className={styles.PipelineView}>
            <div className={styles.TopBar}>
                <div className={styles.BtnWrapAdd}>
                    <button onClick={()=>setNewSop(true)}>+ New</button>
                </div>
                <div className={styles.BtnWrap}>
                    <button className={activeTab === "pipe" ? styles.active : ""} onClick={() => setActiveTab("pipe")}>Pipe</button>
                </div>
                <div className={styles.BtnWrap}>
                    <button className={activeTab === "review" ? styles.active : ""} onClick={() => setActiveTab("review")}>Review</button>
                </div>
                <div className={styles.BtnWrap}>
                    <button className={activeTab === "approval" ? styles.active : ""} onClick={() => setActiveTab("approval")}>Approvals</button>
                </div>
            </div>
            <div className={styles.MainCont}>
                {activeTab === "pipe" && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <SetPipe setPipesopData={setPipesopData} setActiveTab={setActiveTab} />
                    </Suspense>
                )}
                {activeTab === "review" && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <ReviewCont setPipesopData={setPipesopData} setActiveTab={setActiveTab} />
                    </Suspense>
                )}
                {activeTab === "approval" && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <ForApproval setPipesopData={setPipesopData} setActiveTab={setActiveTab} />
                    </Suspense>
                )}
                {activeTab === "sopdata" && <SopView pipesopData={pipesopData} setActiveTab={setActiveTab} activeTab={activeTab}/>}
                {newSop && <NewSop setNewSop={setNewSop}/>}
            </div>
        </div>
    )
}

export function SetPipe({setPipesopData, setActiveTab}){
    
    const[toast, setToast] = useState(null)
    const [pipeCont, setPipeCont] = useState({
        drafts: [],
        under_review: [],
        for_approval: [],
        for_redraft: [],
        for_revision: [],
        retired: []
    })

    const searchParams = useSearchParams()
    const sopid = searchParams.get("id")
    const versionname = searchParams.get("snv")

    useEffect(() => {
        async function getSopPipe(){

            try{
                const response = await axiosApi.get("/sops/pipesops")
                const data = response.data

                setPipeCont({
                    drafts: data.payload.drafts       ?? [],
                    under_review: data.payload.under_review ?? [],
                    for_approval: data.payload.for_approval ?? [],
                    for_redraft : data.payload.for_redraft ?? [],
                    for_revision: data.payload.for_revision ?? [],
                    retired: data.payload.retired      ?? [],
                    approved: data.payload.approved     ?? []
                })
            }

            catch(err){
                console.log(err)
            }
        }

        getSopPipe()
    },[])


    useEffect(() => {

        if (!sopid || !versionname) return;

        async function getSopData() {


            try {

                const response = await axiosApi.get(`/sops/pipesopview/${sopid}/${versionname}`);
                const data = response.data;

                setPipesopData(data.payload)
                setActiveTab("sopdata")

            } catch (err) {
                console.log(err)
            }
        }

        getSopData();

    }, [sopid, versionname])




    return(
        <>
            <div className={styles.KanBanBoard}>
                <div className={styles.KanbanCell}>
                    <div className={styles.KanBanHeadDr}>
                        <div>Drafts</div>
                     
                     
                      </div>
                    <div className={styles.KanBanCardsComp}>
                        {pipeCont.drafts.map((sopdrafts) => (
                            <div className={styles.KanbanCard} key={sopdrafts.sopid}>
                                <div>
                                    <Link className={styles.KanbanCardLink} href={`/SOPs/pipelines?id=${sopdrafts.sopid}&snv=${encodeURIComponent(sopdrafts.sopnameversion)}`}>{sopdrafts.sopnameversion}</Link>
                                </div>
                                <div>Sop status: {sopdrafts.sopstatus}</div>
                                <div>SOP version: {sopdrafts.sopversion}</div>
                                <div>Created on: {new Date(sopdrafts.sopcreatedat).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.KanbanCell}>
                    <div className={styles.KanBanHeadRev}>
                        <div>Under review</div>
                    </div>
                    <div className={styles.KanBanCardsComp}>
                        {pipeCont.under_review.map((soprev) => (
                            <div className={styles.KanbanCard} key={soprev.sopid}>
                                <div>
                                    <Link className={styles.KanbanCardLink} href={`/SOPs/pipelines?id=${soprev.sopid}&snv=${encodeURIComponent(soprev.sopnameversion)}`}>{soprev.sopnameversion}</Link>
                                </div>
                                <div>Sop status: {soprev.sopstatus}</div>
                                <div>SOP version: {soprev.sopversion}</div>
                                <div>Created on: {soprev.sopcreatedat}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.KanbanCell}>
                    <div className={styles.KanBanHeadApp}>
                        <div>Under approval</div>
                    </div>
                    <div className={styles.KanBanCardsComp}>
                        {pipeCont.for_approval.map((sopapp) => (
                            <div className={styles.KanbanCard} key={sopapp.sopid}>
                                <div>
                                    <Link className={styles.KanbanCardLink} href={`/SOPs/pipelines?id=${sopapp.sopid}&snv=${encodeURIComponent(sopapp.sopnameversion)}`}>{sopapp.sopnameversion}</Link>
                                </div>
                                <div>Sop status: {sopapp.sopstatus}</div>
                                <div>SOP version: {sopapp.sopversion}</div>
                                <div>Created on: {sopapp.sopcreatedat}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.KanbanCell}>
                    <div className={styles.KanBanHeadCnc}>
                        <div>Sent back to Re-draft</div>
                    </div>
                    <div className={styles.KanBanCardsComp}>
                        {pipeCont.for_redraft.map((sopret) => (
                            <div className={styles.KanbanCard} key={sopret.sopid}>
                                <div>
                                    <Link className={styles.KanbanCardLink} href={`/SOPs/pipelines?id=${sopret.sopid}&snv=${encodeURIComponent(sopret.sopnameversion)}`}>{sopret.sopnameversion}</Link>
                                </div>
                                <div>Sop status: {sopret.sopstatus}</div>
                                <div>SOP version: {sopret.sopversion}</div>
                                <div>Created on: {sopret.sopcreatedat}</div>
                            </div>
                        ))}
                    </div>
                </div>
                {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </>
    );
}


export function ReviewCont({setPipesopData, setActiveTab}){

    const[toReview, setToReview] = useState([])
    const searchParams = useSearchParams()
    const sopid = searchParams.get("id")
    const versionname = searchParams.get("snv")

    useEffect(()=> {

        async function tobeReviewed(){
            try{
                const response = await axiosApi.get("/sops/toreview")
                const data = response.data

                setToReview(data.payload)
            }

            catch(err){
                console.log(err)
            }
        }

        tobeReviewed()
    }, [])

    useEffect(() => {

        if (!sopid || !versionname) return;

        async function getSopData() {


            try {

                const response = await axiosApi.get(`/sops/pipesopview/${sopid}/${versionname}`);
                const data = response.data;

                setPipesopData(data.payload);
                setActiveTab("sopdata");

            } catch (err) {
                console.log(err);
            }
        }

        getSopData();

    }, [sopid, versionname])


    return(
        <>
            {
                toReview.map((item) => (
                    <div className={styles.CardCont} key={item.review.reviewid}>
                        <div className={styles.CardHead}>
                            <Link href={`/SOPs/pipelines?id=${item.version.sopid}&snv=${encodeURIComponent(item.version.sopnameversion)}`}>{item.version.sopnameversion}</Link>
                            <button onClick={() => getSopData(item.version.sopid, item.version.sopnameversion)}>Take Action</button>
                        </div>
                        <div className={styles.CardSub} >Created on: {new Date(item.version.sopcreatedat).toLocaleString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric"
                            })}</div>
                        <div className={styles.CardSub} >Prepared by: {item.version.sopcreatedby}</div>
                        <div className={styles.CardFooter}>
                            <div>Reviewer : {item.review.reviewer}</div>
                            <span>{item.review.reviewtype == "TRIGGERED" ? `FOR REVIEW` : `NOT SCHEDULED`}</span>
                        </div>
                    </div>   
                ))
            }
        </>
    )
}

export function ForApproval({setPipesopData, setActiveTab}){


    const[toApprove, setToApprove] = useState([])
    const searchParams = useSearchParams()
    const sopid = searchParams.get("id")
    const versionname = searchParams.get("snv")

    useEffect(()=> {

        async function tobeApproved(){
            try{
                const response = await axiosApi.get("/sops/toapprove")
                const data = response.data

                setToApprove(data.payload)
            }

            catch(err){
                console.log(err)
            }
        }

        tobeApproved()
    }, [])

    useEffect(() => {

        if (!sopid || !versionname) return;

        async function getSopData() {


            try {

                const response = await axiosApi.get(`/sops/pipesopview/${sopid}/${versionname}`);
                const data = response.data;

                setPipesopData(data.payload);
                setActiveTab("sopdata");

            } catch (err) {
                console.log(err);
            }
        }

        getSopData();

    }, [sopid, versionname])

    return(
        <>
            {
                toApprove.map((item) => (
                    <div className={styles.CardCont} key={item.review.reviewid}>
                        <div className={styles.CardHead}>
                            <Link href={`/SOPs/pipelines?id=${item.version.sopid}&snv=${encodeURIComponent(item.version.sopnameversion)}`}>{item.version.sopnameversion}</Link>
                            <button onClick={() => getSopData(item.version.sopid, item.version.sopnameversion)}>Take Action</button>
                        </div>
                        <div className={styles.CardSub} >Prepared by: {item.version.sopcreatedby}</div>
                        <div className={styles.CardSub} >Reviewed by: {item.review.reviewedby}</div>
                        <div className={styles.CardFooter}>
                        <div className={styles.CardSub} >Reviewed on: {new Date(item.review.reviewedat).toLocaleString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric"
                            })}</div>
                            <span>{item.review.approvetype == "TRIGGERED" ? `TO APPROVE` : `NOT SCHEDULED`}</span>
                        </div>
                    </div>   
                ))
            }
        </>
    )
}



