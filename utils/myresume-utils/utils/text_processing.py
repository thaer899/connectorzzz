from fastapi import HTTPException
import spacy
from nltk.corpus import wordnet
import logging

nlp = spacy.load("en_core_web_sm")


def preprocess_text(text):
    # You can add more text preprocessing steps here
    # For example, converting to lowercase and removing punctuation
    text = text.lower()
    text = text.replace("?", "")
    return text


def extract_keywords(text):
    try:
        text = preprocess_text(text)
        doc = nlp(text)
        keywords = []

        for token in doc:
            word = token.text
            pos = token.pos_
            synonyms = []

            if pos in ["NOUN", "VERB", "ADJ", "ADV"]:
                # consider POS in synsets
                synsets = wordnet.synsets(word, pos=get_wordnet_pos(pos))
                for synset in synsets:
                    synonyms.extend(synset.lemma_names())

            # Ensure unique synonyms & word not in synonyms
            synonyms = list(set(synonyms))
            if word in synonyms:
                synonyms.remove(word)

            keywords.append({
                "word": word,
                "pos": pos,
                "synonyms": synonyms
            })

        return keywords

    except Exception as e:
        logging.error("Error in extract_keywords:", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


def get_wordnet_pos(treebank_tag):
    if treebank_tag.startswith('N'):
        return wordnet.NOUN
    elif treebank_tag.startswith('V'):
        return wordnet.VERB
    elif treebank_tag.startswith('J'):
        return wordnet.ADJ
    elif treebank_tag.startswith('R'):
        return wordnet.ADV
    else:
        return None
