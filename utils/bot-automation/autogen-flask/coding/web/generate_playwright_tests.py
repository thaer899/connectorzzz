# filename: generate_playwright_tests.py

import os
import requests
from bs4 import BeautifulSoup

# site to be crawled
sitemap_url = "https://thaersaidi.net/sitemap.xml"

response = requests.get(sitemap_url)
xml = response.content

soup = BeautifulSoup(xml, 'html.parser')
urls = [element.text for element in soup.findAll('loc')]

# assuming Playwright is installed at /usr/local/bin/
playwright_path = "/usr/local/bin/playwright"
tests_directory = "playwright_tests"

# create directory to store test files
if not os.path.exists(tests_directory):
    os.makedirs(tests_directory)

for i, url in enumerate(urls):
    test_filename = os.path.join(tests_directory, f"test_{i}.js")
    with open(test_filename, "w") as file:
        file.write(f"""
const playwright = require('{playwright_path}');

(async () => {{
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('{url}');
  // Add more tests here
  await browser.close();
}})();
""")
    print(f"Generated: {test_filename}")