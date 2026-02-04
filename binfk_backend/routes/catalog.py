from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

CLIENT = MongoClient("mongodb://localhost:27017")
db = CLIENT.tcDB

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_headers = ["*"],
    allow_credentials = True
)

@app.get("/items/catalog/pulldata")
async def items_catalog():
    
    collection = db['tcStdDeliverables']

    categories = collection.find({}, {"category": 1, "_id": 0})

    category_services = {}  

    for cat in categories:
        category = cat["category"]

        items = collection.find(
            {"category": category},
            {"services.service_name" : 1,
             "_id" : 0,
             "services.applications": 1,
             "services.supported_sample_types" : 1,
             "services.instrumentation" : 1,
             "services.process_map" : 1,
             "services.standard_deliverables" : 1,
             "services.input_requirements" : 1,
             "services.pros_and_cons": 1,
             "services.service_code" : 1
            }
        )

        service_list = []

        for doc in items:

            for service in doc.get("services", []):
                service_name = service.get("service_name")
                service_code = service.get("service_code")
                application = service.get("applications")
                pros_cons = service.get("pros_and_cons")
                input_req = service.get("input_requirements")
                supported_sample_types = service.get("supported_sample_types")
                instrumentation = service.get("instrumentation")
                process_map = service.get("process_map")
                standard_deliverables = service.get("standard_deliverables")

                serv = {
                    "service_name" : service_name,
                    "service_code" : service_code,
                    "applications" : application,
                    "pros_cons" : pros_cons,
                    "input_req" : input_req,
                    "supported_sample_types" : supported_sample_types,
                    "instrumentation" : instrumentation,
                    "process_map" : process_map,
                    "standard_deliverables" : standard_deliverables
                }

                service_list.append(serv)

        category_services[category] = service_list
    
    return category_services
