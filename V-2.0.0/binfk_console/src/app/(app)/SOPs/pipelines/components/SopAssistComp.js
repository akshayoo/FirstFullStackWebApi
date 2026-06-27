import axiosApi from '@/lib/api'
import sopstyles from './SopNew.module.css'
import { use, useEffect, useState } from 'react'
import { MessageComp } from '@/components/messageComp'
import { toastSet } from '@/components/toastfunc'
import { useRouter } from 'next/navigation'


export function CommentForm({dialogueBox, setDialogueBox}) {

    const[toast, setToast] = useState(null)
    const process = dialogueBox.process
    const [formaData, setFormData] = useState({
        sop_id : dialogueBox.sopid,
        process : dialogueBox.process,
        comments : ""
    })

    const handleChange = (e) =>{
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    const sopFate = async() =>{

        if(!formaData.comments){
            toastSet(setToast, false, "Missing fields")
            return
        }

        try{

            const response = await axiosApi.post("/sops/sopsfate",
                formaData
            )

            const data = response.data

            if(!data.status){
                toastSet(setToast, data.status, data.message)
                return
            }

            toastSet(setToast, data.status, data.message)
            return
        }
        catch(err){
            console.log(err)
            toastSet(setToast, false, "Unable to process request")
            return
        }
    }

    return (
        <div className={sopstyles.commentOverlay}>
            <div className={sopstyles.commentModal}>
                <div className= {sopstyles.commentModalHead}>
                    <div>
                        <h2 className={sopstyles.commentTitle}>SOP {process === "approve" ? `Approve Comments` : 
                        process === "reedit" ? `Re-edit Considerations` : `Review Comments`}</h2>

                        <p className={sopstyles.commentSubtitle}>Please provide {process === "approve" ? `your approve comments for this SOP` :
                        process === "reedit" ? `the edits to be made to the SOP` : `your review comments for this SOP`}.</p>
                    </div>
                    <div>
                        <button onClick={() => setDialogueBox(null)}>X</button>
                    </div>
                </div>
                <textarea className={sopstyles.commentInput}
                    placeholder="Type here"
                    name = "comments"
                    onChange={handleChange}
                    value={formaData.comments}
                    rows={5}/>

                <div className={sopstyles.buttonContainer}>
                    <button className={sopstyles.submitButton}
                    onClick={() => sopFate()}>{process === "approve" ? `Approve` : process === "reedit" ? `Ask to Re-edit` : `Review`}</button>
                </div>

            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}


export function DeleteSop({setSopOptions, sopId, sopNameVer, sopVer}){

    const [toast, setToast] = useState(null)
    const router = useRouter()

    async function sopDelete(){
        try{

            const response = await axiosApi.delete("/sops/deletesop", {
                data:{sop_uid: sopId, sop_name: sopNameVer, sop_ver: sopVer}
            })

            const data = response.data

            if(!data.status){
                toastSet(setToast, data.status, data.message)
                return
            }

            setTimeout(() => {
                setSopOptions(null);
                router.push("/SOPs/pipelines");
                router.refresh();
            }, 2000);

        }
        catch(error){
            console.log(error)
            toastSet(setToast, false, "Unable to delete SOP")
        }
    }

    return(
        <div className={sopstyles.commentOverlay}>
            <div className={sopstyles.commentModal}>
                <div className= {sopstyles.commentModalHead}>
                    <div>
                        <h2 className={sopstyles.commentTitle}>Delete SOP: {sopNameVer}</h2>

                        <p className={sopstyles.commentSubtitle}>
                            Deleting this SOP will remove all progress and unlink it from all associated processes. This action is irreversible.
                        </p>
                    </div>
                    <div>
                        <button onClick={() => setSopOptions(null)}>X</button>
                    </div>
                </div>
                <div className={sopstyles.buttonContainer}>
                    <button className={sopstyles.submitButton} onClick={() => setSopOptions(null)}>Cancel</button>
                    <button className={sopstyles.deleteButton} onClick={() => sopDelete()}>Delete</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}


export function ChangeOwner({setSopOptions, sopId}){

    const[users, setUsers] = useState([])
    const[toast, setToast] = useState(null)

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


    const [formData, setFormData] = useState({
        sop_new_owner : ""
    })

    const handleChange = (e) =>{
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    const changeOwner = async () => {

        try {
            if (!formData.sop_new_owner) {
                toastSet(setToast, false, "Select a new owner")
                return;
            }

            const response = await axiosApi.post("sops/changeowner",
                {
                    sop_id: sopId,
                    sop_new_owner: formData.sop_new_owner
                }
            )

            if (!response.data.status) {
                toastSet(setToast, response.data.status, response.data.message)
                return;
            }

            toastSet(setToast, response.data.status, response.data.message)
            setTimeout(() => setSopOptions(null), 2000)
        }
        catch(err){
            console.log(err)
            toastSet(setToast, false, "Failed to change SOP owner")
        }
    }

    return(
        <div className={sopstyles.commentOverlay}>
            <div className={sopstyles.commentModal}>
                <div className= {sopstyles.commentModalHead}>
                    <div>
                        <h2 className={sopstyles.commentTitle}>Change SOP Owner</h2>

                        <p className={sopstyles.commentSubtitle}>
                            The selected user will gain full ownership and permissions, including editing, submitting, and managing this SOP.
                        </p>
                    </div>
                    <div>
                        <button onClick={() => setSopOptions(null)}>X</button>
                    </div>
                </div>
                <div className={sopstyles.SopFormDiv}>
                   <select name='sop_new_owner' value={formData.sop_new_owner} type='text' onChange={handleChange}>
                        <option value="" disabled>select</option>
                        {
                            users.map(user => (
                                <option value={user.useremployeeid} key={user.userid}>{user.username}</option>
                            ))
                        }
                    </select>
                </div>
                <div className={sopstyles.buttonContainer}>
                    <button className={sopstyles.submitButton} onClick={() => changeOwner()}>Change Owner</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}


export function EditMetaData({setSopOptions, sopId}){

    const[users, setUsers] = useState([])
    const [toast, setToast] = useState(null)
    const [formData, setFormData] = useState({
        sop_id : "",
        sop_title : "",
        sop_desc : "",
        sop_category : "",
        sop_dept : "",
        sop_rev_period : "",
        sop_reviewer : "",
    })

    useEffect(() => {
        
        async function getCompData(){

            try{

                const [sopMetaResponse, usersDataResponse] = await Promise.all([
                    axiosApi.get(`sops/getsopmetadata/${sopId}`),
                    axiosApi.get("sops/sopsusers")
                ])

                if(!sopMetaResponse.data.status){
                    toastSet(setToast, false, sopMetaResponse.data.message)
                    return
                }

                const sopData = sopMetaResponse.data.payload 

                setFormData({
                    sop_id : sopData.sopname || "",
                    sop_title : sopData.soptitle || "",
                    sop_desc : sopData.sopdescription || "",
                    sop_category : sopData.sopcategory || "",
                    sop_dept : sopData.sopdepartment || "",
                    sop_rev_period : sopData.soprevisiongap || "",
                    sop_reviewer : sopData.reviewer?.useremployeeid || "",
                })

                if(!usersDataResponse.data.status){
                    toastSet(setToast, false, usersDataResponse.data.message)
                    return
                }

                console.log(usersDataResponse.data.payload)

                setUsers(usersDataResponse.data.payload)
            }
            catch(error){
                console.log(error)
            }
        }

        getCompData()

    },[sopId])

    const handleChange = (e) =>{
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    async function editSopMeta(){

        console.log(formData)

        if(!formData.sop_id || !formData.sop_title || !formData.sop_desc || !formData.sop_category || 
            !formData.sop_dept || !formData.sop_rev_period || !formData.sop_reviewer 
        ){
            toastSet(setToast, false, "Missing fields")
            return
        }

        try{
            const response = await axiosApi.post("/sops/editsopmeta", 
                {...formData, sop_uid : sopId})
            const data = response.data
            
            if(!data.status){
                toastSet(setToast, data.status, data.message)
                return
            }

            toastSet(setToast, data.status, data.message)
            setTimeout(() => setSopOptions(null), 2000)

        }
        catch(error){
            console.error(error)
            toastSet(setToast, false, "Submission failed")   
            return
        }
    }

    return(
        <div className={sopstyles.commentOverlay}>
            <div className={sopstyles.commentModal}>
                <div className= {sopstyles.commentModalHead}>
                    <div>
                        <h2 className={sopstyles.commentTitle}>Edit Sop</h2>

                        <p className={sopstyles.commentSubtitle}>
                            Update the SOP metadata, including its title, owner, category, version, and other associated details.
                        </p>
                    </div>
                    <div>
                        <button onClick={() => setSopOptions(null)}>X</button>
                    </div>
                </div>
                <div className={sopstyles.SopForm}>
                    <div className={sopstyles.SopFormDiv}>
                        <label>Sop ID *</label>
                        <input name='sop_id' value={formData.sop_id} type='text' onChange={handleChange} disabled />
                        <label>Sop Title *</label>
                        <input  name='sop_title' value={formData.sop_title} type='text' onChange={handleChange}/>
                        <label>Sop Description *</label>
                        <textarea name='sop_desc' value={formData.sop_desc} type='text' cols={10} rows={5} onChange={handleChange}/>
                        <div className={sopstyles.SopFormIn}>
                            <label>SOP Category *</label>
                            <select name='sop_category' value={formData.sop_category} onChange={handleChange}>
                                <option value="" disabled>Select</option>
                                <option value="Lab">Lab</option>
                                <option value="Business">Business</option>
                                <option value="Analysis">Analysis</option>
                                <option value="Business development">Business development</option>
                                <option value="Other">Other</option>
                            </select>
                            <label>SOP Department *</label>
                            <select name='sop_dept' value={formData.sop_dept} onChange={handleChange}>
                                <option value="" disabled>Select</option>
                                <option value="Lab">Lab</option>
                                <option value="Business">Business</option>
                                <option value="Analysis">Analysis</option>
                                <option value="Business development">Business development</option>
                                <option value="Other">Other</option>
                            </select>  
                            <label>Revision period in months *</label>
                            <input name='sop_rev_period' value={formData.sop_rev_period} type='number' onChange={handleChange}/>     
                        </div>
                        <label>Add reviewer *</label>
                        <select name='sop_reviewer' value={formData.sop_reviewer} onChange={handleChange}>
                            <option value="" disabled>select</option>
                            {
                                users.map(user =>(
                                    <option value={user.useremployeeid} key={user.useremployeeid}>{user.username}: {user.useremployeeid}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className={sopstyles.buttonContainer}>
                    <button className={sopstyles.submitButton} onClick={() => editSopMeta()}>Update Record</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}




export function ShareSop({sopId, setSopShareBox}){

    const[toast, setToast] = useState(null)

    const [formData, setFormData] = useState({
        share_email : ""
    })

    const handleChange = (e) =>{
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    const shareSop = async () => {

        try {
            if (!formData.share_email) {
                toastSet(setToast, false, "Select a new owner")
                return;
            }

            const response = await axiosApi.post("sops/sharesop",
                {
                    sop_id: sopId,
                    share_email: formData.share_email
                }
            )

            if (!response.data.status) {
                toastSet(setToast, response.data.status, response.data.message)
                return;
            }

            toastSet(setToast, response.data.status, response.data.message)
            setTimeout(() => setSopShareBox(null), 2000)
        }
        catch(err){
            console.log(err)
            toastSet(setToast, false, "Failed to Share SOP")
        }
    }

    return(
        <div className={sopstyles.commentOverlay}>
            <div className={sopstyles.commentModal}>
                <div className= {sopstyles.commentModalHead}>
                    <div>
                        <h2 className={sopstyles.commentTitle}>Share SOP</h2>

                        <p className={sopstyles.commentSubtitle}>
                            Enter the recipient's email address to share this SOP
                        </p>
                    </div>
                    <div>
                        <button onClick={() => setSopShareBox(null)}>X</button>
                    </div>
                </div>
                <div className={sopstyles.SopFormDiv}>
                   <input name='share_email' value={formData.share_email} type='text' onChange={handleChange}/>
                </div>
                <div className={sopstyles.buttonContainer}>
                    <button className={sopstyles.submitButton} onClick={() => shareSop()}>Share SOP</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}




export function AckSop({sopId, setAckno}){

    const[toast, setToast] = useState(null)

    const [formData, setFormData] = useState({
        acknowledge_comm : ""
    })

    const handleChange = (e) =>{
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    const [acknowledgements, setAcknowledgements] = useState([])

    useEffect(() => {
        async function getAcknowledgements() {
            try {
                const response = await axiosApi.get(`sops/getacknowledgements/${sopId}`)
                
                if (!response.data.status) {
                    console.log(response.data.message)
                    return
                }

                setAcknowledgements(response.data.payload)
            }
            catch (err) {
                console.log(err)
            }
        }

        if (sopId) getAcknowledgements()

    }, [sopId])

    const acknowledgeSop = async () => {

        try {
            if (!formData.acknowledge_comm) {
                toastSet(setToast, false, "Select a new owner")
                return;
            }

            const response = await axiosApi.post("sops/acknowledgesop",
                {
                    sop_id: sopId,
                    acknowledge_comm: formData.acknowledge_comm
                }
            )

            if (!response.data.status) {
                toastSet(setToast, response.data.status, response.data.message)
                return;
            }

            toastSet(setToast, response.data.status, response.data.message)
            setTimeout(() => setSopOptions(null), 2000)
        }
        catch(err){
            console.log(err)
            toastSet(setToast, false, "Failed submit acknowledgement")
        }
    }

    return(
        <div className={sopstyles.commentOverlay}>
            <div className={sopstyles.commentModal}>
                <div className={sopstyles.commentModalHead}>
                    <div>
                        <h2 className={sopstyles.commentTitle}>Acknowledge SOP</h2>
                        <p className={sopstyles.commentSubtitle}>
                            Enter acknowledgement comments
                        </p>
                    </div>
                    <div>
                        <button onClick={() => setAckno(null)}>X</button>
                    </div>
                </div>

                <div className={sopstyles.acknoListBox}>
                    <div className={sopstyles.acknoListTitle}>Acknowledgements</div>
                    {acknowledgements && acknowledgements.length > 0 ? (
                        acknowledgements.map((ack, index) => (
                            <div className={sopstyles.acknoItem} key={index}>
                                <div className={sopstyles.acknoItemHead}>
                                    <span className={sopstyles.acknoBy}>{ack.username}</span>
                                    <span className={sopstyles.acknoDate}>{new Date(ack.acknowledgedat).toLocaleDateString("en-IN", {day:"2-digit", month:"short", year:"numeric"})}</span>
                                </div>
                                <div className={sopstyles.acknoComment}>{ack.acknowledgecomment || "No comment provided"}</div>
                            </div>
                        ))
                    ) : (
                        <div className={sopstyles.acknoEmpty}>No acknowledgements yet</div>
                    )}
                </div>

                <div className={sopstyles.SopFormDiv}>
                    <textarea name='acknowledge_comm' value={formData.acknowledge_comm} type='text' rows={2} onChange={handleChange}/>
                </div>
                <div className={sopstyles.buttonContainer}>
                    <button className={sopstyles.submitButton} onClick={() => acknowledgeSop()}>Add yours</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}


export function ExtendSop({sopId, setExtnd}){

    const[toast, setToast] = useState(null)

    const [formData, setFormData] = useState({
        extend_period : ""
    })

    const handleChange = (e) =>{
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    const extndSop = async () => {

        try {
            if (!formData.extend_period) {
                toastSet(setToast, false, "Select a period")
                return;
            }

            const response = await axiosApi.post("sops/extendsop",
                {
                    sop_id: sopId,
                    extend_period: formData.extend_period
                }
            )

            if (!response.data.status) {
                toastSet(setToast, response.data.status, response.data.message)
                return;
            }

            toastSet(setToast, response.data.status, response.data.message)
            setTimeout(() => setExtnd(null), 2000)
        }
        catch(err){
            console.log(err)
            toastSet(setToast, false, "Failed to Extend SOP")
        }
    }

    return(
        <div className={sopstyles.commentOverlay}>
            <div className={sopstyles.commentModal}>
                <div className= {sopstyles.commentModalHead}>
                    <div>
                        <h2 className={sopstyles.commentTitle}>Extend SOP</h2>

                        <p className={sopstyles.commentSubtitle}>
                            Extend this SOP's Revision period, Give a value in number of months.
                        </p>
                    </div>
                    <div>
                        <button onClick={() => setExtnd(null)}>X</button>
                    </div>
                </div>
                <div className={sopstyles.SopFormDiv}>
                   <input name='extend_period' value={formData.extend_period} type='number' onChange={handleChange}/>
                </div>
                <div className={sopstyles.buttonContainer}>
                    <button className={sopstyles.submitButton} onClick={() => extndSop()}>Extend SOP</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}





export function RetireSop({sopId, setRetire}){

    const [toast, setToast] = useState(null)

    async function sopRetire(){
        try{

            const response = await axiosApi.post("/sops/retiresop", {sop_id: sopId})

            const data = response.data

            if(!data.status){
                toastSet(setToast, data.status, data.message)
                return
            }

            setTimeout(() => {
                setRetire(false);
            }, 2000);

        }
        catch(error){
            console.log(error)
            toastSet(setToast, false, "Unable to delete SOP")
        }
    }

    return(
        <div className={sopstyles.commentOverlay}>
            <div className={sopstyles.commentModal}>
                <div className= {sopstyles.commentModalHead}>
                    <div>
                        <h2 className={sopstyles.commentTitle}>Retire SOP</h2>

                        <p className={sopstyles.commentSubtitle}>
                            Retiring the SOP will affect all versions of the sop. Full SOP class will be marked retired
                        </p>
                    </div>
                    <div>
                        <button onClick={() => setSopOptions(null)}>X</button>
                    </div>
                </div>
                <div className={sopstyles.buttonContainer}>
                    <button className={sopstyles.submitButton} onClick={() => setRetire(null)}>Cancel</button>
                    <button className={sopstyles.deleteButton} onClick={() => sopRetire()}>Retire SOP</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}
