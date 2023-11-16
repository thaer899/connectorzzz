import json


def generate_python_function(func_data):
    # Create function signature
    func_signature = f"def {func_data['name']}("
    func_signature += ', '.join(
        [f"{param['name']}: {param['type']}" for param in func_data['parameters']])
    func_signature += f") -> {func_data['return_type']}:\n"

    # Create docstring
    docstring = f"    \"\"\"\n    {func_data['description']}\n\n"
    for param in func_data['parameters']:
        docstring += f"    {param['name']} ({param['type']}): {param['description']}\n"
    docstring += f"    Returns:\n    {func_data['return_type']}: {func_data['return_description']}\n    \"\"\"\n"

    # Combine
    full_function = func_signature + docstring + \
        "    # Implementation goes here\n    pass\n\n"
    return full_function
