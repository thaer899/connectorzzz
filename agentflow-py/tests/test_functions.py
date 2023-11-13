import os
import sys
import requests
from src.agents.tools.driver_manager import DriverManager
from src.config import GITHUB_TOKEN
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from contextlib import contextmanager
from src.config import SELENIULM_LOCAL
print(sys.path)


def read_file(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            return file.read()
    else:
        return None


@contextmanager
def get_driver_context(local=False):
    driver_manager = DriverManager()
    driver_instance = driver_manager.get_driver(local=local)
    try:
        yield driver_instance
    finally:
        driver_manager.close_driver(driver_instance)


def test_browse_web(url="https://console.thaersaidi.net/playground"):
    try:
        with get_driver_context(local=SELENIULM_LOCAL) as driver:
            driver.get(url)

            # Wait for the body of the page to be loaded
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body")))

            # Find the main content div and get its text
            main_content = driver.find_element(By.ID, "content")
            main_text = main_content.text

            print(main_text)
    except Exception as e:
        return f"Error accessing {url}: {e}"
