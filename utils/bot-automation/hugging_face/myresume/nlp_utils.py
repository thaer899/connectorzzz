import spacy


nlp = spacy.load("en_core_web_sm")


def extract_tokens(text):
    doc = nlp(text)
    return [token.text for token in doc]


def retrieve_info_with_nlp(user_input, section, data):
    tokens = extract_tokens(user_input)
    print("tokens", tokens)
    print("user_input", user_input)
    print("data", str(data)[:50])

    for token in tokens:
        for entry in data[section]:
            if any(token.lower() in str(value).lower()
                   for value in entry.values()):
                return entry
    return None
