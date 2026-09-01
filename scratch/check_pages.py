import fitz
import pytesseract
from PIL import Image
import os

pdf_path = 'ekys çıkmış sorular/2022 EKYS Sınav Soruları.pdf'
doc = fitz.open(pdf_path)

# Let's inspect each page with pytesseract or check text if available
for i in range(len(doc)):
    page_img_path = f"scratch/pdf_2022_pages/page_{i+1:02d}.png"
    img = Image.open(page_img_path)
    # Check text using tesseract if available, or print page info
    try:
        text = pytesseract.image_to_string(img, lang='tur')
    except Exception as e:
        text = ""
    
    # Check if text contains map or graphic keywords
    has_keyword = any(k in text.lower() for k in ['harita', 'grafik', 'numaralan', 'taralı', 'koyu', 'işaretli'])
    print(f"Page {i+1}: {img.size} - keyword match: {has_keyword}")
    if has_keyword:
        print(f"   Snippet: {text[:200].replace(chr(10), ' ')}")
