from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import StringIO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

@app.post("/ssub/samsub/tableupload")
async def populate_form(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        csv_data = StringIO(contents.decode("utf-8"))

        data = pd.read_csv(csv_data)
        data.columns = data.columns.str.strip()

        records = data.fillna("No Value").to_dict(orient="records")

        return {
            "status": "Parsed successfully",
            "submission": records
        }

    except Exception as e:
        return {
            "status": "Error",
            "message": str(e)
        }
