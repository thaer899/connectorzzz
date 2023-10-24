
from fastapi import FastAPI
from utils.text_processing import extract_keywords
from utils.filters import filter_data_with_keywords

app = FastAPI()


@app.post("/extract_keywords")
def extract_tokens(request_data: dict):
    text = request_data.get("text", "")
    data = request_data.get("data", {})
    keywords = extract_keywords(text)
    summary = filter_data_with_keywords(data, keywords)
    return summary


# uvicorn main:app --host 0.0.0.0 --port 3000 --reload
