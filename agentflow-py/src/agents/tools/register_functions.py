import importlib
import json
import os
import asyncio
import inspect


def sync_wrapper(async_func):
    def wrapper(*args, **kwargs):
        return asyncio.run(async_func(*args, **kwargs))
    return wrapper


def dynamic_import_function(module_name, function_name):
    try:
        module = importlib.import_module(module_name)
        func = getattr(module, function_name)
        if inspect.iscoroutinefunction(func):
            return sync_wrapper(func)
        return func
    except (ImportError, AttributeError) as e:
        print(f"Error importing {function_name} from {module_name}: {e}")
        return None


def get_functions(function_names=None):
    file_path = os.path.join(os.path.dirname(__file__), 'data/functions.json')

    if not os.path.exists(file_path):
        print("Functions file not found.")
        return []

    try:
        with open(file_path, 'r') as file:
            functions = json.load(file)

        # Debugging - print the structure of 'functions'
        print("Loaded functions:", functions)

        if function_names:
            # Ensure 'functions' is a list and each element is a dictionary
            if isinstance(functions, list) and all(isinstance(func, dict) for func in functions):
                return [func for func in functions if func.get("name") in function_names]
            else:
                print("Incorrect format of functions data")
                return []
        else:
            return functions

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
