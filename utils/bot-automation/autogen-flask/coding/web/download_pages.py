# filename: download_pages.py

import requests
import json

# Fetch the sitemap
sitemap_response = requests.get('https://thaersaidi.net/sitemap.txt')
assert sitemap_response.status_code == 200, "Unable to fetch the sitemap."

# Parse the sitemap into a list of URLs
sitemap = sitemap_response.text.splitlines()

# Process each URL
for url_index, url in enumerate(sitemap):
    # Fetch the page
    response = requests.get(url)
    assert response.status_code == 200, f"Unable to fetch page at '{url}'."

    # Parse the page data into json
    page_data = response.json()

    # Store the json data in a file
    with open(f"page_{url_index}.json", 'w') as f:
        json.dump(page_data, f)