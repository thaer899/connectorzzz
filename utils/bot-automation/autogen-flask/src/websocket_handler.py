import threading
import asyncio
import logging

connected_clients = []


class WebSocketHandler(logging.Handler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.loop = asyncio.new_event_loop()
        self.thread = threading.Thread(
            target=self.start_loop, args=(self.loop,), daemon=True)
        self.thread.start()

    def start_loop(self, loop):
        asyncio.set_event_loop(loop)
        loop.run_forever()

    def emit(self, record):
        log_entry = self.format(record)
        self.loop.call_soon_threadsafe(self.async_emit, log_entry)

    async def async_emit(self, log_entry):
        # Using a copy of the list to avoid modification during iteration
        for client in list(connected_clients):
            try:
                await client.send_text(log_entry)
            except Exception as e:
                connected_clients.remove(client)
                logging.error(f"Error sending log to client: {e}")
