import openai
import os
from dotenv import load_dotenv

load_dotenv()


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
API_KEY = os.getenv('API_KEY')

llm_config = {
    "request_timeout": 300,
    "seed": 42,
    "config_list": [{'model': 'gpt-3.5-turbo'}],
    "temperature": 0,
},
code_execution_config = {
    "work_dir": "workspace",
    "use_docker": False,
    "last_n_messages": 5,
}
group_name = "Connectorzzz"
