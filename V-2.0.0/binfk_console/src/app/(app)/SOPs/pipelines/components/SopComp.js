import sopstyles from './SopNew.module.css'
import axiosApi from '@/lib/api';
import { CommentForm } from './SopAssistComp';
import { useState, useEffect, useRef } from 'react';
import { MessageComp } from '@/components/messageComp';
import { toastSet } from '@/components/toastfunc';
import { useRouter } from 'next/navigation';
import { Users, SquarePen, Trash2 } from "lucide-react";
import { ChangeOwner, DeleteSop, EditMetaData } from './SopAssistComp';
import mammoth from "mammoth";




export function NewSop({setNewSop}){

    const[toast, setToast] = useState(null)
    const [users, setUsers] = useState([])

    const [formData, setFormData] = useState({
        sop_id : "",
        sop_title : "",
        sop_desc : "",
        sop_category : "",
        sop_dept : "",
        sop_rev_period : "",
        sop_reviewer : "",
    })

    useEffect(() =>{
        async function getsopUsers(){

            try{
                const response = await axiosApi.get("sops/sopsusers")

                if(!response.data.status){
                    console.log(response.data.message)
                }

                setUsers(response.data.payload)
            }

            catch(err){
                console.log(err)
            }
        }

        getsopUsers()
    },[])

    const handleChange = (e) =>{
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    async function startDraftSop(){


        if(!formData.sop_id || !formData.sop_title || !formData.sop_desc || !formData.sop_category || 
            !formData.sop_dept || !formData.sop_rev_period || !formData.sop_reviewer 
        ){
            toastSet(setToast, false, "Missing fields")
            return
        }

        try{
            const response = await axiosApi.post("/sops/startdraft", formData)
            const data = response.data
            
            if(!data.status){
                toastSet(setToast, data.status, data.message)
                return
            }

            toastSet(setToast, data.status, data.message)
            setTimeout(() => setNewSop(false), 2000)
            return
        }
        catch(error){
            console.error(error)
            toastSet(setToast, false, "Submission failed")   
            return
        }
    }

    return(
        <>
            <div className={sopstyles.NewSopComp}>
                <button className={sopstyles.CloseBtn} onClick={()=>setNewSop(false)}>X</button>
                <div className={sopstyles.SopForm}>
                    <div className={sopstyles.SopFormDiv}>
                        <label>Sop ID *</label>
                        <input name='sop_id' value={formData.sop_id} type='text' onChange={handleChange} />
                        <label>Sop Title *</label>
                        <input  name='sop_title' value={formData.sop_version} type='text' onChange={handleChange}/>
                        <label>Sop Description *</label>
                        <textarea name='sop_desc' value={formData.sop_desc} type='text' cols={10} rows={5} onChange={handleChange}/>
                        <div className={sopstyles.SopFormIn}>
                            <label>SOP Category *</label>
                            <input name='sop_category' value={formData.sop_category} type='text' onChange={handleChange} />
                            <label>SOP Department *</label>
                            <select name='sop_dept' value={formData.sop_dept} type='text' onChange={handleChange}>
                                <option value="" disabled>Select Options</option>
                                <option value="Lab">Lab</option>
                                <option value="Analysis">Analysis</option>
                                <option value="Business development">Business development</option>
                                <option value="Management">Management</option>
                                <option value="Others">Others</option>
                            </select>  
                            <label>Revision period in months *</label>
                            <input name='sop_rev_period' value={formData.sop_rev_period} type='number' onChange={handleChange}/>     
                        </div>
                        <label>Add reviewer *</label>
                        <select name='sop_reviewer' value={formData.sop_reviewer} onChange={handleChange}>
                            <option value="" disabled>select</option>
                            {
                                users.map(user =>(
                                    <option value={user.useremployeeid} key={user.useremployeeid}>{user.username}</option>
                                ))
                            }
                        </select>
                    </div>
                    <button onClick={() => startDraftSop()}>Add draft</button>
                </div>
                {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </>
    )
}


export function SopView({ pipesopData, setActiveTab }) {

    const router = useRouter()
    const [sopOptions, setSopOptions] = useState(null)

    if (!pipesopData) {
        return <div>Loading...</div>
    }
 
    return (
        <>
            <div className={sopstyles.SopContView}>
                <div className={sopstyles.SopHeader}>
                    <div className={sopstyles.SopHeaderTitle}> {pipesopData.sopnameversion}
                        <span className={`${sopstyles.SopBadge} ${sopstyles.SopBadgeGreen}`}>{pipesopData.sopstatus}</span>
                    </div>
                    <div className={sopstyles.SopHeaderBtns}>
                        <button title="Change Owner" onClick={() => setSopOptions("changeOwner")}><Users /></button>
                        <button title="Edit SOP Metadata" onClick={() => setSopOptions("editMeta")}><SquarePen /></button>
                        <button title="Delete SOP" onClick={() => setSopOptions("deleteSop")}><Trash2/> </button>
                        <button onClick={() => {router.replace("/SOPs/pipelines");setActiveTab("pipe");}} className={sopstyles.SopClose} aria-label="Close">✕</button>
                    </div>
                    {sopOptions === "changeOwner" ? <ChangeOwner setSopOptions = {setSopOptions} sopId = {pipesopData.sopid} 
                    sopNameVer = {pipesopData.sopnameversion}/> : 
                    sopOptions === "editMeta" ? <EditMetaData setSopOptions = {setSopOptions} sopId = {pipesopData.sopid} sopNameVer = {pipesopData.sopnameversion}/> : 
                    sopOptions === "deleteSop" ? <DeleteSop setSopOptions = {setSopOptions} sopId = {pipesopData.sopid} 
                    sopNameVer = {pipesopData.sopnameversion} sopVer = {pipesopData.sopversion}/> : ``}
                </div>
                <div className={sopstyles.SopContDw}>
                    <div className={sopstyles.SopContSide}>

                        <div className={sopstyles.SopPanel}>
                            <div className={sopstyles.SopPanelLabel}>Details</div>
                            <div className={sopstyles.SopDetails}>
                                <div>
                                    <div>SOP name</div><div>{pipesopData.sopname}</div>
                                </div>
                                <div>
                                    <div>Version</div><div>V{pipesopData.sopversion}</div>
                                </div>
                                <div>
                                    <div>Status</div><div><span className={`${sopstyles.SopPill} ${sopstyles.SopPillBlue}`}>{pipesopData.sopstatus}</span></div>
                                </div>
                                <div>
                                    <div>Category</div><div>{pipesopData.sopcategory}</div>
                                </div>
                                <div>
                                    <div>Department</div><div>{pipesopData.sopdepartment}</div>
                                </div>
                                <div>
                                    <div>Created by</div><div>{pipesopData.sopcreatedby}</div>
                                </div>
                                <div>
                                    <div>
                                        Created at</div><div>{new Date(pipesopData.sopcreatedat).toLocaleString("en-IN", {
                                        day: "2-digit", month: "short", year: "numeric"
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <div className={sopstyles.SopPanel}>
                            <div className={sopstyles.SopPanelLabel}>Review &amp; Approval</div>
                            <div className={sopstyles.SopRevAppr}>
                                <div>
                                    <div>Review status</div><div><span className={`${sopstyles.SopPill} ${sopstyles.SopPillGreen}`}>{
                                    pipesopData.reviewoutcome ? pipesopData.reviewoutcome : `NOT REVIEWED`}</span>
                                    </div>
                                </div>
                                <div>
                                    <div>Reviewer</div><div>{pipesopData.reviewedby ? pipesopData.reviewedby : `--`}</div>
                                </div>
                                <div>
                                    <div>
                                        Reviewed on</div><div>{pipesopData.reviewedat ? new Date(pipesopData.reviewedat).toLocaleString("en-IN", {
                                        day: "2-digit", month: "short", year: "numeric"
                                        }) : `--`}
                                    </div>
                                </div>
                                <div>
                                    <div>Approve status</div><div><span className={`${sopstyles.SopPill} ${sopstyles.SopPillGreen}`}>
                                        {pipesopData.approveoutcome ? pipesopData.approveoutcome : `NOT APPROVED`
                                        }</span>
                                    </div>
                                </div>
                                <div>
                                    <div>Approver</div><div>{pipesopData.approvedby ? pipesopData.approvedby : `--`}</div>
                                </div>
                                <div>
                                    <div>Approved on</div><div>{pipesopData.approvedat ? new Date(pipesopData.approvedat).toLocaleString("en-IN",
                                        {day: "2-digit", month: "short", year: "numeric"}
                                    ) : `--`}</div>
                                </div>
                            </div>
                        </div>

                        {pipesopData.sopstatus !== "DRAFT" && pipesopData.sopstatus !== "RE-DRAFT" && (<SopButtons pipesopData={pipesopData} />
)}
                        {pipesopData.sopstatus === "RE-DRAFT" ? <SopComments pipesopData = {pipesopData}/> : ``}
                
                    </div>
                
                    <div className={sopstyles.SopContMain}>
                        <div className={sopstyles.SopMainTitle}>{pipesopData.soptitle}</div>
                        <div className={sopstyles.SopMainMeta}>{pipesopData.sopdescription}</div>
                        {pipesopData.sopstatus === "DRAFT" || pipesopData.sopstatus === "RE-DRAFT" ? (<SopWrite pipesopData={pipesopData} />) : 
                        (<SopContentView pipesopData={pipesopData} />)}
                    </div>
                
                </div>
            </div>
        </>
    )
}



export function SopWrite({ pipesopData }) {
    const contentHtml = pipesopData?.contenthtml;
    const [toast, setToast] = useState(null);
    const [wordCount, setWordCount] = useState(0);
    const [isConverting, setIsConverting] = useState(false);
    const editorRef = useRef(null);
    const instanceRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        async function loadEditor() {
            if (instanceRef.current) return

            const ClassicEditor = (await import("@ckeditor/ckeditor5-build-classic")).default
            if (cancelled || !editorRef.current) return

            instanceRef.current = await ClassicEditor.create(editorRef.current, {
                placeholder: "Paste or write your SOP content here...",
                htmlSupport: {
                    allow: [
                        { name: /.*/, attributes: true, classes: true, styles: true }
                    ]
                }
            });

            if (cancelled) {
                instanceRef.current.destroy()
                instanceRef.current = null
                return
            }

            instanceRef.current.model.document.on("change:data", () => {
                const text = instanceRef.current
                .getData()
                .replace(/<[^>]*>/g, "")
                .trim()
                .split(/\s+/)
                .filter(Boolean);
                setWordCount(text.length);
            })

            if (contentHtml) {
                instanceRef.current.setData(contentHtml);
            }
        }
        loadEditor()
        return () => {
            cancelled = true;
            if (instanceRef.current) {
                instanceRef.current.destroy();
                instanceRef.current = null;
            }
        }
    }, [])

    const isMounted = useRef(false)

    useEffect(() => {
        if (!isMounted.current) { isMounted.current = true; return; }

        if (instanceRef.current && contentHtml) {
            instanceRef.current.setData(contentHtml);
        }
    }, [contentHtml])

    async function handleDocxUpload(e) {
        const file = e.target.files?.[0];
        if (!file || !file.name.endsWith(".docx")) return;

        setIsConverting(true);
        try {
            const arrayBuffer = await file.arrayBuffer();

            const result = await mammoth.convertToHtml(
                { arrayBuffer },
                {
                    styleMap: [
                        "p[style-name='Code'] => pre > code",
                        "p[style-name='Code Block'] => pre > code",
                        "r[style-name='Code'] => code",
                        "table => table.sop-table",
                    ],
                    convertImage: mammoth.images.imgElement(async (image) => {
                        const base64 = await image.read("base64");
                        return {
                            src: `data:${image.contentType};base64,${base64}`,
                        };
                    }),
                }
            )

            if (instanceRef.current) {
                instanceRef.current.setData(result.value);
            }

            if (result.messages.length > 0) {
                console.warn("Mammoth conversion warnings:", result.messages);
            }

            toastSet(setToast, true, "Document imported successfully");
        } 

        catch (err) {
            console.error("DOCX conversion error:", err);
            toastSet(setToast, false, "Failed to import document. Please try again.");
        }

        finally {
            setIsConverting(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    async function handleSave(purpose) {
        const saveData = {
            process: purpose,
            sop_id: pipesopData.sopid,
            sop_contentid: pipesopData.contentid,
            sop_nameversion: pipesopData.sopnameversion,
            sop_content: instanceRef.current.getData(),
        }
        try {
            const response = await axiosApi.post("/sops/savecontent", saveData);
            const data = response.data;
            toastSet(setToast, data.status, data.message)

        } catch (err) {
            toastSet(setToast, false, "Unable to save the content. Please try again.");
        }
    }

  return (
    <div className={sopstyles.EditorCard}>
        <div className={sopstyles.EditorHeader}>
            <p>SOP Editor: Paste from Word, upload a .docx, or start the document</p>
        </div>

        <div className={sopstyles.ImportBar}>
            <input ref={fileInputRef} type="file" accept=".docx" style={{ display: "none" }} onChange={handleDocxUpload}/>
            <button className={sopstyles.BtnImport} onClick={() => fileInputRef.current?.click()} disabled={isConverting}>
                {isConverting ? "Importing..." : "📄 Import .docx"}
            </button>
            <span className={sopstyles.ImportHint}> Preserves tables, headings, images & formatting </span>
        </div>

        <div ref={editorRef} className={sopstyles.EditorBody} />

        <div className={sopstyles.EditorFooter}>
            <span className={sopstyles.WordCount}>{wordCount} words</span>
            <div className={sopstyles.FooterActions}>
            <button className={sopstyles.BtnSecondary} onClick={() => handleSave("save")}>
                Save draft
            </button>
            <button className={sopstyles.BtnPrimary} onClick={() => handleSave("review")}>
                Submit For Review
            </button>
            </div>
        </div>

      {toast && <MessageComp condition={toast.condition} message={toast.message} />}
    </div>
  );
}




export function SopContentView({ pipesopData }) {

    return (
        <div className={sopstyles.a4Shell}>
            <div className={sopstyles.a4Page}>
                <div className={`ck-content ${sopstyles.content}`} dangerouslySetInnerHTML={{ __html: pipesopData?.contenthtml || '' }}/>
                <span className={sopstyles.pageNum}>1</span>
            </div>
        </div>
    );
}



export function SopComments({ pipesopData }) {

    const reviewRejected = pipesopData?.reviewoutcome === "REJECTED" && pipesopData?.reviewcomments
    const approveRejected = pipesopData?.approveoutcome === "REJECTED" && pipesopData?.approvecomments

    const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric"
    }) : "—"

    return (
        <div className={sopstyles.SopPanel}>
            <div className={sopstyles.SopPanelLabel}>Re-draft comments</div>

            {reviewRejected && (
                <div className={sopstyles.commentSection}>
                    <div className={sopstyles.commentSectionHeader}>
                        <span className={sopstyles.commentSectionTitle}>Reviewer remarks</span>
                        <span className={sopstyles.redraftBadge}>Sent for re-draft</span>
                    </div>
                    <div className={sopstyles.commentText}>{pipesopData.reviewcomments}</div>
                </div>
            )}

            {approveRejected && (
                <div className={sopstyles.commentSection}>
                    <div className={sopstyles.commentSectionHeader}>
                        <span className={sopstyles.commentSectionTitle}>Approver remarks</span>
                        <span className={sopstyles.redraftBadge}>Sent for re-draft</span>
                    </div>
                    <div className={sopstyles.commentText}>{pipesopData.approvecomments}</div>
                </div>
            )}

            {!reviewRejected && !approveRejected && (
                <div className={sopstyles.commentEmpty}>
                    No re-draft comments found
                </div>
            )}
        </div>
    )
}


export function SopButtons({pipesopData}){

    const[dialogueBox, setDialogueBox] = useState(null)

    const openDialogueBox = (process) => {

        const data = {
            sopnameversion : pipesopData.sopnameversion,
            sopid : pipesopData.sopid,
            process : process
        }

        setDialogueBox(data)
    }

    return(
        <div className={sopstyles.SopPanel}>
            <div className={sopstyles.SopPanelLabel}>STAGES</div>
            <div className={sopstyles.SopRevAppr}>
                <div>
                    <button onClick={() => openDialogueBox("forreview")}>Rewiew & Send For Approval</button>
                    <button onClick={() => openDialogueBox("approve")}>Approve SOP</button>
                    <button onClick={() => openDialogueBox("reedit")}>Return for edit</button>
                </div>
            </div>
            {dialogueBox && <CommentForm dialogueBox = {dialogueBox} setDialogueBox = {setDialogueBox}/>}
        </div>
    )
}