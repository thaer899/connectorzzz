# filename: extract_urls.py

import requests
from bs4 import BeautifulSoup

# Send a GET request to the site map
response = requests.get('https://thaersaidi.net/sitemap.xml')

# Parse the XML content
soup = BeautifulSoup(response.content, 'lxml')

# Extract URLs from <loc> tags
urls = [elem.text for elem in soup.select('loc')]

# Print all the URLs
print('\n'.join(urls))