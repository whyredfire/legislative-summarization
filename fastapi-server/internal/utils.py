from configs import model_name
from transformers import BartTokenizer, BartForConditionalGeneration

import heapq
import nltk
import torch


def extractive_summary(text, summary_ratio=0.3):
    sentences = nltk.sent_tokenize(text)
    num_sentences = len(sentences)

    summary_length = int(num_sentences * summary_ratio)
    if summary_length <= 0:
        summary_length = 1

    custom_stopwords = set(
        [
            # action verbs
            "shall",
            "may",
            "must",
            "prohibits",
            "requires",
            # quantifiers
            "percentage",
            "amount",
            "number",
            "years",
            "dollars",
            # expressions
            "immediately",
            "forthwith",
            "within",
            "on",
            "before",
            "effective",
            "date",
            # conditionals
            "provided",
            "if",
            "unless",
            "subject",
            "in",
            "event",
            # negation words
            "not",
            "no",
            "without",
            "except",
            "neither",
        ]
    )

    stopwords = set(nltk.corpus.stopwords.words("english")).union(custom_stopwords)

    word_frequencies = {}
    for word in nltk.word_tokenize(text):
        if word.lower() not in stopwords:
            if word.lower() not in word_frequencies:
                word_frequencies[word.lower()] = 1
            else:
                word_frequencies[word.lower()] += 1

    maximum_frequency = max(word_frequencies.values())
    for word in word_frequencies:
        word_frequencies[word] = word_frequencies[word] / maximum_frequency

    sentence_scores = {}
    for sentence in sentences:
        for word in nltk.word_tokenize(sentence.lower()):
            if word in word_frequencies:
                if sentence not in sentence_scores:
                    sentence_scores[sentence] = word_frequencies[word]
                else:
                    sentence_scores[sentence] += word_frequencies[word]

    num_sentences = min(summary_length, len(sentences))
    summary_sentences = heapq.nlargest(
        num_sentences, sentence_scores, key=sentence_scores.get
    )
    summary = " ".join(summary_sentences)

    return summary


def abstractive_summary(text):
    tokenizer = BartTokenizer.from_pretrained(model_name)
    model = BartForConditionalGeneration.from_pretrained(model_name)

    # use cuda if available
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    # tokenize the input text
    inputs = tokenizer(text, return_tensors="pt", max_length=1024, truncation=True).to(
        device
    )

    # generate summary
    summary_ids = model.generate(
        inputs["input_ids"],
        num_beams=3,
        max_length=150,
        min_length=30,
        early_stopping=True,
        length_penalty=1.0,
        no_repeat_ngram_size=2,
    )

    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True).strip()

    return summary
