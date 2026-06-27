from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from transformers import BitsAndBytesConfig
from sentence_transformers import SentenceTransformer
import faiss
import pickle
import torch, gc
import os


embedding_model = "/home/akshay/Projects/models/Emb/models--sentence-transformers--all-MiniLM-L6-v2/snapshots/c9745ed1d9f207416be6d2e6f8de32d1f16199bf"
doc_index = "./utils/doc_index.faiss"
doc_split = "./utils/doc_split_text.pkl"
emb_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def get_context(query):

    if not os.path.exists(doc_index) or not os.path.exists(doc_split):
        return "No document index found."
    
    emb_query = emb_model.encode([query]).astype("float32")
    index = faiss.read_index(doc_index)
    with open(doc_split, 'rb') as f:
        split_text = pickle.load(f)
    
    D, I = index.search(emb_query, 3)
    retrieved = [split_text[i] for i in I[0]]
    return "\n\n".join(retrieved)

class ModelLoad:

    def __init__(self, path: str):
        self.path = path
        self.tokenizer = None
        self.model = None
        self.pipe = None

    def load_in4bit(self, task="text-generation"):

        if self.model is None:
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.path,
                local_files_only=True
            )

            self.model = AutoModelForCausalLM.from_pretrained(
                self.path,
                device_map="auto",
                quantization_config=BitsAndBytesConfig(
                    load_in_4bit=True,
                    bnb_4bit_compute_dtype=torch.float16,
                    bnb_4bit_quant_type="nf4",
                    bnb_4bit_use_double_quant=True
                )
            )

            self.pipe = pipeline(
                task,
                tokenizer=self.tokenizer,
                model=self.model
            )

    def load_in8bit(self, task="text-generation"):

        if self.model is None:
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.path,
                local_files_only=True
            )

            self.model = AutoModelForCausalLM.from_pretrained(
                self.path,
                device_map="auto",
                torch_dtype=torch.float16,
                quantization_config=BitsAndBytesConfig(
                    load_in_8bit=True
                )
            )

            self.pipe = pipeline(
                task,
                tokenizer=self.tokenizer,
                model=self.model
            )

    def generate(self, query: str, gencontext:bool = False, title: bool = False, 
                 gencat:bool = False, category: str= None, service_name:str = None):

        if self.pipe is None:
            raise RuntimeError("Model not loaded")
        
        if gencontext:

            context = get_context(query= query)

            prompt = f"""
                You are CuesAI, a professional AI assistant for the precision medicine company theraCUES.

                Your role:
                - Assist employees and clients with accurate, concise, and well-structured answers.
                - Use ONLY the provided context to answer questions.
                - If the user asks for code you can generate and respond.
                - If the answer is not found in the context except the user asks for code, clearly say: 
                "I don't have enough information in the provided context to answer this."

                Formatting rules:
                - Use clear paragraphs.
                - Use bullet points or numbered lists when appropriate.
                - Be concise and factual.
                - Do NOT mention the word "context" in the final answer.

                Context:
                {context}

                Question:
                {query}

                Answer:
            """
            max_new_tokens = 500
            temp = 0.2
            top_p = 0.9
            sample = True

        elif title:
        
            prompt = f"""
                You generate short titles.

                Examples:

                Text: RNA sequencing analysis workflow
                Title: RNA Analysis

                Text: Flask backend email error
                Title: Flask Error

                Text: Cancer transcriptomics service overview
                Title: Cancer Transcriptomics

                Now generate a title.

                Rules:
                - Exactly two words
                - Only alphabetic characters
                - No punctuation
                - No explanation

                Text:
                {query}

                Title:
            """

            max_new_tokens = 5
            temp = 0.0
            top_p = 1.0
            sample = False

        elif gencat:

            prompt = f"""
            Catalogue code pattern reference:

            {query}

            New service:
            Category = {category}
            Service = {service_name}

            Output a valid catalogue code following the same style.
            Return only the code.
            """
            max_new_tokens = 10
            temp = 0.0
            top_p = 1.0
            sample = False
            

        output = self.pipe(
            prompt,
            max_new_tokens=max_new_tokens,
            do_sample=sample,
            temperature=temp,
            top_p=top_p,
            return_full_text=False,
            repetition_penalty=1.15,
            eos_token_id=self.tokenizer.eos_token_id
        )[0]["generated_text"]

        return output.strip()

    def clean(self):

        del self.pipe, self.model, self.tokenizer
        self.pipe = None
        self.model = None
        self.tokenizer = None
        gc.collect()
        torch.cuda.empty_cache()
