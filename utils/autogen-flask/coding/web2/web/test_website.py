# filename: test_website.py

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

@pytest.fixture
def browser():
    # Setup
    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    yield driver
    # Teardown
    driver.quit()

def test_home_page_loads(browser):
    browser.get('https://thaersaidi.net')
    print(f"Page title: {browser.title}")  # print page title for debug
    assert 'Thaer saidi' in browser.title  # adjust if necessary based on the actual title