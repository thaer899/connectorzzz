import os
import traceback
import uuid
import logging
from src.models.datamodel import GenerateWebRequest
from src.profiles.team_profiles import TeamProfiles
from src.connection_manager import ConnectionManager
from fastapi import FastAPI, HTTPException
from fastapi import Header, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import threading
from dotenv import load_dotenv
from src.websocket_logic import handle_chat, process_websocket_data


# Load environment variables
load_dotenv()

API_KEY = os.getenv('API_KEY')

app = FastAPI()
active_chats = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

manager = ConnectionManager()

SENTINEL = "TERMINATE"

logging.basicConfig(level=logging.INFO)


@app.get("/")
async def probe():
    return {"status": "OK", "message": "Service is running"}


@app.get("/get_chat_id")
async def get_chat_id(apiKey: str = Header(None)):
    if apiKey != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")

    chat_id = str(uuid.uuid1())
    return {"chat_id": chat_id}


@app.websocket("/ws/{chat_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: str):
    await websocket.accept()
    team_profiles = TeamProfiles(chat_id=chat_id, websocket=websocket)
    active_chats[chat_id] = team_profiles
    t = threading.Thread(target=handle_chat, args=(team_profiles, chat_id))
    team_profiles.set_thread(t)
    t.start()

    try:
        await process_websocket_data(websocket, team_profiles)
    except WebSocketDisconnect:
        logging.warning("WebSocket disconnected.")
        # Signal the handle_chat thread to terminate
        team_profiles.client_sent_queue.put(SENTINEL)
        while not team_profiles.client_sent_queue.empty():
            team_profiles.client_sent_queue.get()
        while not team_profiles.client_receive_queue.empty():
            team_profiles.client_receive_queue.get()
    except Exception as e:
        logging.error(f"ERROR: {str(e)}")
    finally:
        if t.is_alive():
            t.join(timeout=1)
        await manager.disconnect(websocket)


@app.post("/team")
async def initiate_chat(req: GenerateWebRequest, chat_id: str):
    prompt = req.prompt
    team_profiles = active_chats.get(chat_id)
    if not team_profiles:
        return {"data": "Chat ID not found", "status": False}

    try:
        response = team_profiles.initiate_team_chat(prompt, chat_id)
    except Exception as e:
        traceback.print_exc()
        response = {
            "data": str(e),
            "status": False
        }
    return response
