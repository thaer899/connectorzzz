# filename: extract_urls.py

import requests
from xml.etree import ElementTree

# URL of the sitemap
url = 'https://thaersaidi.net/sitemap.xml'

# Send HTTP request
response = requests.get(url)

# Parse XML
root = ElementTree.fromstring(response.content)

# Extract all URLs from the sitemap
urls = [url.text for url in root.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]

# Print the URLs
for url in urls:
    print(url)