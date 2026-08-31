import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/ekys2025_ocr_raw.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

# Group by question number
questions_dict = {}

for p in pages:
    txt = p['full_text']
    lines = p['lines']
    
    m = re.search(r'Soru\s*No\s*:\s*(\d+)', txt, re.IGNORECASE)
    ans_m = re.search(r'Cevap\s*Anahtar[ıi]\s*:\s*([A-E])', txt, re.IGNORECASE)
    
    q_num = int(m.group(1)) if m else None
    ans = ans_m.group(1).upper() if ans_m else None
    
    if q_num:
        if q_num not in questions_dict:
            questions_dict[q_num] = {
                'q_num': q_num,
                'pages': [p['page']],
                'text': txt,
                'ans': ans
            }
        else:
            questions_dict[q_num]['pages'].append(p['page'])
            questions_dict[q_num]['text'] += "\n--- DEVAM SAYFASI ---\n" + txt
            if not questions_dict[q_num]['ans'] and ans:
                questions_dict[q_num]['ans'] = ans

with open('scratch/ekys2025_parsed_dict.json', 'w', encoding='utf-8') as f:
    json.dump(questions_dict, f, ensure_ascii=False, indent=2)

print(f"Parsed {len(questions_dict)} unique questions.")
