# filename: analyze_sitemap.py

import requests
from bs4 import BeautifulSoup

def load_sitemap(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'xml')
    urls = [element.text for element in soup.findAll('loc')]
    return urls

sitemap_url = 'https://thaersaidi.net/sitemap.xml'

urls = load_sitemap(sitemap_url)
for url in urls:
    print(url)