# filename: sys_info.py
import sys
import os
import platform

print(f"Python version: {sys.version}")
print(f"Operating system: {platform.system()}")
print(f"Shell: {os.environ.get('SHELL', 'Shell not found')}")