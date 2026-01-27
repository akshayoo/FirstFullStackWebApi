from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from transformers import BitsAndBytesConfig
import torch
import gc

class ModelLoad():

    def __init__(self, path : str):
        self.path = path
        self.tokenizer = None
        self.model = None
        self.pipe = None

    def load_in4bit(self, method):

        if self.model == None:
            self.tokenizer = AutoTokenizer.from_pretrained(self.path, local_files_only = True)
            self.model = AutoModelForCausalLM.from_pretrained(
                self.path, 
                device_map = 0, 
                quantization_config = BitsAndBytesConfig(
                    load_in_4bit= True,
                    bnb_4bit_compute_dtype= torch.float16,
                    bnb_4bit_quant_type= "nf4",
                    bnb_4bit_use_double_quant= True
                )
            )

            self.pipe = pipeline(method, tokenizer= self.tokenizer, model = self.model, device_map = 0 )

    def load_in8bit(self, method):

        if self.model == None:
            self.tokenizer = AutoTokenizer.from_pretrained(self.path, local_files_only = True)
            self.model = AutoModelForCausalLM.from_pretrained(
                self.path, 
                device_map = 0, 
                quantization_config = BitsAndBytesConfig(
                    load_in_8bit= True,
                )
            )

            self.pipe = pipeline(method, tokenizer= self.tokenizer, model = self.model, device_map = 0 )


    def response(self, query: str, max_new_tokens: int = 512) -> str:
        if self.pipe is None:
            raise RuntimeError("Model not loaded. Call load_in4bit() or load_in8bit() first.")

        prompt = (
            "You are a knowledgeable assistant. "
            "Answer the question clearly and concisely.\n\n"
            f"Question: {query}\n"
            "Answer:"
        )

        output = self.pipe(
            prompt,
            max_new_tokens=max_new_tokens,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            eos_token_id=self.tokenizer.eos_token_id,
        )[0]["generated_text"]

        return output.split("Answer:")[-1].strip()

    def clean(self):
        del self.pipe
        del self.model
        del self.tokenizer
        self.pipe = None
        self.model = None
        self.tokenizer = None

        gc.collect()
        torch.cuda.empty_cache()