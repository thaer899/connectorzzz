# filename: web_scrape.py

import requests
from bs4 import BeautifulSoup

def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Assuming the skills, where they were used, and how they were acquired are 
    # in text paragraphs (<p> tags) or list items (<li> tags on the website)
    text_blocks = soup.find_all(['p', 'li'])
    
    skills = []
    for block in text_blocks:
        skills.append(block.text)

    for i, skill in enumerate(skills, start=1):
        print(f"[{i}] {skill}")

# Replace with the website URL to be scraped.
url = "https://thaersaidi.net"
scrape_website(url)