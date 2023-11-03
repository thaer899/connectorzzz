import json
from typing import Callable, Union, Dict, Optional
import logging
from ..util import get_name
from .default.user_proxy_agent import UserProxyAgent
from .default.agent import Agent


logging.basicConfig(filename='agent.log', level=logging.DEBUG)


class WebSocketUserProxyAgent(UserProxyAgent):
    def __init__(self, name: str, send_queue, receive_queue, is_termination_msg, max_consecutive_auto_reply, human_input_mode, function_map, code_execution_config, default_auto_reply, llm_config, system_message):
        super().__init__(name, is_termination_msg, max_consecutive_auto_reply, human_input_mode,
                         function_map, code_execution_config, default_auto_reply, llm_config, system_message)
        self.send_queue = send_queue
        self.receive_queue = receive_queue
        self.is_termination_msg = is_termination_msg
        self.max_consecutive_auto_reply = max_consecutive_auto_reply
        self.human_input_mode = human_input_mode
        self.code_execution_config = code_execution_config
        self.llm_config = llm_config

    def get_human_input(self, message):
        logging.info(
            f"WebSocketAssistantAgent: Received agent output: {message}")
        self.receive_queue.put(message)
        human_message = self.send_queue.get()
        logging.info(
            f"WebSocketAssistantAgent: Sending human message: {human_message}")
        return human_message["content"]

    def receive(
            self,
            message: Union[Dict, str],
            sender: Agent,
            request_reply: Optional[bool] = None,
            silent: Optional[bool] = False
    ):
        logging.info(
            f"Human received message: {message} from {sender.name}")

        logging.info(f"Sender {sender.name}")
        if sender.name == 'Manager':
            logging.info(f"Manager Sending message: {message}")
            self.send_queue.put(message)
        if sender.name != 'Manager':
            logging.info(f"Agent Sending message: {message}")
            self.send_queue.put({
                "message": message,
                "sender": sender.name
            })
        super().receive(message, sender, request_reply, silent)
