import json
import os
from threading import Thread
from typing import Any, Dict, List
from src.agents.ws_assistant import WebSocketAssistantAgent
from src.agents.ws_user_proxy import WebSocketUserProxyAgent
from src.agents.ws_manager import WebSocketManagerAgent
from src.agents.tools.functions import get_user_profile, browse_web, invoke_github_actions_pipeline, register_functions, read_file
from autogen import config_list_from_json, AssistantAgent, UserProxyAgent,  GroupChat
from concurrent.futures import ThreadPoolExecutor
import queue
import logging
from threading import Lock
from .config import config_list, request_timeout, seed

active_agents_lock = Lock()
active_agents_instances = {}
logging.basicConfig(filename='agent.log', level=logging.DEBUG)


def run_agent(
        initial_message: str,
        agent_name: str,
        send_queue: queue.Queue[Any],
        receive_queue: queue.Queue[Any]):

    logging.info(f"Running {agent_name} agent.")

    assistant = WebSocketAssistantAgent(
        name=agent_name,
        system_message=initial_message,
        send_queue=send_queue,
        receive_queue=receive_queue
    )

    assistant.reset()
    return assistant


def initiate_group_chat(
        group_name: str,
        prompt: str,
        agents: Dict,
        send_queue: queue.Queue[Any],
        receive_queue: queue.Queue[Any]):

    group_agents = create_group(
        group_name=group_name,
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
        llm_config={
            "request_timeout": request_timeout,
            "seed": seed,
            "config_list": config_list,
            "temperature": 0
        },
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


def create_group(
        group_name: str,
        agents: Dict,
        send_queue: queue.Queue[Any],
        receive_queue: queue.Queue[Any]):

    logging.info(f"Creating group: {group_name}")

    proxy = agents.get(next(iter(agents)))
    print(f"proxy: {proxy}")
    assistants = {k: v for k, v in agents.items() if k != proxy}
    print(f"assistants: {assistants}")

    # Creating a list of agents for the group chat
    group_agents = [create_instance_proxy(
        agent=proxy["config"], send_queue=send_queue, receive_queue=receive_queue)]

    for agent_key, agent_value in assistants.items():
        print(f"Starting agent: {agent_key}")
        group_agents.append(create_instance_agent(
            agent=agent_value["config"], send_queue=send_queue, receive_queue=receive_queue))
    return group_agents


def create_instance_agent(agent, send_queue, receive_queue):
    llm_config = agent.get("config", {}).get('llm_config', {})
    code_execution_config = agent.get(
        "config", {}).get('code_execution_config', {})

    file_path = os.path.join(os.path.dirname(
        __file__), 'agents/tools/data/functions.json')
    content = read_file(file_path)
    logging.info(f"content functions.json: {content}")
    llm_config["functions"] = json.loads(content) if content else []

    instance_agent = WebSocketAssistantAgent(
        name=agent.get("agent_name"),
        is_termination_msg=termination_msg,
        system_message=agent.get("message"),
        llm_config=llm_config,
        code_execution_config=code_execution_config,
        send_queue=send_queue,
        receive_queue=receive_queue,
        function_map={
        }
    )

    register_functions(instance_agent)
    return instance_agent


def create_instance_proxy(agent, send_queue, receive_queue):
    llm_config = agent.get("config", {}).get('llm_config', {})
    code_execution_config = agent.get(
        "config", {}).get('code_execution_config', {})

    file_path = os.path.join(os.path.dirname(
        __file__), 'agents/tools/data/functions.json')
    content = read_file(file_path)
    logging.info(f"content XXXX: {content}")
    llm_config["functions"] = json.loads(content) if content else []

    instance_agent = WebSocketUserProxyAgent(
        name=agent.get("agent_name"),
        is_termination_msg=termination_msg,
        system_message=agent.get("message"),
        human_input_mode="NEVER",
        llm_config=llm_config,
        code_execution_config=code_execution_config,
        send_queue=send_queue,
        receive_queue=receive_queue,
        default_auto_reply="",
        max_consecutive_auto_reply=5,
        function_map={
        }
    )
    register_functions(instance_agent)
    return instance_agent


def termination_msg(x): return isinstance(
    x, dict) and "TERMINATE" == str(x.get("content", ""))[-9:].upper()


def get_active_agents_by_name(agents: Dict) -> List[str]:
    """Get names of all agents with status set to active."""
    return [agent['agent_name'] for agent in agents if agent['status'] == 'active']
