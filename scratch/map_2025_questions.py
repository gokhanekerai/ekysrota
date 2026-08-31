import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/ekys2025_ocr_raw.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

q_map = {}
for p in pages:
    txt = p['full_text']
    # Soru No bul
    m = re.search(r'Soru\s*No\s*:\s*(\d+)', txt, re.IGNORECASE)
    ans_m = re.search(r'Cevap\s*Anahtar[ıi]\s*:\s*([A-E])', txt, re.IGNORECASE)
    q_num = int(m.group(1)) if m else None
    ans = ans_m.group(1).upper() if ans_m else None
    q_map[p['page']] = {'q_num': q_num, 'ans': ans, 'len': len(txt)}

print(f"Toplam sayfa: {len(pages)}")
found_q = {v['q_num']: k for k, v in q_map.items() if v['q_num'] is not None}
print(f"Tespit edilen soru sayısı: {len(found_q)}")
missing_q = [i for i in range(1, 81) if i not in found_q]
print(f"Eksik soru numaraları: {missing_q}")

for p_num, info in q_map.items():
    if info['q_num'] is None:
        print(f"Sayfa {p_num} soru numarası regexle bulunamadı!")
