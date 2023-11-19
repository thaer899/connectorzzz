import os
import subprocess


def get_files(path):
    # In an interactive environment, you could use os.getcwd() to get the current working directory
    # path = os.path.join(os.getcwd(), path)
    print("Searching in:", path)
    files = []
    for root, dirs, files_in_dir in os.walk(os.path.join(os.path.dirname(__file__), path)):
        for file in files_in_dir:
            files.append(file)
    return files


def read_file(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            return file.read()
    else:
        return None


def write_file(file_path, data):
    file_path = os.path.join(os.path.dirname(__file__), file_path)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w') as file:
        file.write(data)
    return file_path


def read_doc(file_name):
    file_path = os.path.join(os.path.dirname(__file__), 'docs/', file_name)
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            return file.read()
    else:
        return None


def execute_file(file_path):
    if os.path.exists(file_path):
        try:
            completed_process = subprocess.run(
                ["python", file_path], check=True, text=True, capture_output=True)
            print("Output:", completed_process.stdout)
            print("Error:", completed_process.stderr)
        except subprocess.CalledProcessError as e:
            print(f"An error occurred during the execution of the file: {e}")
    else:
        print(f"File not found: {file_path}")


def spr_writer(data):
    file_path = os.path.join(os.path.dirname(__file__), 'data/system.md')
    content = read_file(file_path)
    if content:
        # Process the content to create an SPR
        spr = f"{content}\n\n{data}"
        return spr
    else:
        return "File not found or empty"


def spr_reader(data):
    file_path = os.path.join(os.path.dirname(__file__), 'data/unpack.md')
    content = read_file(file_path)
    if content:
        spr = f"{content}\n\n{data}"
        return spr
    else:
        return "File not found or empty"
