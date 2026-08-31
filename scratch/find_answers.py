import json
import re

with open('scratch/ekys2026_ocr_raw.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for p in data:
    txt = p['full_text']
    # find any line with Cevap
    for line in p['lines']:
        if 'Cevap' in line:
            print(f"Page {p['page']:02d}: {line}")
