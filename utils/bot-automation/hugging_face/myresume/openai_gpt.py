import json
from nlp_utils import retrieve_info_with_nlp


def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data


def get_user_input():
    # Get user input from the console
    section = input(
        "Please enter the section to search (e.g., 'education' etc): ")
    user_input = input("Please enter your text (type 'exit' to stop): ")
    return section, user_input


# Main execution
if __name__ == "__main__":
    data = load_json("./data/myresume.json")

    while True:  # Keep running until 'exit' is entered
        section, user_input = get_user_input()

        if user_input.lower() == 'exit' or section.lower() == 'exit':
            print("Exiting.")
            break

        if section not in data:  # Check if the section is valid
            print(
                "Invalid section. Please choose a valid",
                "section (e.g., 'education' or 'employment').")
            continue

        info = retrieve_info_with_nlp(user_input, section, data)
        if info:
            # Pretty print the information or do something else
            print(json.dumps(info, indent=2))
        else:
            print("No relevant information found.")
