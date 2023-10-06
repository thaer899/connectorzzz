import time
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.service import Service


def analyze_website(url):
    # Setup Chrome options to run the browser headlessly
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')

    # Create a new instance of the Chrome driver
    driver = webdriver.Chrome(service=Service(
        ChromeDriverManager().install()), options=options)

    # Go to the website
    driver.get(url)

    # Wait for a few seconds to let the page load
    time.sleep(3)

    # Enable browser logging
    driver.execute_cdp_cmd('Network.enable', {})
    driver.execute_cdp_cmd('Console.enable', {})

    # Define function to extract logs
    def capture_console_logs(driver):
        logs = driver.execute_script("return console.log;")

        for entry in logs:
            print('Console log: ', entry['text'])

    try:
        driver.get(url)
        time.sleep(3)

        # Capture logs
        try:
            capture_console_logs(driver)
        except Exception as e:
            print("An error occurred: ", str(e))

        # Get the page source and create a BeautifulSoup object
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        site_text = soup.get_text(separator=" ")
        print("Website Text Overview:\n", site_text)

    except Exception as e:
        print("An error occurred: ", str(e))

    finally:
        driver.close()


analyze_website('https://thaersaidi.net')
