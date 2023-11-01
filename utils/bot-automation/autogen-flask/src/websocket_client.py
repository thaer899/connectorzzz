import asyncio
import websockets
import json


class WebSocketClient:
    def __init__(self, uri):
        self.uri = uri
        self.websocket = None
        asyncio.get_event_loop().run_until_complete(self.connect())

    async def connect(self):
        self.websocket = await websockets.connect(self.uri)

    async def send_message(self, message):
        if self.websocket is None:
            await self.connect()
        await self.websocket.send(json.dumps(message))

    def send(self, message):
        asyncio.get_event_loop().run_until_complete(self.send_message(message))
