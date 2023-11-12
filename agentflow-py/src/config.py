import openai
import os
from dotenv import load_dotenv

load_dotenv()


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
API_KEY = os.getenv('API_KEY')
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
SELENIULM_REMOTE_URL = os.getenv('SELENIULM_REMOTE_URL')
SELENIUM_BROWSER = os.getenv('SELENIUM_BROWSER')
SELENIULM_LOCAL_DRIVER = os.getenv('SELENIULM_LOCAL_DRIVER')
SELENIULM_LOCAL = os.getenv('SELENIULM_LOCAL')

config_list = [{'model': 'gpt-4-1106-preview'}]
request_timeout = 300
seed = 42
