from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class WebBrowserManager:
    def __init__(self):
        self.driver = None

    def open_browser(self):
        # Initialize the WebDriver instance if it's not already open
        if self.driver is None:
            self.driver = webdriver.Chrome()  # or use any other browser
        else:
            print("Browser is already open.")

    def browse_web(self, url):
        try:
            if self.driver is None:
                print("Browser is not open. Please call open_browser() first.")
                return

            self.driver.get(url)
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body")))
            main_content = self.driver.find_element(By.ID, "content")
            main_text = main_content.text
            return main_text
        except Exception as e:
            return f"Error accessing {url}: {e}"

    def close_browser(self):
        if self.driver is not None:
            self.driver.quit()
            self.driver = None
        else:
            print("Browser is not open.")
