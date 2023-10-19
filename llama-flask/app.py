from fastapi import FastAPI
from src.chat_utils import generate_response
from pydantic import BaseModel

app = FastAPI()


class ChatRequest(BaseModel):
    text: str


@app.post("/chat")
def chat_endpoint(request_data: dict):
    user_input = request_data.get("text", "")
    keywords = request_data.get("data", {})
    response = generate_response(user_input, keywords)
    return {"response": response}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000, reload=True)
