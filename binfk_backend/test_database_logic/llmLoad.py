from fastapi import FastAPI
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from transformers import BitsAndBytesConfig
from fastapi.middleware.cors import CORSMiddleware
import torch
from pydantic import BaseModel
import uuid

def load_model(path):
    
    if torch.cuda.is_available():
        
        fourbit_quant_config =  BitsAndBytesConfig(
          load_in_4bit= True,
          bnb_4bit_compute_dtype= torch.float16,
          bnb_4bit_quant_type= "nf4",
          bnb_4bit_use_double_quant= True
        )

        tokenizer = AutoTokenizer.from_pretrained(path, local_files_only =  True)
        model = AutoModelForCausalLM. from_pretrained(
            path,
            torch_dtype = torch.float16,
            device_map= 'auto',
            quantization_config = fourbit_quant_config,
            local_files_only =  True
        )

        pipe = pipeline(
            'text-generation',
            tokenizer = tokenizer,
            model = model
        )

        return pipe
    


def query_answering(query, pipe):
    
    prompt = f"""
     
               You are knowledge agent that gives answers for the Question efficiently

               Question: {query}

               Answer: 

          """
    response = pipe(
        prompt,
        max_new_tokens=1000,
        temperature=0.5,
        top_p=0.5
     )[0]['generated_text']
    
    if "Answer:" in response:
        response = response.split("Answer:")[-1].strip()

    return response


MODEL_PATH = "/home/akshay/Projects/models/text/models--mistralai--Mistral-7B-Instruct-v0.3/snapshots/0d4b76e1efeb5eb6f6b5e757c79870472e04bd3a"


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_headers = ["*"]
)

PIPE = load_model(path= MODEL_PATH)

class ChatQuery(BaseModel):
    messageId: str
    role: str
    content: str

@app.post("/chat/llm")
async def get_query(query : ChatQuery):

    answer = query_answering(query.content, PIPE)

    return {
        "messageId" : str(uuid.uuid4()),
        "role" : "assistant",
        "question": query.content,
        "content": answer
    }


