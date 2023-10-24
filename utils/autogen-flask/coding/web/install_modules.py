# filename: install_modules.py

import subprocess
import sys

try:
    import requests
    import bs4
    import lxml
    print("All modules are all ready installed.")
except ImportError:
    print("Installing missing modules...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "beautifulsoup4", "lxml"])