# broadcast.py

import asyncio

broadcast_queue = asyncio.Queue()


async def broadcast_message(message):
    await broadcast_queue.put(message)
