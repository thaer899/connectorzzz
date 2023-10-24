# filename: simple_site_test.py
import re
import urllib.request
import xml.etree.ElementTree as ET

sitemap_url = "https://thaersaidi.net/sitemap.xml"
sitemap_data = urllib.request.urlopen(sitemap_url)

if sitemap_data.getcode() == 200:
    sitemap_xml = sitemap_data.read()
    root = ET.fromstring(sitemap_xml)

    for url in root:
        page_url = url[0].text
        try:
            page_data = urllib.request.urlopen(page_url)
            if page_data.getcode() == 200:
                print(f"SUCCESS: {page_url}")
            else:
                print(f"ERROR {page_data.getcode()}: {page_url}")
        except Exception as e:
            print(f"FAILURE: {page_url} - {str(e)}")
else:
    print(f"Failed to download sitemap: {sitemap_data.getcode()}")