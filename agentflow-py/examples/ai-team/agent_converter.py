import json
import argparse
import os

# Parse command line arguments
parser = argparse.ArgumentParser(description='Convert agent JSON format.')
parser.add_argument('--file', type=str, help='Path to the input JSON file')
args = parser.parse_args()

input_file_path = args.file
output_dir = os.path.join(os.path.dirname(input_file_path), 'converted')
output_file_path = os.path.join(output_dir, os.path.basename(input_file_path))

# Ensure the output directory exists
os.makedirs(output_dir, exist_ok=True)

# Template for the new format
new_format_template = {
    "type": "assistant",
    "config": {
        "llm_config": {
            "request_timeout": 300,
            "seed": 40,
            "config_list": [
                {
                    "model": "gpt-4-1106-preview"
                }
            ],
            "temperature": 0
        },
        "code_execution_config": {
            "work_dir": "workspace",
            "use_docker": True,
            "last_n_messages": 5
        },
        "functions": []
    }
}

# Read the input JSON file and convert the agents
try:
    with open(input_file_path, 'r') as file:
        original_agents = json.load(file)

    converted_agents = []
    for agent in original_agents:
        new_agent = new_format_template.copy()
        new_agent["agent_name"] = agent["agent_name"]
        new_agent["message"] = agent["message"]
        converted_agents.append(new_agent)

    # Write the converted agents to the new JSON file
    with open(output_file_path, 'w') as file:
        json.dump(converted_agents, file, indent=4)

    print(f"Converted file saved to {output_file_path}")

except FileNotFoundError:
    print(f"File not found: {input_file_path}")
