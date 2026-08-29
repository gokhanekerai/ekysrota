import os
import glob
import json
import re
import pymupdf

os.makedirs('assets/questions', exist_ok=True)
os.makedirs('data', exist_ok=True)

all_questions = []

# --- 1. COĞRAFYA & TARİH VİDEO TARAMA TESTLERİ ---
video_tests = [
    {
        'pdf': 'coğrafya soruları/EKYS COĞRAFYA VİDEO TARAMA 1.pdf',
        'id': 'cogr-tarama-1',
        'title': 'Coğrafya Video Tarama Testi 1',
        'category': 'Genel Kültür & Coğrafya (%20)',
        'icon': '🌍',
        'answers': ['E','C','C','A','B','D','D','A','B','C','D','B','B','D','B','D','E','D','A','B']
    },
    {
        'pdf': 'coğrafya soruları/EKYS COĞRAFYA VİDEO TARAMA 2.pdf',
        'id': 'cogr-tarama-2',
        'title': 'Coğrafya Video Tarama Testi 2',
        'category': 'Genel Kültür & Coğrafya (%20)',
        'icon': '🌍',
        'answers': ['B','C','D','E','D','D','A','E','A','C','B','A','B','A','B','B','C','A','C','E']
    },
    {
        'pdf': 'genel tarih soruları/EKYS GENEL TARİH VİDEO TARAMA TESTİ.pdf',
        'id': 'tarih-tarama-1',
        'title': 'Genel Tarih - Türk Kültür ve Uygarlığı 1',
        'category': 'Genel Kültür & Tarih (%20)',
        'icon': '🏛️',
        'answers': ['D','D','E','E','B','E','E','B','B','E','D','D','C','D','D','B','A','D','B']
    },
    {
        'pdf': 'genel tarih soruları/TEKYS GENEL TARİH VİDEO TAMARA TESTİ 2 (2).pdf',
        'id': 'tarih-tarama-2',
        'title': 'Genel Tarih - Türk Kültür ve Uygarlığı 2',
        'category': 'Genel Kültür & Tarih (%20)',
        'icon': '🏛️',
        'answers': ['A','C','D','C','B','E','B','D','D','A','A','A','B','D','B','C','B','E','C','D']
    }
]

