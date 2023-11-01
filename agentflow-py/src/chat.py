import logging
from concurrent.futures import ProcessPoolExecutor
from functools import partial
import asyncio
from .initialize import run_agents, initiate_group_chat, initiate_agent_chat
from .config import config_list, request_timeout, seed, use_docker, group_name

logging.basicConfig(filename='agent.log', level=logging.DEBUG)


def setup_agent(agent_name, message, send_queue, receive_queue):
    loop = asyncio.get_event_loop()
    pool = ProcessPoolExecutor()
    loop.run_in_executor(
        pool,
        partial(
            run_agents,
            initial_message=message,
            agent_name=agent_name,
            llm_config={
                "request_timeout": request_timeout,
                "seed": seed,
                "config_list": config_list,
                "temperature": 0,
            },
            code_execution_config={
                "work_dir": "workspace",
                "use_docker": use_docker,
                "last_n_messages": 5,
            },
            send_queue=send_queue,
            receive_queue=receive_queue,
        )
    )
    return {
        "status": "active",
        "message": message,
        "agent_name": agent_name
    }


def agent_chat(agent_name, message, send_queue, receive_queue):
    loop = asyncio.get_event_loop()
    pool = ProcessPoolExecutor()
    loop.run_in_executor(
        pool,
        partial(
            initiate_agent_chat,
            message=message,
            agent_name=agent_name,
            llm_config={
                "request_timeout": request_timeout,
                "seed": seed,
                "config_list": config_list,
                "temperature": 0,
            },
            code_execution_config={
                "work_dir": "workspace",
                "use_docker": use_docker,
                "last_n_messages": 5,
            },
            send_queue=send_queue,
            receive_queue=receive_queue,
        )
    )


def group_chat(message, agent_name, agents, send_queue, receive_queue):
    agents_to_initiate_names = agent_name.split(",")
    agents_to_initiate = []
    for name in agents_to_initiate_names:
        agent = agents.get(name)
        if not agent:
            print(
                f"Agent {name} not found in 'agents' dictionary.")
            continue
        agent["agent_name"] = name
        agents_to_initiate.append(agent)

    print("Current agents:", agents.keys())
    loop = asyncio.get_event_loop()
    pool = ProcessPoolExecutor()
    loop.run_in_executor(
        pool,
        partial(
            initiate_group_chat,
            prompt=message,
            group_name=group_name,
            llm_config={
                "request_timeout": request_timeout,
                "seed": seed,
                "config_list": config_list,
                "temperature": 0,
            },
            code_execution_config={
                "work_dir": "workspace",
                "use_docker": use_docker,
                "last_n_messages": 5,
            },
            agents=agents_to_initiate,
            send_queue=send_queue,
            receive_queue=receive_queue
        )
    )
