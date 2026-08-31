import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/ekys2025_ocr_raw.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

for p in pages:
    lines = p['lines']
    first_few = " | ".join(lines[:3]) if lines else "EMPTY"
    last_few = " | ".join(lines[-2:]) if lines else "EMPTY"
    print(f"Page {p['page']:02d}: {first_few} ---> {last_few}")
