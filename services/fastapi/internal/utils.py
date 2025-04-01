from collections import defaultdict
from nltk.corpus import stopwords
from .LegalBart import LegalBartSummarizer

import heapq
import math
import nltk


# load tokenizer and model
model_name = "whyredfire/legal-bart-summarizer"
summarizer = LegalBartSummarizer(model_name)


def abstractive_summary(text):
    return summarizer.summarize(text)


def extractive_summary(text, summary_ratio=0.2, min_sentences=2, max_sentences=15):
    if not text or len(text.split()) < 10:
        return text

    try:
        sentences = nltk.sent_tokenize(text)
        num_sentences_input = len(sentences)

        if num_sentences_input == 0:
            print("No sentences found in input text.")
            return ""

        target_num_sentences = int(math.ceil(num_sentences_input * summary_ratio))

        # ensure min/max sentences
        target_num_sentences = max(target_num_sentences, min_sentences)
        target_num_sentences = min(target_num_sentences, max_sentences)

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
