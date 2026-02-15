from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, initialization, intake, samsubmission, items, projectsinfo, projectforms, projectsrepos

app = FastAPI(title= "theraConsole", version= "V.0.0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],      
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

@app.get("/")
def root():
    return{"status" : "The app is running"}
