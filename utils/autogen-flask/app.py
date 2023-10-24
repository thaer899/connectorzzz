import json
import logging
import traceback
import asyncio
from src.team_profiles import TeamProfiles
from src.datamodel import GenerateWebRequest
from fastapi import FastAPI, HTTPException, BackgroundTasks, Response, WebSocket
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from src.custom.multi_task import assistant, user_proxy
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware
from src.autogen import GroupChat, GroupChatManager
from src.custom.manager import Manager
from src.websocket_handler import WebSocketHandler, connected_clients
from src.autogen.agentchat.conversable_agent import ConversableAgent

log_handler = WebSocketHandler()
logger = logging.getLogger()

# Handler for file logging
file_handler = logging.FileHandler('application.log')
file_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(file_formatter)
file_handler.setLevel(logging.DEBUG)
logger.addHandler(file_handler)

# Handler for console logging
console_handler = logging.StreamHandler()
console_formatter = logging.Formatter('%(levelname)s: %(message)s')
console_handler.setFormatter(console_formatter)
console_handler.setLevel(logging.DEBUG)
logger.addHandler(console_handler)

app = FastAPI()

# Add middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

chat_queue = asyncio.Queue()  # Create a shared queue


async def broadcast_message(message: dict):
    for client in connected_clients:
        await client.send_text(json.dumps(message))


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    logger.info("Attempting to accept WebSocket connection...")
    await websocket.accept()
    logger.info("WebSocket connection accepted.")
    logger.info("WebSocket connected")
    connected_clients.append(websocket)
    # Send a test message
    await broadcast_message({"message": "New client connected"})
    try:
        while True:
            data = await websocket.receive_text()
            logger.info(f"Received data from client: {data}")
            await initiate_chat_background(data)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        connected_clients.remove(websocket)
        logger.info("WebSocket disconnected")


async def initiate_chat_background(message: str):
    logger.info(f"initiate_chat_background called with message: {message}")

    def on_update_received(update):
        # This function is called whenever a new update is received.
        logger.info(f"Received update: {update}")
        chat_queue.put_nowait(update)

    # Assume UserProxyAgent has an on_update callback that accepts a function to be called on new updates.
    user_proxy.on_update = on_update_received
    # If initiate_chat is an asynchronous function, await it
    await user_proxy.initiate_chat(
        assistant,
        message=message,
    )
    logger.info("initiate_chat_background completed")


@app.post("/manager")
async def generate(req: GenerateWebRequest) -> Dict:
    """Generate a response from the autogen flow"""
    prompt = req.prompt or "hi there"
    manager = Manager()

    try:
        autogen_response = manager.run_flow(
            prompt=prompt, flow='rag_chat')
        response = {
            "data": autogen_response,
            "status": True
        }
    except Exception as e:
        traceback.print_exc()
        response = {
            "data": str(e),
            "status": False
        }

    return response


@app.post("/team")
async def initiate_chat(req: GenerateWebRequest) -> Dict:
    """Initiate a chat with the autogen flow"""
    prompt = req.prompt

    # Resetting and creating new agents
    team_profiles = TeamProfiles()
    boss = team_profiles.create_boss()
    aid = team_profiles.create_aid()
    coder = team_profiles.create_coder()

    try:
        # Creating a new group chat with the agents
        groupchat = GroupChat(
            agents=[boss, aid, coder],
            messages=[],
            max_round=12,
        )
        manager = GroupChatManager(
            groupchat=groupchat,
            llm_config=team_profiles.llm_config,
            websocket_uri="ws://localhost:33000/ws",
            broadcast_func=broadcast_message
        )

        manager.initiate_chat(
            boss,
            clear_history=False,
            message=prompt,
        )

        response = {
            "data": groupchat.messages,
            "status": True
        }
    except Exception as e:
        traceback.print_exc()
        response = {
            "data": str(e),
            "status": False
        }

    return response
