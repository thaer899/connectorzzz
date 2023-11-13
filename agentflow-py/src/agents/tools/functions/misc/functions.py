import os
import requests
from src.agents.tools.driver_manager import DriverManager
from src.config import GITHUB_TOKEN
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from contextlib import contextmanager
from src.config import SELENIULM_LOCAL


def read_file(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            return file.read()
    else:
        return None


def spr_writer(data):
    file_path = os.path.join(os.path.dirname(__file__), 'data/system.md')
    content = read_file(file_path)
    if content:
        # Process the content to create an SPR
        spr = f"{content}\n\n{data}"
        return spr
    else:
        return "File not found or empty"


def spr_reader(data):
    file_path = os.path.join(os.path.dirname(__file__), 'data/unpack.md')
    content = read_file(file_path)
    if content:
        spr = f"{content}\n\n{data}"
        return spr
    else:
        return "File not found or empty"


def get_user_profile(username, email):
    # Implement the logic to fetch user profile
    # For demonstration, returning a mock profile
    return {
        "username": username,
        "email": email,
        "profile": "User profile information"
    }


@contextmanager
def get_driver_context(local=False):
    driver_manager = DriverManager()
    driver_instance = driver_manager.get_driver(local=local)
    try:
        yield driver_instance
    finally:
        driver_manager.close_driver(driver_instance)


def browse_web(url):
    try:
        with get_driver_context(local=SELENIULM_LOCAL) as driver:
            driver.get(url)

            # Wait for the body of the page to be loaded
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body")))

            # Find the main content div and get its text
            main_content = driver.find_element(By.ID, "content")
            main_text = main_content.text

            return main_text
    except Exception as e:
        return f"Error accessing {url}: {e}"


def browse_spa_web(url):
    try:
        with get_driver_context(local=SELENIULM_LOCAL) as driver:
            driver.get(url)

            # Wait for the marquee element to be visible
            WebDriverWait(driver, 20).until(
                EC.visibility_of_all_elements_located((By.CSS_SELECTOR, "em.marquee")))

            # Execute JavaScript to retrieve the marquee content
            marquee_content = driver.execute_script(
                "return document.querySelector('em.marquee').innerText;")
            blockquote_content = driver.execute_script(
                "return document.querySelector('blockquote').innerText;")

            return {"quote": marquee_content, "content": blockquote_content}
    except Exception as e:
        return f"Error accessing {url}: {e}"


def invoke_github_actions_pipeline(repository, workflow_id, token=GITHUB_TOKEN, ref='master', inputs={}):
    url = f"https://api.github.com/repos/thaer899/{repository}/actions/workflows/{workflow_id}/dispatches"

    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }

    # Configure inputs and ref as part of the request body
    data = {
        "ref": ref,
        "inputs": inputs
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return {"status": "Pipeline invoked successfully", "repository": repository, "workflow_id": workflow_id}
    except requests.RequestException as e:
        return {"status": f"Error invoking pipeline: {e}", "repository": repository, "workflow_id": workflow_id}
