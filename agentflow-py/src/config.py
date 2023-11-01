import openai
import os
from dotenv import load_dotenv

load_dotenv()


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
API_KEY = os.getenv('API_KEY')

group_name = "Connectorzzz"
config_list = [{'model': 'gpt-3.5-turbo'}]
request_timeout = 300
seed = 42
use_docker = True