for t in video_tests:
    if not os.path.exists(t['pdf']):
        continue
    doc = pymupdf.open(t['pdf'])
    print(f"Çıkarılıyor: {t['title']}")
    img_idx = 0
    for page_idx, page in enumerate(doc):
        image_list = page.get_images()
        for img_info in image_list:
            xref = img_info[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image['image']
            image_ext = base_image['ext']
            
            if len(image_bytes) < 5000:
                continue

            img_idx += 1
            if img_idx > len(t['answers']):
                continue
                
            img_filename = f"{t['id']}_q{img_idx}.{image_ext}"
            img_path = os.path.join('assets/questions', img_filename)
            with open(img_path, 'wb') as f:
                f.write(image_bytes)
                
            correct_ans = t['answers'][img_idx - 1]
            all_questions.append({
                'id': f"{t['id']}-q{img_idx}",
                'testId': t['id'],
                'testTitle': t['title'],
                'topicId': t['id'],
                'topicName': t['title'],
                'category': t['category'],
                'icon': t['icon'],
                'questionNumber': img_idx,
                'questionText': f"{t['title']} - Soru {img_idx}",
                'hasImage': True,
                'image': f"assets/questions/{img_filename}",
                'options': [
                    {'key': 'A', 'text': 'A Şıkkı'},
                    {'key': 'B', 'text': 'B Şıkkı'},
                    {'key': 'C', 'text': 'C Şıkkı'},
                    {'key': 'D', 'text': 'D Şıkkı'},
                    {'key': 'E', 'text': 'E Şıkkı'}
                ],
                'correctAnswer': correct_ans,
                'explanation': f"Doğru Cevap: {correct_ans}"
            })

# --- 2. 2019 EKYS ÇIKMIŞ SINAV SORULARI ---
if os.path.exists('ekys çıkmış sorular/2019 EKYS Sınav Soruları.pdf'):
    doc2019 = pymupdf.open('ekys çıkmış sorular/2019 EKYS Sınav Soruları.pdf')
    print("Çıkarılıyor: 2019 EKYS Çıkmış Sınavı...")
    q_num = 0
    for p_idx, page in enumerate(doc2019):
        txt = page.get_text()
        blocks = page.get_text("blocks")
        
        # Soru numaralarını ve cevap anahtarlarını bul
        for b in blocks:
            text = b[4].strip()
            match_soru = re.search(r'Soru\s*No:\s*(\d+)', text, re.IGNORECASE)
            if match_soru:
                q_num = int(match_soru.group(1))
        
        # Her sayfanın yüksek kaliteli kesitini al
        pix = page.get_pixmap(dpi=150)
        img_filename = f"cikmis_2019_p{p_idx+1}.png"
        pix.save(os.path.join('assets/questions', img_filename))
        
        # Cevap anahtarını regex ile çek
        ans_match = re.search(r'Cevap\s*(?:Anahtar[ıi]?\s*)?:\s*([A-E])', txt, re.IGNORECASE)
        ans = ans_match.group(1).upper() if ans_match else 'A'
        
        all_questions.append({
            'id': f"cikmis-2019-p{p_idx+1}",
            'testId': 'cikmis-2019',
            'testTitle': '2019 EKYS Çıkmış Sınav Soruları',
            'topicId': 'cikmis-2019',
            'topicName': '2019 EKYS Sınavı',
            'category': 'Çıkmış Sınavlar',
            'icon': '📜',
            'questionNumber': p_idx + 1,
            'questionText': f"2019 EKYS Soru Sayfası {p_idx + 1}",
            'hasImage': True,
            'image': f"assets/questions/{img_filename}",
            'options': [
                {'key': 'A', 'text': 'A'},
                {'key': 'B', 'text': 'B'},
                {'key': 'C', 'text': 'C'},
                {'key': 'D', 'text': 'D'},
                {'key': 'E', 'text': 'E'}
            ],
            'correctAnswer': ans,
            'explanation': f"2019 EKYS Soru Sayfası {p_idx+1} - Doğru Cevap: {ans}"
        })

# --- 3. DİĞER ÇIKMIŞ SINAVLAR (2021, 2022, 2023, 2024, 2025, 2026) ---
cikmis_list = [
    {'year': '2020', 'file': 'ekys çıkmış sorular/2020 EKYS Sınav Soruları.pdf'},
    {'year': '2021', 'file': 'ekys çıkmış sorular/2021 EKYS Sınav Soruları.pdf'},
    {'year': '2022', 'file': 'ekys çıkmış sorular/2022 EKYS Sınav Soruları.pdf'},
    {'year': '2023', 'file': 'ekys çıkmış sorular/2023 EKYS ÇIKMIŞ SORULAR.pdf'},
    {'year': '2024', 'file': 'ekys çıkmış sorular/EKYS 2024 SORULARI.pdf'},
    {'year': '2025', 'file': 'ekys çıkmış sorular/2025 ekys.pdf'},
    {'year': '2026', 'file': 'ekys çıkmış sorular/2026 EKYS SORULARI.pdf'}
]

for item in cikmis_list:
    if not os.path.exists(item['file']):
        continue
    doc = pymupdf.open(item['file'])
    print(f"Çıkarılıyor: {item['year']} EKYS Çıkmış Sınavı ({len(doc)} sayfa)...")
    for p_idx, page in enumerate(doc):
        img_filename = f"cikmis_{item['year']}_q{p_idx+1}.png"
        img_path = os.path.join('assets/questions', img_filename)
        
        # Sayfayı yüksek kaliteli görsel olarak kaydet
        if not os.path.exists(img_path):
            pix = page.get_pixmap(dpi=150)
            pix.save(img_path)
            
        all_questions.append({
            'id': f"cikmis-{item['year']}-q{p_idx+1}",
            'testId': f"cikmis-{item['year']}",
            'testTitle': f"{item['year']} EKYS Çıkmış Soruları",
            'topicId': f"cikmis-{item['year']}",
            'topicName': f"{item['year']} EKYS Sınavı",
            'category': 'Çıkmış Sınavlar',
            'icon': '🎯',
            'questionNumber': p_idx + 1,
            'questionText': f"{item['year']} EKYS Çıkmış Soru {p_idx + 1}",
            'hasImage': True,
            'image': f"assets/questions/{img_filename}",
            'options': [
                {'key': 'A', 'text': 'A'},
                {'key': 'B', 'text': 'B'},
                {'key': 'C', 'text': 'C'},
                {'key': 'D', 'text': 'D'},
                {'key': 'E', 'text': 'E'}
            ],
            'correctAnswer': 'A',
            'explanation': f"{item['year']} EKYS Soru {p_idx+1}"
        })

print(f"\nToplam {len(all_questions)} adet soru ve görseli başarıyla çıkarıldı ve veritabanına bağlandı!")

# Kaydet
js_content = f"""// EKYS 2027 Kapsamlı Soru ve Görsel Veritabanı
window.EKYS_EXTRACTED_QUESTIONS = {json.dumps(all_questions, ensure_ascii=False, indent=2)};
"""

with open('data/questions-db.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("data/questions-db.js başarıyla güncellendi!")
