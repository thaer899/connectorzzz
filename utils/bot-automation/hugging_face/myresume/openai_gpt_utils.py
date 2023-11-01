from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import time
import json

# Using GPT-2 instead of OpenAI GPT since it's readily available.
model_name = "gpt2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)
generator = pipeline("text-generation", model=model, tokenizer=tokenizer)


def generate_response(json_data, prefix=""):
    responses = []
    if isinstance(json_data, dict):
        for key, value in json_data.items():
            new_prefix = f"{prefix} {key}" if prefix else key
            responses.append(generate_response(value, new_prefix))
    elif isinstance(json_data, list):
        for i, item in enumerate(json_data):
            new_prefix = f"{prefix} {i+1}" if prefix else str(i+1)
            responses.append(generate_response(item, new_prefix))
    elif isinstance(json_data, str):
        responses.append(f"{prefix}: {json_data}")
    else:
        responses.append(f"{prefix}: None")

    # Ensure the responses are string type before joining
    responses = [str(r) for r in responses]

    return " ".join(responses)


def generate_text(input_text, max_retries=3, retry_delay=5):
    for attempt in range(max_retries):
        try:
            # Generate text
            response = generator(input_text, max_length=100,
                                 num_return_sequences=1)

            # Check and process the response
            generated_text = check_response(
                response, attempt, max_retries, retry_delay)
            if generated_text:
                # If generated_text is valid JSON, process and return it.
                try:
                    json_data = json.loads(generated_text)
                    return generate_response(json_data)
                except json.JSONDecodeError:
                    print("Generated text is not valid JSON.")
                    # Continue to the next attempt if JSON decoding fails.
                    continue
            else:
                # Continue to the next attempt if text generation fails.
                continue
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            time.sleep(retry_delay)
    return None


def check_response(response, attempt, max_retries, retry_delay):
    if isinstance(response, list) and len(response) > 0:
        generated_text = response[0].get('generated_text', None)
        if generated_text:
            print("Generated Text:", generated_text)
            return generated_text
        else:
            print("Failed to generate text.")
    print(f"Attempt {attempt + 1}/{max_retries}. Retrying in {retry_delay} s.")
    time.sleep(retry_delay)
    return None
