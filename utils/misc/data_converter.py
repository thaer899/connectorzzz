import json
import sys
import os


def merge_data(directory):
    merged_data = {
        "schema": {},
        "data": {}
    }

    # List all files in the directory
    files = [os.path.join(directory, f)
             for f in os.listdir(directory) if f.endswith('.json')]

    for file in files:
        with open(file, 'r') as f:
            data = json.load(f)

        for key, values in data.items():
            if key not in merged_data["schema"]:
                if isinstance(values, list) and len(values) > 0:
                    # If the list contains dictionaries
                    if isinstance(values[0], dict):
                        merged_data["schema"][key] = list(values[0].keys())
                        merged_data["data"][key] = [
                            [value[k] for k in merged_data["schema"][key]] for value in values]
                    else:  # If the list contains simple values (e.g., strings)
                        merged_data["schema"][key] = "string"
                        merged_data["data"][key] = values
                else:  # For other data types
                    merged_data["schema"][key] = "string"
                    merged_data["data"][key] = values

    return merged_data


if __name__ == "__main__":
    directory = sys.argv[1]  # Accept directory as an argument
    output_path = sys.argv[2]  # Accept output file path as an argument
    output = merge_data(directory)
    print(directory)
    print(json.dumps(output, indent=4))
    with open(output_path, 'w') as file:
        json.dump(output, file, indent=4)
    print(f"Data saved to {output_path}")


#  python utils/data_converter.py src/assets/data/ server/data/resume.json
