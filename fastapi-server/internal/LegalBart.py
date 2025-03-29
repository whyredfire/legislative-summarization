import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM


class LegalBartSummarizer:
    def __init__(
        self,
        model_name,
        device=None,
        max_ratio=0.3,
        min_ratio=0.1,
        max_length=600,
        min_length=30,
        max_input_length=1024,
    ):
        self.max_ratio = max_ratio
        self.min_ratio = min_ratio
        self.max_length = max_length
        self.min_length = min_length
        self.max_input_length = max_input_length

        # set device
        if device is None:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = device

        # load model and tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(self.device)
        self.model.eval()

    def summarize(
        self,
        text,
        num_beams=4,
        length_penalty=2.0,
        no_repeat_ngram_size=3,
        early_stopping=True,
    ):
        try:
            if not text or len(str(text).strip()) < 10:
                return ""

            # tokenize the input text
            inputs = self.tokenizer(
                text,
                max_length=self.max_input_length,
                return_tensors="pt",
                truncation=True,
                padding=True,
            ).to(self.device)

            input_token_length = inputs.input_ids.shape[1]

            # calculate summary length
            calculated_max_len = int(input_token_length * self.max_ratio)
            calculated_min_len = int(input_token_length * self.min_ratio)

            dynamic_max_length = min(self.max_length, calculated_max_len)
            dynamic_min_length = max(self.min_length, calculated_min_len)
            dynamic_max_length = max(dynamic_min_length, dynamic_max_length)

            # generate summary
            with torch.no_grad():
                summary_ids = self.model.generate(
                    inputs.input_ids,
                    attention_mask=inputs.attention_mask,
                    max_length=dynamic_max_length,
                    min_length=dynamic_min_length,
                    length_penalty=length_penalty,
                    num_beams=num_beams,
                    no_repeat_ngram_size=no_repeat_ngram_size,
                    early_stopping=early_stopping,
                    do_sample=False,
                )

            summary = self.tokenizer.decode(summary_ids[0], skip_special_tokens=True)
            return summary.strip()

        except Exception as e:
            print(f"Error in summarization: {str(e)}")
            return ""
