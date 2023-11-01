import json
import traceback
import uuid
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


def handle_chat(team_profiles, chat_id):
    print("Inside initiate_team_chat method...")
    data = team_profiles.client_sent_queue.get(block=True)
    response = team_profiles.initiate_team_chat(data, chat_id)
    print(f"Response from initiate_team_chat: {response}")
    team_profiles.queue_event.set()  # Signal that the queue has been populated


@app.get("/get_chat_id")
async def get_chat_id():
    chat_id = str(uuid.uuid1())
    return {"chat_id": chat_id}


@app.websocket("/ws/{chat_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: str):
    await websocket.accept()
    team_profiles = TeamProfiles(chat_id=chat_id, websocket=websocket)
    team_profiles.queue_event = threading.Event()
    active_chats[chat_id] = team_profiles
    t = threading.Thread(target=handle_chat, args=(team_profiles, chat_id))
    team_profiles.set_thread(t)
    t.start()

    try:
        while True:
            data = await websocket.receive_text()
            if not data:
                print("Received empty data. Skipping...")
                continue

            if data.startswith("{") or data.startswith("["):
                try:
                    deserialized_data = json.loads(data)
                except json.JSONDecodeError:
                    print(f"Failed to decode JSON from data: {data}")
                    continue
            else:
                deserialized_data = data

            print(f"Received message: {deserialized_data}")

            team_profiles.client_sent_queue.put(deserialized_data)
            # wait for response
            reply = team_profiles.client_receive_queue.get(block=True)
            serialized_reply = json.dumps(reply)
            print(f"Sending reply to client: {serialized_reply}")
            if reply != "exit":
                # send to the client on websocket
                await websocket.send_text(serialized_reply)
            else:
                team_profiles.thread.join()
                print("####FINISHED")
                raise WebSocketDisconnect
    except WebSocketDisconnect:
        print("WebSocket disconnected.")
    except Exception as e:
        print("ERROR", str(e))
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
