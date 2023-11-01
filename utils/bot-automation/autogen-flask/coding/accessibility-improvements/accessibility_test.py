# filename: accessibility_test.py

from selenium import webdriver
from axe_selenium_python import Axe

def test_accessibility():
    driver = webdriver.Firefox()
    driver.get('http://thaersaidi.net')

    axe = Axe(driver)
    axe.inject()

    results = axe.run()
    axe.write_results(results, 'accessibility_report.json')

    driver.close()