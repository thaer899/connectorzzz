# filename: check_env.py

import sys
import subprocess
import requests

def check_python_version():
    print(f"Python version: {sys.version}")

def check_installed_packages():
    packages = ['pytest', 'selenium', 'webdriver_manager', 'lxml']
    for package in packages:
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'show', package])
        except subprocess.CalledProcessError:
            print(f'Package \'{package}\' not found.')

def check_network():
    url = 'https://thaersaidi.net'
    try:
        response = requests.get(url)
        print(f'{url} reached. Status code: {response.status_code}')
    except requests.exceptions.RequestException as err:
        print (f"Error occurred reaching {url}: {err}")

def main():
    check_python_version()
    check_installed_packages()
    check_network()

if __name__ == "__main__":
    main()