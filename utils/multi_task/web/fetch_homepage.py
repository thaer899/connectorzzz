# filename: fetch_homepage.py
import urllib.request

homepage_url = "https://thaersaidi.net"
homepage_data = urllib.request.urlopen(homepage_url)

if homepage_data.getcode() == 200:
    print(homepage_data.read())
else:
    print(f"Failed to download homepage: {homepage_data.getcode()}")