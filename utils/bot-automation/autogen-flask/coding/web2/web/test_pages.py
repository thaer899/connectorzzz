# filename: test_pages.py

from selenium import webdriver
from selenium.webdriver.firefox.options import Options

options = Options()
options.headless = True
urls = [
    'https://thaersaidi.net',
    'https://thaersaidi.net/education',
    'https://thaersaidi.net/employment',
    'https://thaersaidi.net/interests',
    'https://thaersaidi.net/languages',
    'https://thaersaidi.net/skills',
    'https://thaersaidi.net/references',
    'https://thaersaidi.net/ask',
]
driver = webdriver.Firefox(options=options)
try:
    for url in urls:
        print(f"Loading {url}")
        driver.get(url)
        print(f"Page title: '{driver.title}'")
finally:
    print("Closing the driver.")
    driver.quit()
