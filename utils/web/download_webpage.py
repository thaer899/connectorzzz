# filename: download_webpage.py

import requests
from bs4 import BeautifulSoup

url = "https://arxiv.org/abs/2308.08155"
response = requests.get(url)
html_content = response.text

with open("webpage.html", "w") as file:
    file.write(html_content)