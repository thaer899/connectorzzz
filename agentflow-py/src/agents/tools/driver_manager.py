from selenium import webdriver
from selenium.webdriver import FirefoxOptions, ChromeOptions
from src.config import SELENIUM_BROWSER, SELENIULM_REMOTE_URL


class DriverManager:

    def __init__(self):
        self.remote_url = SELENIULM_REMOTE_URL
        self.browser_name = SELENIUM_BROWSER
        self.browser_options_map = {
            "firefox": FirefoxOptions,
            "chrome": ChromeOptions
        }

    def driver(self, local=False):
        self.browser_name = SELENIULM_LOCAL
        driver_manager = DriverManager()
        if local:
            driver_instance = driver_manager.get_driver(local=True)
        else:
            driver_instance = driver_manager.get_driver()
        yield driver_instance
        driver_manager.close_driver(driver_instance)

    def get_driver(self, local=False):
        """Initialize and return a webdriver instance based on the browser name and mode (local/remote)."""
        return self._create_driver(local=local)

    def close_driver(self, driver):
        """Close the provided webdriver instance."""
        if driver:
            driver.quit()

    def _create_driver(self, local=False):
        """Create and return a webdriver instance."""
        if self.browser_name not in self.browser_options_map:
            raise ValueError(f"Unsupported browser: {self.browser_name}")

        options = self.browser_options_map[self.browser_name]()

        if local:
            driver_class = getattr(webdriver, self.browser_name.capitalize())
            driver = driver_class(options=options)

        else:
            driver = webdriver.Remote(
                command_executor=self.remote_url,
                options=options
            )

        print("Driver instance:", driver)
        return driver
