from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from transformers import BitsAndBytesConfig
from sentence_transformers import SentenceTransformer
import faiss
import pickle
import torch, gc
import os


embedding_model = "/home/akshay/Projects/models/Emb/models--sentence-transformers--all-MiniLM-L6-v2/snapshots/c9745ed1d9f207416be6d2e6f8de32d1f16199bf"
doc_index = "./doc_index.faiss"
doc_split = "./doc_split_text.pkl"
emb_model = SentenceTransformer(embedding_model, local_files_only=True)

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

    def generate(self, query: str, gencontext:bool = False, title: bool = False):

        if self.pipe is None:
            raise RuntimeError("Model not loaded")
        
        if gencontext:

            context = get_context(query= query)

            prompt = f"""
                You are a helpful assistant.
                Use the following context to answer the question accurately.
                
                Context:
                {context}

                Question: {query}

                Answer:
            """
            max_new_tokens = 1000

        if title:
        
            prompt = f"""

                You are an expert at creating short conversation titles.
                Generate a title based only on the assistant's first answer.
                And return the Answer.

                Rules:
                - Output exactly TWO words.
                - No punctuation.
                - No quotes.
                - Use Title Case.
                - Capture the main topic.

                First Answer: {query}
                Answer:
            """

            max_new_tokens = 5
            

        output = self.pipe(
            prompt,
            max_new_tokens=max_new_tokens,
            do_sample=True,
            temperature=0.7,
            top_p=0.9
        )[0]["generated_text"]

        return output.split("Answer:")[-1].strip()

    def clean(self):

        del self.pipe, self.model, self.tokenizer
        self.pipe = None
        self.model = None
        self.tokenizer = None
        gc.collect()
        torch.cuda.empty_cache()