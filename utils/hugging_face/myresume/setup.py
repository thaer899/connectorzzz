import pkg_resources
import subprocess
import sys


def install_requirements(requirements_path='requirements.txt'):
    with open(requirements_path, 'r') as f:
        requirements = [line.strip() for line in f.readlines()]

    installed = {pkg.key for pkg in pkg_resources.working_set}
    missing = []

    for requirement in requirements:
        pkg_name = requirement.split(
            '==')[0] if '==' in requirement else requirement.split('>=')[0]
        if pkg_name not in installed:
            missing.append(requirement)

    if missing:
        python = sys.executable
        subprocess.check_call(
            [python, '-m', 'pip', 'install', *missing],
            stdout=subprocess.DEVNULL)
