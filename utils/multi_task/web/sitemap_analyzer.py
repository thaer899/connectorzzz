# filename: sitemap_analyzer.py
import requests
from xml.etree import ElementTree as ET

sitemap_url = "https://thaersaidi.net/sitemap.xml"
sitemap_data = requests.get(sitemap_url)

if sitemap_data.status_code == 200:
    root = ET.fromstring(sitemap_data.content)
    print(f"Number of URLs in sitemap: {len(root)}")
    print("Some URLs from the sitemap:")
    for url in root[:10]:
        print(url[0].text)
else:
    print(f"Failed to download sitemap: {sitemap_data.status_code}")