import os
import glob
import json
import re
import pymupdf

os.makedirs('assets/questions', exist_ok=True)
os.makedirs('data', exist_ok=True)

all_questions = []

print("1. Coğrafya & Tarih Video Tarama Testleri işleniyor...")
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
    img_idx = 0
    for page_idx, page in enumerate(doc):
        for img_info in page.get_images():
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
                    {'key': 'A', 'text': 'A'},
                    {'key': 'B', 'text': 'B'},
                    {'key': 'C', 'text': 'C'},
                    {'key': 'D', 'text': 'D'},
                    {'key': 'E', 'text': 'E'}
                ],
                'correctAnswer': correct_ans,
                'explanation': f"Doğru Cevap: {correct_ans}"
            })

print(f"Video testlerinden {len(all_questions)} soru eklendi.")

# --- 2. 2024 EKYS SORULARI (HER SAYFADAKİ TEKİL GÖRSELLERİ SIRALI ÇIKAR) ---
if os.path.exists('ekys çıkmış sorular/EKYS 2024 SORULARI.pdf'):
    print("2. 2024 EKYS tekil soruları ayıklanıyor...")
    doc2024 = pymupdf.open('ekys çıkmış sorular/EKYS 2024 SORULARI.pdf')
    q2024_idx = 0
    for p_idx, page in enumerate(doc2024):
        # Sayfadaki görselleri al
        img_list = page.get_images()
        for img_info in img_list:
            xref = img_info[0]
            base = doc2024.extract_image(xref)
            if base['width'] > 300 and base['height'] > 200:
                q2024_idx += 1
                img_ext = base['ext']
                img_filename = f"cikmis_2024_single_q{q2024_idx}.{img_ext}"
                img_path = os.path.join('assets/questions', img_filename)
                with open(img_path, 'wb') as f:
                    f.write(base['image'])
                
                all_questions.append({
                    'id': f"cikmis-2024-q{q2024_idx}",
                    'testId': 'cikmis-2024',
                    'testTitle': '2024 EKYS Çıkmış Soruları',
                    'topicId': 'cikmis-2024',
                    'topicName': '2024 EKYS Sınavı',
                    'category': 'Çıkmış Sınavlar',
                    'icon': '📜',
                    'questionNumber': q2024_idx,
                    'questionText': f"2024 EKYS Çıkmış Soru {q2024_idx}",
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
                    'explanation': f"2024 EKYS Soru {q2024_idx}"
                })
    print(f"2024 EKYS'den {q2024_idx} adet tekil soru çıkarıldı.")

# --- 3. 2019 & 2020 EKYS (SAYFAYI ÜST VE ALT 2 AYRI TEKİL SORU OLARAK KES) ---
for year, pdf_path in [('2019', 'ekys çıkmış sorular/2019 EKYS Sınav Soruları.pdf'), ('2020', 'ekys çıkmış sorular/2020 EKYS Sınav Soruları.pdf')]:
    if not os.path.exists(pdf_path):
        continue
    print(f"3. {year} EKYS soruları tekil olarak kesiliyor...")
    doc = pymupdf.open(pdf_path)
    q_count = 0
    for p_idx, page in enumerate(doc):
        rect = page.rect
        w = rect.width
        h = rect.height
        
        # Üst Soru (Soru A)
        rect_top = pymupdf.Rect(30, 20, w - 30, h * 0.50)
        pix_top = page.get_pixmap(clip=rect_top, dpi=180)
        q_count += 1
        img_top = f"cikmis_{year}_single_q{q_count}.png"
        pix_top.save(os.path.join('assets/questions', img_top))
        
        all_questions.append({
            'id': f"cikmis-{year}-q{q_count}",
            'testId': f"cikmis-{year}",
            'testTitle': f"{year} EKYS Çıkmış Soruları",
            'topicId': f"cikmis-{year}",
            'topicName': f"{year} EKYS Sınavı",
            'category': 'Çıkmış Sınavlar',
            'icon': '📜',
            'questionNumber': q_count,
            'questionText': f"{year} EKYS Çıkmış Soru {q_count}",
            'hasImage': True,
            'image': f"assets/questions/{img_top}",
            'options': [
                {'key': 'A', 'text': 'A'},
                {'key': 'B', 'text': 'B'},
                {'key': 'C', 'text': 'C'},
                {'key': 'D', 'text': 'D'},
                {'key': 'E', 'text': 'E'}
            ],
            'correctAnswer': 'A',
            'explanation': f"{year} EKYS Soru {q_count}"
        })
        
        # Alt Soru (Soru B)
        rect_bot = pymupdf.Rect(30, h * 0.48, w - 30, h - 30)
        pix_bot = page.get_pixmap(clip=rect_bot, dpi=180)
        q_count += 1
        img_bot = f"cikmis_{year}_single_q{q_count}.png"
        pix_bot.save(os.path.join('assets/questions', img_bot))
        
        all_questions.append({
            'id': f"cikmis-{year}-q{q_count}",
            'testId': f"cikmis-{year}",
            'testTitle': f"{year} EKYS Çıkmış Soruları",
            'topicId': f"cikmis-{year}",
            'topicName': f"{year} EKYS Sınavı",
            'category': 'Çıkmış Sınavlar',
            'icon': '📜',
            'questionNumber': q_count,
            'questionText': f"{year} EKYS Çıkmış Soru {q_count}",
            'hasImage': True,
            'image': f"assets/questions/{img_bot}",
            'options': [
                {'key': 'A', 'text': 'A'},
                {'key': 'B', 'text': 'B'},
                {'key': 'C', 'text': 'C'},
                {'key': 'D', 'text': 'D'},
                {'key': 'E', 'text': 'E'}
            ],
            'correctAnswer': 'A',
            'explanation': f"{year} EKYS Soru {q_count}"
        })

# --- 4. 2021, 2022, 2023, 2025, 2026 EKYS (HER SAYFASI ZATEN 1 TEKİL SORU OLANLAR) ---
single_page_tests = [
    {'year': '2021', 'file': 'ekys çıkmış sorular/2021 EKYS Sınav Soruları.pdf'},
    {'year': '2022', 'file': 'ekys çıkmış sorular/2022 EKYS Sınav Soruları.pdf'},
    {'year': '2023', 'file': 'ekys çıkmış sorular/2023 EKYS ÇIKMIŞ SORULAR.pdf'},
    {'year': '2025', 'file': 'ekys çıkmış sorular/2025 ekys.pdf'},
    {'year': '2026', 'file': 'ekys çıkmış sorular/2026 EKYS SORULARI.pdf'}
]

for item in single_page_tests:
    if not os.path.exists(item['file']):
        continue
    doc = pymupdf.open(item['file'])
    print(f"4. {item['year']} EKYS ({len(doc)} tekil soru) işleniyor...")
    for p_idx, page in enumerate(doc):
        img_filename = f"cikmis_{item['year']}_q{p_idx+1}.png"
        img_path = os.path.join('assets/questions', img_filename)
        
        pix = page.get_pixmap(dpi=160)
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

print(f"\nTOPLAM {len(all_questions)} ADET TEKIL SORU BASARIYLA AYIKLANDI!")

js_content = f"""// EKYS 2027 Kapsamlı Soru ve Görsel Veritabanı (Tekil ve Net Sorular)
window.EKYS_EXTRACTED_QUESTIONS = {json.dumps(all_questions, ensure_ascii=False, indent=2)};
"""

with open('data/questions-db.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("data/questions-db.js guncellendi!")
