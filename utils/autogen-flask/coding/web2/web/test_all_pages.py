# filename: test_all_pages.py

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# All the URLs
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

@pytest.fixture(params=urls, ids=urls)
def url(request):
    return request.param

@pytest.fixture
def browser():
    # Setup
    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    yield driver
    # Teardown
    driver.quit()

def test_page_loads(browser, url):
    browser.get(url)
    print(f"Page title: {browser.title}")  # print page title for debug
    assert browser.title != ''  # Check that title is not empty