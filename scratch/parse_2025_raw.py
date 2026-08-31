import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/ekys2025_ocr_raw.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

print(f"Toplam sayfa: {len(pages)}")

# Extract each question from pages
questions_by_num = {}

for p in pages:
    txt = p['full_text']
    lines = p['lines']
    
    # Try finding question number
    m = re.search(r'Soru\s*No\s*:\s*(\d+)', txt, re.IGNORECASE)
    ans_m = re.search(r'Cevap\s*Anahtar[ıi]\s*:\s*([A-E])', txt, re.IGNORECASE)
    
    q_num = int(m.group(1)) if m else None
    ans = ans_m.group(1).upper() if ans_m else None
    
    if q_num:
        if q_num not in questions_by_num:
            questions_by_num[q_num] = []
        questions_by_num[q_num].append({
            'page': p['page'],
            'text': txt,
            'lines': lines,
            'ans': ans
        })

print(f"Toplam bulunan tekil soru sayısı: {len(questions_by_num)}")
print(f"Mevcut soru numaraları: {sorted(questions_by_num.keys())}")
missing = [i for i in range(1, 81) if i not in questions_by_num]
print(f"Eksik numaralar: {missing}")

for q_num, occurrences in questions_by_num.items():
    if len(occurrences) > 1:
        pages_str = ", ".join(str(o['page']) for o in occurrences)
        print(f"Soru {q_num} birden fazla sayfada var: Sayfalar [{pages_str}]")
