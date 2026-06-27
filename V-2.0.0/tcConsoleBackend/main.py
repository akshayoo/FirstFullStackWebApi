from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, initialization, intake, samsubmission, items, projectsinfo, projectforms, projectsrepos, projectsed, llinter, wpages, sops, sopspipewrite, sophandle, sopconpfunc, projectscomp, inventoryroot

app = FastAPI(title= "tConsole", version= "V.2.0.1", root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://console.theracues.com", "https://theracues.com"],      
    allow_credentials=True, 
    allow_headers=["*"],      
    allow_methods=["*"]  
 )

app.include_router(auth.router)
app.include_router(initialization.router)
app.include_router(intake.router)
app.include_router(samsubmission.router)
app.include_router(items.router)
app.include_router(projectsinfo.router)
app.include_router(projectforms.router)
app.include_router(projectsrepos.router)
app.include_router(projectscomp.router)
app.include_router(projectsed.router)
app.include_router(llinter.router)
app.include_router(wpages.router)
app.include_router(sops.router)
app.include_router(sopspipewrite.router)
app.include_router(sophandle.router)
app.include_router(sopconpfunc.router)
app.include_router(inventoryroot.router)

@app.get("/")
def root():
    return{"status" : "tConsole is live"}

