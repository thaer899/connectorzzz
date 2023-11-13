from typing import Any, Dict, List
from src.agents.ws_assistant import WebSocketAssistantAgent
from src.agents.ws_manager import WebSocketManagerAgent
from autogen import GroupChat
import queue
import logging
from threading import Lock
from .config import config_list, request_timeout, seed
from src.agents.ws_assistant import WebSocketAssistantAgent
from src.agents.ws_user_proxy import WebSocketUserProxyAgent
import logging
import os
from src.agents.tools.functions.misc.functions import read_file
import json
from src.agents.tools.register_functions import get_functions, register_functions


active_agents_lock = Lock()
active_agents_instances = {}
logging.basicConfig(filename='agent.log', level=logging.DEBUG)


def termination_msg(x): return isinstance(
    x, dict) and "TERMINATE" == str(x.get("content", ""))[-9:].upper()


def run_agent(
        initial_message: str,
        agent_name: str,
        send_queue: queue.Queue[Any],
        receive_queue: queue.Queue[Any]):

    logging.info(f"Running {agent_name} agent.")

    agent = WebSocketAssistantAgent(
        name=agent_name,
        system_message=initial_message,
        send_queue=send_queue,
        receive_queue=receive_queue
    )

    agent.reset()
    return agent


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
    assistants = {k: v for k, v in agents.items() if k != proxy}

    # Creating a list of agents for the group chat
    group_agents = [create_instance_proxy(
        agent=proxy["config"], send_queue=send_queue, receive_queue=receive_queue)]

    for agent_key, agent_value in assistants.items():
        print(f"Starting agent: {agent_key}")
        group_agents.append(create_instance_agent(
            agent=agent_value["config"], send_queue=send_queue, receive_queue=receive_queue))
    return group_agents


def get_active_agents_by_name(agents: Dict) -> List[str]:
    """Get names of all agents with status set to active."""
    return [agent['agent_name'] for agent in agents if agent['status'] == 'active']


def create_instance_proxy(agent, send_queue, receive_queue):
    llm_config, code_execution_config, agent_functions = agent_config(agent)
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


def create_instance_agent(agent, send_queue, receive_queue):
    llm_config, code_execution_config, agent_functions = agent_config(agent)

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

    register_functions(instance_agent, agent_functions)
    return instance_agent


def agent_config(agent):
    llm_config = agent.get("config", {}).get('llm_config', {})
    code_execution_config = agent.get(
        "config", {}).get('code_execution_config', {})

    # Extract function names from llm_config
    function_names = agent.get("config", {}).get('functions', [])

    agent_functions = get_functions(function_names)

    for agent in agent_functions:
        agent.pop('location', None)

    llm_config["functions"] = agent_functions

    return llm_config, code_execution_config, agent_functions
