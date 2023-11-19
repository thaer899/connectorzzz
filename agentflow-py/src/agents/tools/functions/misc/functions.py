import requests
from src.db import read_profile
from src.agents.tools.driver_manager import DriverManager
from src.config import GITHUB_TOKEN
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from contextlib import contextmanager
from src.config import SELENIULM_LOCAL


async def get_user_profile(email, username=None):
    profile = await read_profile(email)
    if profile:
        return profile
    else:
        return {"message": "Profile not found"}


@contextmanager
def get_driver_context(local=False):
    driver_manager = DriverManager()
    driver_instance = driver_manager.get_driver(local=local)
    try:
        yield driver_instance
    finally:
        print("Running driver")


def browse_web(url):
    try:
        with get_driver_context(local=SELENIULM_LOCAL) as driver:
            driver.get(url)
            return f'${url} opened successfully'
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
