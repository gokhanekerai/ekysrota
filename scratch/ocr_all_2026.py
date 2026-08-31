import os
import json
import re
from rapidocr_onnxruntime import RapidOCR

engine = RapidOCR()
pages_dir = 'scratch/pdf2026_pages'
page_files = sorted(
    [f for f in os.listdir(pages_dir) if f.startswith('page_') and f.endswith('.png')],
    key=lambda x: int(re.search(r'page_(\d+)\.png', x).group(1))
)

all_ocr_results = []

for pf in page_files:
    page_num = int(re.search(r'page_(\d+)\.png', pf).group(1))
    p_path = os.path.join(pages_dir, pf)
    res, elapse = engine(p_path)
    lines = [item[1] for item in res] if res else []
    all_ocr_results.append({
        'page': page_num,
        'image': p_path,
        'lines': lines,
        'full_text': "\n".join(lines)
    })
    print(f"Page {page_num:02d}/{len(page_files)} processed ({len(lines)} lines)")

with open('scratch/ekys2026_ocr_raw.json', 'w', encoding='utf-8') as f:
    json.dump(all_ocr_results, f, ensure_ascii=False, indent=2)

print("Saved scratch/ekys2026_ocr_raw.json successfully.")
