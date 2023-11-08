import logging
from concurrent.futures import ProcessPoolExecutor
from functools import partial
import asyncio
from .initialize import run_agent, initiate_group_chat

logging.basicConfig(filename='agent.log', level=logging.DEBUG)


def setup_agent(message, agent, send_queue, receive_queue):
    loop = asyncio.get_event_loop()
    pool = ProcessPoolExecutor()
    loop.run_in_executor(
        pool,
        partial(
            run_agent,
            initial_message=message,
            agent_name=agent["agent_name"],
            send_queue=send_queue,
            receive_queue=receive_queue,
        )
    )
    return {
        "status": "active",
        "config": agent
    }


def group_chat(group_name, message, agents, send_queue, receive_queue):
    loop = asyncio.get_event_loop()
    pool = ProcessPoolExecutor()
    loop.run_in_executor(
        pool,
        partial(
            initiate_group_chat,
            group_name=group_name,
            prompt=message,
            agents=agents,
            send_queue=send_queue,
            receive_queue=receive_queue
        )
    )
