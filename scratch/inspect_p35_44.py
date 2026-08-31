import json

with open('scratch/ekys2026_ocr_raw.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for p in data:
    if 35 <= p['page'] <= 44:
        print(f"=== PAGE {p['page']} ===")
        print(p['full_text'])
        print()
