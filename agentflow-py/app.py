import asyncio
from multiprocessing import Manager
import queue
import uuid
import logging
from fastapi.responses import JSONResponse
from fastapi.websockets import WebSocketState
import openai
from pydantic import EmailStr
import uvicorn
from fastapi import FastAPI, Request, WebSocket, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocketDisconnect
from src.config import API_KEY, OPENAI_API_KEY
from src.chat import setup_agent, group_chat
from src.db import create_profile, read_profile, update_profile, delete_profile

openai.api_key = OPENAI_API_KEY


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

logging.basicConfig(filename='agent.log', level=logging.DEBUG)


@app.get("/")
async def probe():
    return {"status": "OK", "message": "Service is running"}


@app.get("/agentflow/get_chat_id")
async def get_chat_id(apiKey: str = Header(None)):
    if apiKey != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")

    chat_id = str(uuid.uuid1())
    return {"chat_id": chat_id}


@app.websocket("/agentflow/ws/{chat_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: str):
    active_chats[chat_id] = websocket
    logging.info('Starting websocket server.')
    await websocket.accept()

    agents = {}

    async def check_queue():
        while True:
            try:
                _message = receive_queue.get(False)
                await websocket.send_json(_message)
            except queue.Empty:
                # sleep for a second before checking again
                await asyncio.sleep(1)
            except WebSocketDisconnect:
                logging.warning("check_queue: WebSocket disconnected.")
                return

    asyncio.create_task(check_queue())

    while True:
        try:
            if websocket.client_state == WebSocketState.CONNECTED:
                data = await websocket.receive_json()
                logging.debug(f"raw from client: {data}")
                action = data["action"]
                message = data.get("message", "")
                group_name = data.get("group_name", "")
                agent = data.get("agent", {})

                agent_names = data.get("agents", "").split(",")
                for name in agent_names:
                    if name and name not in agents:
                        agents[name] = {"status": "inactive", "config": agent}
                if action == "start_agent":
                    logging.info(f"Starting agent: {agent.get('agent_name')}")
                    agent_name = agent.get("agent_name")
                    if agent_name is not None:  # Make sure that agent_name is not None
                        agents[agent_name] = setup_agent(
                            message, agent, send_queue, receive_queue)

                if action == "message_group":
                    logging.info(f"Starting message_group: {message}")
                    group_chat(
                        group_name, message, agents, send_queue, receive_queue)

            else:
                logging.info("Websocket disconnected")
                break

        except WebSocketDisconnect:
            logging.info("WebSocketDisconnect: Websocket disconnected")
            break
        except RuntimeError as e:
            if "Cannot call 'receive' once a disconnect message has been received" in str(e):
                logging.info("RuntimeError:Websocket disconnected")
                break
            else:
                raise e

    del active_chats[chat_id]


@app.post("/agentflow/send_message/{chat_id}")
async def send_message(request: Request, chat_id: str, apiKey: str = Header(None)):
    if apiKey != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")

    print(active_chats)
    print(chat_id)
    if chat_id not in active_chats:
        return JSONResponse(status_code=404, content={"message": "Chat session not found"})

    data = await request.json()
    message = data.get("message")

    websocket = active_chats[chat_id]
    if websocket.client_state == WebSocketState.CONNECTED:
        await websocket.send_json({"message": message})
        return {"message": "Message sent successfully"}
    else:
        return JSONResponse(status_code=410, content={"message": "WebSocket is not connected"})


@app.api_route("/agentflow/profiles/{email}", methods=["GET", "POST", "PUT", "DELETE"])
async def profile_handler(request: Request, email: EmailStr = None):
    if request.method == "POST":
        data = await request.json()
        await create_profile(email, data)
        return {"message": "Profile created successfully"}

    if request.method == "GET":
        profile = await read_profile(email)
        if profile:
            return profile
        else:
            return {"message": "Profile not found"}

    if request.method == "PUT":
        data = await request.json()
        await update_profile(email, data)
        return {"message": "Profile updated successfully"}

    if request.method == "DELETE":
        await delete_profile(email)
        return {"message": "Profile deleted successfully"}

if __name__ == "__main__":
    manager = Manager()
    send_queue = manager.Queue()
    receive_queue = manager.Queue()
    active_agents_instances = manager.dict()
    uvicorn.run(app, host="0.0.0.0", port=33000)
