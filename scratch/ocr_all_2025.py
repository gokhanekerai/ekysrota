import os
import json
import re
from rapidocr_onnxruntime import RapidOCR

def run_ocr():
    engine = RapidOCR()
    pages_dir = 'scratch/pdf2025_pages'
    
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
        print(f"Sayfa {page_num:02d}/{len(page_files)} OCR tamamlandı ({len(lines)} satır)")
    
    with open('scratch/ekys2025_ocr_raw.json', 'w', encoding='utf-8') as f:
        json.dump(all_ocr_results, f, ensure_ascii=False, indent=2)
    
    print("scratch/ekys2025_ocr_raw.json başarıyla oluşturuldu.")

if __name__ == '__main__':
    run_ocr()
