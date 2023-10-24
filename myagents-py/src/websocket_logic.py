import json
import logging
import asyncio
from starlette.websockets import WebSocketState

SENTINEL = "TERMINATE"


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
        team_profiles.initiate_team_chat(data, chat_id)
        team_profiles.processing_done_event.set()


def handle_incoming_data(data):
    if not data:
        logging.warning("Received empty data. Skipping...")
        return None

    if data.startswith("{") or data.startswith("["):
        try:
            deserialized_data = json.loads(data)
        except json.JSONDecodeError:
            logging.error(f"Failed to decode JSON from data: {data}")
            return None
    else:
        deserialized_data = data

    return deserialized_data


async def process_websocket_data(websocket, team_profiles):
    while True:
        data = await websocket.receive_text()
        deserialized_data = handle_incoming_data(data)
        if deserialized_data is None:
            continue

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
