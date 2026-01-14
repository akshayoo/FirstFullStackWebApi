import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from transformers import BitsAndBytesConfig
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "/home/akshay/Projects/models/text/models--mistralai--Mistral-7B-Instruct-v0.3/snapshots/0d4b76e1efeb5eb6f6b5e757c79870472e04bd3a"

def llm_load_4bit(path):
     
     if not torch.cuda.is_available():
          raise RuntimeError("GPU not active")
     
     load_4bit_config = BitsAndBytesConfig(
          load_in_4bit = True,
          bnb_4bit_compute_dtype = torch.float16,
          bnb_4bit_quant_type ="nf4",
          bnb_4bit_use_double_quant = True
     )

     tokenizer = AutoTokenizer.from_pretrained(
          path,
          local_files_only = True
     )

     model = AutoModelForCausalLM.from_pretrained(
          path,
          device_map = "auto",
          torch_dtype = torch.float16,
          quantization_config = load_4bit_config,
          local_files_only = True
     )

     model.eval()

     pipe = pipeline(
          'text-generation',
          model = model,
          tokenizer = tokenizer
     )

     return pipe

def text_handle(query, pipe):

    prompt = f"""
        You are a helpful coding assistant.
        Generate me code for the following javascript of react queries.

        Question: {query}

        Answer:
        """

    response = pipe(
        prompt,
        max_new_tokens=4000,
        temperature=0.3,
        top_p=0.5
    )[0]['generated_text']


    if "Answer:" in response:
        response = response.split("Answer:")[-1].strip()

    return response

PIPE = llm_load_4bit(MODEL_PATH)

QUERY = "Generate me a code for implementing button action in a react component which post the input to a particular endpoint " 

@app.get("/chat/botresponse")
async def chatbotAns():
     
     resp = text_handle(QUERY, PIPE)

     return {
          "query" : QUERY,
          "response" : resp
     }
