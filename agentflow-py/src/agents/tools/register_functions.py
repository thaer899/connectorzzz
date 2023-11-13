import importlib
import json
import os


def dynamic_import_function(module_name, function_name):
    try:
        # Import the module
        module = importlib.import_module(module_name)
        return getattr(module, function_name)
    except (ImportError, AttributeError) as e:
        # Handle the error or return None if the function cannot be imported
        print(f"Error importing {function_name} from {module_name}: {e}")
        return None


def get_functions(function_names=None):
    # Define the file path
    file_path = os.path.join(os.path.dirname(__file__), 'data/functions.json')

    # Check if the file exists
    if not os.path.exists(file_path):
        print("Functions file not found.")
        return []

    try:
        # Open and parse the JSON file
        with open(file_path, 'r') as file:
            functions = json.load(file)

        # Filter and return the functions
        if function_names:
            return [func for func in functions if func["name"] in function_names]
        else:
            return functions  # Return all functions if no specific names are provided

    except json.JSONDecodeError as e:
        print(f"Error parsing JSON from functions file: {e}")
        return []


def register_functions(instance_agent, functions=None):
    if functions is None:
        functions = get_functions()  # Get all functions if none are specified

    if not functions:
        print("No functions to register for this agent.")
        return

    function_names = [func_info['name'] for func_info in functions]
    registered_functions = get_functions(function_names)

    print(f"Attempting to register functions: {function_names}")
    function_map = {}
    for func_info in registered_functions:
        module_name = "src.agents.tools.functions." + func_info["location"]
        function_name = func_info["name"]
        func = dynamic_import_function(module_name, function_name)
        if func:
            function_map[function_name] = func
        else:
            print(f"Failed to import {function_name}")

    if function_map:
        print(f"Registered functions: {list(function_map.keys())}")
    else:
        print("No functions were successfully registered.")

    instance_agent.register_function(function_map=function_map)
