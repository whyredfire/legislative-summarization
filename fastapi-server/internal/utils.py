from collections import defaultdict
from nltk.corpus import stopwords
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

import heapq
import math
import nltk
import torch


device = "cuda" if torch.cuda.is_available() else "cpu"
model_name = "whyredfire/legal-bart-summarizer"

# load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(device)


def abstractive_summary(text):
    # tokenize and generate summary
    inputs = tokenizer(text, return_tensors="pt", max_length=1024, truncation=True)
    summary_ids = model.generate(
        inputs["input_ids"],
        max_length=150,
        min_length=40,
        num_beams=4,
        early_stopping=True,
        no_repeat_ngram_size=2,
    )

    # decode the summary
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary


def extractive_summary(text, SUMMARY_RATIO=0.2, MIN_SENTENCES=2, MAX_SENTENCES=15):
    if not text or len(text.split()) < 10:
        return text

    try:
        sentences = nltk.sent_tokenize(text)
        num_sentences_input = len(sentences)

        if num_sentences_input == 0:
            print("No sentences found in input text.")
            return ""

        target_num_sentences = int(math.ceil(num_sentences_input * SUMMARY_RATIO))

        # ensure min/max sentences
        target_num_sentences = max(target_num_sentences, MIN_SENTENCES)
        target_num_sentences = min(target_num_sentences, MAX_SENTENCES)

        # ensure target summary isn't bigger than input text
        target_num_sentences = min(target_num_sentences, num_sentences_input)

        custom_stopwords = set(
            [
                "shall",
                "may",
                "must",
                "prohibits",
                "requires",
                "percentage",
                "amount",
                "number",
                "years",
                "dollars",
                "immediately",
                "forthwith",
                "within",
                "on",
                "before",
                "effective",
                "date",
                "provided",
                "if",
                "unless",
                "subject",
                "in",
                "event",
                "not",
                "no",
                "without",
                "except",
                "neither",
            ]
        )

        # use lower case for stopwords comparison
        stop_words = set(sw.lower() for sw in stopwords.words("english")).union(
            custom_stopwords
        )

        # calculate frequency table
        word_frequencies = defaultdict(int)
        all_words = [
            word.lower() for word in nltk.word_tokenize(text) if word.isalnum()
        ]
        significant_words = [word for word in all_words if word not in stop_words]

        if not significant_words:
            return " ".join(sentences[:target_num_sentences])

        for word in significant_words:
            word_frequencies[word] += 1

        maximum_frequency = max(word_frequencies.values())

        # normalize frequencies
        for word in word_frequencies:
            word_frequencies[word] = word_frequencies[word] / maximum_frequency

        # score sentences
        sentence_scores = defaultdict(float)
        for index, sentence in enumerate(sentences):
            sentence_words = [
                word.lower() for word in nltk.word_tokenize(sentence) if word.isalnum()
            ]
            for word in sentence_words:
                if word in word_frequencies:
                    sentence_scores[(index, sentence)] += word_frequencies[word]

        # select top sentences
        summary_sentence_tuples = heapq.nlargest(
            target_num_sentences, sentence_scores, key=sentence_scores.get
        )

        # join the sentences
        summary = " ".join([sentence for index, sentence in summary_sentence_tuples])

        return summary

    except Exception as e:
        return ""
