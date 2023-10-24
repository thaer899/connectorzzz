# filename: generate_tests.py
import os
from playwright.sync_api import sync_playwright

# Set up Playwright
playwright = sync_playwright().start()
browser = playwright.chromium.launch()
context = browser.new_context()
page = context.new_page()

# Navigate to the website
page.goto('https://thaersaidi.net')

# Generate tests for the homepage
tests = page.evaluate('''() => {
    // Your test generation logic here
    // Use Playwright's API to interact with the page and generate tests
    // For example, you can check if certain components exist, interact with them, etc.
    // You can also make external API calls to ai.thaersaidi.net and test the responses
    // Return the generated tests as a list or any other suitable format
}''')

# Print the generated tests
for test in tests:
    print(test)

# Create the 'test' directory if it doesn't exist
os.makedirs('test', exist_ok=True)

# Save each test to a separate file
for i, test in enumerate(tests):
    filename = f'test/test{i+1}.txt'
    with open(filename, 'w') as file:
        file.write(test)

# Close Playwright
context.close()
browser.close()
playwright.stop()