import asyncio
import json
import traceback
import uuid
import logging
from src.models.datamodel import GenerateWebRequest
from src.profiles.team_profiles import TeamProfiles
from src.connection_manager import ConnectionManager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import threading
from starlette.websockets import WebSocketState

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


def handle_chat(team_profiles, chat_id):
    logging.info("Inside handle_chat method...")
    while True:
        # Wait for the main loop to signal that new data is available
        team_profiles.new_data_event.wait()
        team_profiles.new_data_event.clear()

        data = team_profiles.client_sent_queue.get(block=True)

        # Check for termination signal
        if data == SENTINEL:
            logging.info("Termination signal received. Exiting handle_chat.")
            break

        logging.info(f"Received data: {data}")
        team_profiles.initiate_team_chat(data, chat_id)

        # Signal the main loop that data has been processed
        team_profiles.processing_done_event.set()


@app.websocket("/ws/{chat_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: str):
    await websocket.accept()
    team_profiles = TeamProfiles(chat_id=chat_id, websocket=websocket)
    active_chats[chat_id] = team_profiles
    t = threading.Thread(target=handle_chat, args=(team_profiles, chat_id))
    team_profiles.set_thread(t)
    t.start()

    try:
        while True:
            data = await websocket.receive_text()
            if not data:
                logging.warning("Received empty data. Skipping...")
                continue

            if data.startswith("{") or data.startswith("["):
                try:
                    deserialized_data = json.loads(data)
                except json.JSONDecodeError:
                    logging.error(f"Failed to decode JSON from data: {data}")
                    continue
            else:
                deserialized_data = data

            logging.info(f"Received message: {deserialized_data}")
            team_profiles.client_sent_queue.put(deserialized_data)

            # Signal that new data has been added to the queue
            team_profiles.new_data_event.set()

            # Wait for the handle_chat thread to process the data
            team_profiles.processing_done_event.wait()
            team_profiles.processing_done_event.clear()

            # Wait for new_reply_event before processing client_receive_queue
            while not team_profiles.new_reply_event.is_set():
                await asyncio.sleep(0.1)

            # Process messages from the client_receive_queue
            while not team_profiles.client_receive_queue.empty():
                reply = team_profiles.client_receive_queue.get(block=False)
                serialized_reply = json.dumps(reply)
                logging.info(f"Sending reply to client: {serialized_reply}")
                if websocket.client_state == WebSocketState.CONNECTED:
                    await websocket.send_text(serialized_reply)
                else:
                    logging.warning("WebSocket is not connected.")
                if serialized_reply == "exit":
                    logging.info("####FINISHED")
                    break

            team_profiles.new_reply_event.clear()

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


@app.get("/get_chat_id")
async def get_chat_id():
    chat_id = str(uuid.uuid1())
    return {"chat_id": chat_id}


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
