# Use a pipeline as a high-level helper
import time
from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers import pipeline
import requests
import json

API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base"


def query(payload, max_retries=3, retry_delay=10):
    data = json.dumps(payload)
    headers = {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
    }

    for attempt in range(max_retries):
        response = requests.post(API_URL, headers=headers, data=data)
        print(f"Status Code: {response.status_code}")

        try:
            response_data = response.json()
        except json.JSONDecodeError:
            print("Failed to decode JSON from response")
            print("Response content:", response.text)
            return None

        if response.status_code == 200:
            print("Success:", response_data)
            return response_data
        elif response.status_code == 503 and 'estimated_time' in response_data:
            print(f"Model is loading, retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
        else:
            print(f"Failed to retrieve data: {response.status_code}")
            print(response_data)
            return None

    print("Max retries exceeded. Exiting.")
    return None


def get_user_input():
    # Get user input from the console
    user_input = input("Please enter your text: ")
    return user_input


data = query(
    {
        "inputs": get_user_input()
    }
)
