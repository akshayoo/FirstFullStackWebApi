from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import initialization, intake, samsubmission, catalog, projectsinfo

app = FastAPI(title= "tConsole", version= "V.0.0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      
    allow_credentials=True, 
    allow_headers=["*"],      
    allow_methods=["*"]  
 )

app.include_router(initialization.router)
app.include_router(intake.router)
app.include_router(samsubmission.router)
app.include_router(catalog.router)
app.include_router(projectsinfo.router)

@app.get("/")
def root():
    return{"status" : "The app is running"}
