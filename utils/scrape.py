import time
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.service import Service
import requests
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

options = webdriver.ChromeOptions()
options.add_argument('--log-level=3')  # Suppressing logs
# Enabling headless mode can speed up things
options.add_argument('--headless')

driver = webdriver.Chrome(service=Service(
    ChromeDriverManager().install()), options=options)


def analyze_website(base_url, path=None):
    try:
        full_url = base_url if path is None else base_url + path
        driver.get(full_url)

        if path:
            # Your SPA might need additional time to handle the route and render the content
            WebDriverWait(driver, 10).until(EC.presence_of_element_located(
                (By.CSS_SELECTOR, "marquee"))
            )

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        site_text = soup.get_text(separator=" ")
        print(
            f"Website Text Overview of {full_url}:\n", site_text[:500], "...")

    except Exception as e:
        print("An error occurred: ", str(e))


def get_urls_from_sitemap(sitemap_url):
    response = requests.get(sitemap_url)
    if response.status_code == 200:
        print("Sitemap Snippet:\n", response.text[:500])
        soup = BeautifulSoup(response.text, 'xml')
        urls = [loc.text for loc in soup.find_all("loc")]
        print("Extracted URLs:", urls)
        return urls
    else:
        print(f"Failed to fetch sitemap: {response.status_code}")
        return []


# Example usage:
sitemap_url = 'https://thaersaidi.net/sitemap.xml'
urls = get_urls_from_sitemap(sitemap_url)

try:
    for url in urls:
        analyze_website(url)
        time.sleep(2)  # Optional: To prevent hitting server too hard
finally:
    driver.close()  # Ensure driver closes even if loop is interrupted
