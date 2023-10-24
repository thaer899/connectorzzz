from .user_proxy_agent import UserProxyAgent


class UserProxyWebAgent(UserProxyAgent):
    def __init__(self, client_sent_queue=None, client_receive_queue=None, *args, **kwargs):
        super(UserProxyWebAgent, self).__init__(*args, **kwargs)
        self.client_sent_queue = client_sent_queue
        self.client_receive_queue = client_receive_queue

    def get_human_input(self, prompt: str) -> str:
        last_message = self.last_message()
        if last_message:
            self.client_receive_queue.put(last_message)
            reply = self.client_sent_queue.get(block=True)
            if reply == "exit":
                self.client_receive_queue.put("exit")
            return reply
        else:
            return

    # def initiate_chat(self, recipient, clear_history=True, silent=False, **context):
    #     super().initiate_chat(recipient, clear_history, silent, **context)
    #     initial_message = self.last_message()
    #     if initial_message:
    #         self.client_receive_queue.put(initial_message)

    # def send(self, message, recipient, request_reply=None, silent=False):
    #     super().send(message, recipient, request_reply, silent)
    #     # if message and isinstance(message, dict):
    #     #     self.client_receive_queue.put(message)

    def send_message(self, message):
        """Handle the incoming message and add it to the queue."""
        self.client_sent_queue.put(message)
