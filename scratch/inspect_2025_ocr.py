import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/ekys2025_ocr_raw.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

print(f"Toplam Sayfa: {len(pages)}")

# Bakalım cevap anahtarı son sayfalarda mı?
print("\n--- Son 3 Sayfa Metni ---")
for p in pages[-3:]:
    print(f"=== SAYFA {p['page']} ===")
    print(p['full_text'])
    print()

print("\n--- İlk 5 Sayfa Metni ---")
for p in pages[:5]:
    print(f"=== SAYFA {p['page']} ===")
    print(p['full_text'])
    print()
