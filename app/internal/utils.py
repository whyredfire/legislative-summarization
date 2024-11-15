import heapq
import nltk


def extractive_summary(text, summary_ratio=0.3):
    sentences = nltk.sent_tokenize(text)
    num_sentences = len(sentences)

    summary_length = int(num_sentences * summary_ratio)
    if summary_length <= 0:
        summary_length = 1

    word_frequencies = {}
    for word in nltk.word_tokenize(text):
        if word.lower() not in nltk.corpus.stopwords.words("english"):
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

    sentences = nltk.sent_tokenize(text)
    num_sentences = len(sentences)

    return summary
