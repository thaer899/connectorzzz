import asyncio
from multiprocessing import Manager
import queue
import uuid
import logging
from fastapi.websockets import WebSocketState
import openai
import uvicorn
from fastapi import FastAPI, WebSocket, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocketDisconnect
from src.config import API_KEY, OPENAI_API_KEY
from src.chat import setup_agent, agent_chat, group_chat

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
                action = data.get("action")
                agent_name = data.get("agent_name")
                message = data.get("message")

                agent_names = data.get("agent_name").split(",")
                for name in agent_names:
                    if name and name not in agents:
                        agents[name] = {"status": "inactive"}

                if action == "start_agent":
                    logging.info(f"Starting agent: {agent_name}")
                    agents[agent_name] = setup_agent(
                        agent_name, message, send_queue, receive_queue)

                if action == "send_message":
                    logging.info(f"Starting send_message: {message}")
                    agent_chat(
                        agent_name, message, send_queue, receive_queue)

                if action == "message_group":
                    logging.info(f"Starting message_group: {message}")
                    group_chat(
                        message, agent_name, agents, send_queue, receive_queue)

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

if __name__ == "__main__":
    manager = Manager()
    send_queue = manager.Queue()
    receive_queue = manager.Queue()
    active_agents_instances = manager.dict()
    uvicorn.run(app, host="0.0.0.0", port=33000)
