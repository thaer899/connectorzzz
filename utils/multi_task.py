import openai
from dotenv import load_dotenv
import subprocess
import sys
import os
from autogen import AssistantAgent, UserProxyAgent
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import requests

# Initialize the WebDriver using WebDriver Manager
# driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))


def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])


install('selenium')

# Use Environment Variable for API Key

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')

if api_key is None:
    raise ValueError("API Key not found!")

openai.api_key = api_key

config_list = [
    {
        'model': 'gpt-3.5-turbo',
        'api_key': api_key,
    }
]

llm_config = {
    "request_timeout": 600,
    "seed": 42,
    "config_list": config_list,
    "temperature": 0,
}

code_execution_config = {"work_dir": "web"}

# create an AssistantAgent instance named "assistant"
assistant = AssistantAgent(
    name="assistant",
    llm_config=config_list,
)
# create a UserProxyAgent instance named "user_proxy"
user_proxy = UserProxyAgent(
    name="user_proxy",
    human_input_mode="TERMINATE",
    max_consecutive_auto_reply=10,
    is_termination_msg=lambda x: x.get(
        "content", "").rstrip().endswith("TERMINATE"),
    code_execution_config={"work_dir": "web"},
    llm_config=config_list,
    system_message="""Reply TERMINATE if the task has been solved at full
    satisfaction. Otherwise, reply CONTINUE, or the reason why the task is not
    solved yet."""
)

user_proxy.initiate_chat(
    assistant,
    message="""
Analyze this: https://thaersaidi.net , give me a summary of the site
mention top skills and where they were used and how they were aquired.
""",
)
