import fileinput
import sys

for line in fileinput.input():
    print(line)
    if "8000" in line:
        line_parts = line.split("LISTEN")
        last_part = line_parts[-1]
        line_parts = last_part.split("/")
        node = line_parts[0]
    
    