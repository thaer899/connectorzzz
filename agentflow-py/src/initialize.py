from threading import Thread
from typing import Any, Dict, List
from src.agents.ws_assistant import WebSocketAssistantAgent
from src.agents.ws_user_proxy import WebSocketUserProxyAgent
from src.agents.ws_manager import WebSocketManagerAgent
from autogen import config_list_from_json, AssistantAgent, UserProxyAgent,  GroupChat
from concurrent.futures import ThreadPoolExecutor
import queue
import logging
from threading import Lock

active_agents_lock = Lock()
active_agents_instances = {}
logging.basicConfig(filename='agent.log', level=logging.DEBUG)


def run_agents(
        initial_message: str,
        agent_name: str,
        llm_config: Dict,
        code_execution_config: Dict,
        send_queue: queue.Queue[Any],
        receive_queue: queue.Queue[Any]):

    logging.info(f"Running {agent_name} agent.")

    assistant = WebSocketAssistantAgent(
        name=agent_name,
        system_message=initial_message,
        llm_config=llm_config,
        send_queue=send_queue,
        receive_queue=receive_queue
    )

    assistant.reset()
    return assistant


def initiate_agent_chat(
        message: str,
        agent_name: str,
        llm_config: Dict,
        code_execution_config: Dict,
        send_queue: queue.Queue[Any],
        receive_queue: queue.Queue[Any]):
    user = {"agent_name": "User", "status": "active", "message": """Reply TERMINATE if the task has been solved at full satisfaction.
        Otherwise, reply CONTINUE, or the reason why the task is not solved yet."""}
    agent = {"agent_name": agent_name, "status": "active",
             "message": """Reply TERMINATE if the task has been solved at full satisfaction."""}
    user_proxy = create_instance_proxy(agent=user, code_execution_config=code_execution_config,
                                       llm_config=llm_config, send_queue=send_queue, receive_queue=receive_queue)
    assistant = create_instance_agent(agent=agent, code_execution_config=code_execution_config,
                                      llm_config=llm_config, send_queue=send_queue, receive_queue=receive_queue)
    user_proxy.initiate_chat(assistant, clear_history=True, message=message)


def create_group(
        prompt: str,
        group_name: str,
        llm_config: Dict,
        code_execution_config: Dict,
        agents: Dict,
        send_queue: queue.Queue[Any],
        receive_queue: queue.Queue[Any]):

    logging.info(f"Creating group: {group_name}")
    for agent in agents:
        if agent["message"]:
            agent["message"] = agent["message"].replace(
                "{brand_task}", group_name)
            agent["message"] = agent["message"].replace("{user_task}", prompt)

    # Creating a list of agents for the group chat
    group_agents = [create_instance_proxy(agent=agents[0], code_execution_config=code_execution_config,
                                          llm_config=llm_config, send_queue=send_queue, receive_queue=receive_queue)]
    for agent in agents[1:]:
        logging.info(f"Starting agent: {agent['agent_name']}")
        group_agents.append(create_instance_agent(agent=agent, code_execution_config=code_execution_config,
                            llm_config=llm_config, send_queue=send_queue, receive_queue=receive_queue))
    return group_agents


def initiate_group_chat(
        prompt: str,
        group_name: str,
        llm_config: Dict,
        code_execution_config: Dict,
        agents: Dict,
        send_queue: queue.Queue[Any],
        receive_queue: queue.Queue[Any]):

    group_agents = create_group(
        prompt=prompt,
        group_name=group_name,
        llm_config=llm_config,
        code_execution_config=code_execution_config,
        agents=agents,
        send_queue=send_queue,
        receive_queue=receive_queue,
    )

    groupchat = GroupChat(
        agents=group_agents,
        messages=[],
        max_round=10,
    )

    manager = WebSocketManagerAgent(
        groupchat=groupchat,
        name="Manager",
        llm_config=llm_config,
        max_consecutive_auto_reply=5,
        send_queue=send_queue,
        receive_queue=receive_queue,
    )

    logging.info(f"Group chat...{groupchat}")
    logging.info(f"group_agents...{group_agents}")

    group_agents[0].initiate_chat(
        manager,
        clear_history=True,
        message=prompt
    )

    # for msg in groupchat.messages:
    #     receive_queue.put(msg)
    #     logging.info(f"Added message to client_receive_queue...{msg}")

    #     def check_send_queue():
    #         while True:
    #             if not send_queue.empty():
    #                 item = send_queue.get()
    #                 logging.info(
    #                     f"Sending group message: {item['message']} to {item['sender']}")
    #                 manager.send(item['message'], item['sender'])

    # # Start the check_send_queue function in a separate thread
    # thread = Thread(target=check_send_queue)
    # thread.start()

    # return groupchat


def create_instance_agent(agent, code_execution_config, llm_config, send_queue, receive_queue):
    instance_agent = WebSocketAssistantAgent(
        name=agent['agent_name'],
        is_termination_msg=termination_msg,
        system_message=agent['message'],
        llm_config=llm_config,
        code_execution_config=code_execution_config,
        send_queue=send_queue,
        receive_queue=receive_queue
    )
    return instance_agent


def create_instance_proxy(agent, code_execution_config, llm_config, send_queue, receive_queue):
    instance_agent = WebSocketUserProxyAgent(
        name=agent['agent_name'],
        is_termination_msg=termination_msg,
        system_message=agent['message'],
        human_input_mode="NEVER",
        llm_config=llm_config,
        code_execution_config=code_execution_config,
        send_queue=send_queue,
        receive_queue=receive_queue,
        default_auto_reply="",
        function_map={},
        max_consecutive_auto_reply=5
    )
    return instance_agent


def termination_msg(x): return isinstance(
    x, dict) and "TERMINATE" == str(x.get("content", ""))[-9:].upper()


def get_active_agents_by_name(agents: Dict) -> List[str]:
    """Get names of all agents with status set to active."""
    return [agent['agent_name'] for agent in agents if agent['status'] == 'active']
