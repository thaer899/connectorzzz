from flask import Flask, request, jsonify
import json
from openai_gpt_utils import generate_text
from nlp_utils import retrieve_info_with_nlp
# from nlp_utils import setup
# setup()

app = Flask(__name__)


def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data


data = load_json("./data/myresume.json")


@app.route('/generate', methods=['POST'])
def generate():
    input_data = request.get_json()
    user_input = input_data.get('inputs', '')
    section = input_data.get('section', '')

    if not user_input or not section:
        return jsonify(error="inputs or section not provided"), 400
    if section not in data:
        return jsonify(error="Invalid section"), 400

    retrieved_info = retrieve_info_with_nlp(user_input, section, data)
    response_text = generate_text(retrieved_info)
    if response_text:
        print("Formatted Response:", response_text)
    else:
        print("Failed to generate a valid response after several attempts.")

    return jsonify({'generated_text': response_text})


if __name__ == '__main__':
    app.run(port=5000, debug=True)


# # Example Usage
# input_text = "Your input text here"
# formatted_response = generate_text(input_text)
# if formatted_response:
#     print("Formatted Response:", formatted_response)
# else:
#     print("Failed to generate a valid response after several attempts.")
