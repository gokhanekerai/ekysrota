import os
import pymupdf

def render_pages():
    pdf_path = 'ekys çıkmış sorular/2025 ekys.pdf'
    out_dir = 'scratch/pdf2025_pages'
    os.makedirs(out_dir, exist_ok=True)
    
    doc = pymupdf.open(pdf_path)
    print(f"Toplam sayfa: {len(doc)}")
    
    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=150)
        pix.save(os.path.join(out_dir, f'page_{i+1}.png'))
        if (i + 1) % 10 == 0 or (i + 1) == len(doc):
            print(f"Sayfa {i+1}/{len(doc)} kaydedildi.")

if __name__ == '__main__':
    render_pages()
