import json

with open('scratch/ekys2026_ocr_raw.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for p in data:
    for line in p['lines']:
        if '30' in line:
            print(f"Page {p['page']:02d}: {line}")
