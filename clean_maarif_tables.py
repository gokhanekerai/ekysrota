# -*- coding: utf-8 -*-
import json

with open(r'c:\Users\basin\.gemini\antigravity\scratch\ekys2027\data\questions-db.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('[')
r_idx = content.rfind(']')
questions = json.loads(content[idx:r_idx+1])

cleaned_count = 0
for q in questions:
    qid = q.get('id', '')
    if qid == 'ekys2026-q50':
        q['questionText'] = (
            "Bir Fizik Öğretmeni, 2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'nde yer alan "
            "sosyal-duygusal öğrenme becerilerine ilişkin görseldeki tabloyu hazırlamıştır. Tabloda \"Sosyal Yaşam Becerileri ve Ortak/Birleşik Beceriler\" "
            "üst başlığı ve bu beceri gruplarına ilişkin alt becerilere yer vermiştir. Ancak tabloda bazı becerilerin sınıflandırılmasında hata olduğunu görmüştür.\n\n"
            "Bu tabloda yapılan sınıflandırma hatası aşağıdaki becerilerden hangilerinin yeri değiştirilirse düzeltilmiş olur?"
        )
        cleaned_count += 1
    elif qid == 'ekys2026-q64':
        q['questionText'] = (
            "2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'nde yer alan program dışı etkinliklerin "
            "alt alanları ve bu alanların açıklamalarına ilişkin tablo görselde verilmiştir.\n\n"
            "Bu eşleştirmelerin doğru olması için numaralandırılmış alt alanlardan hangi ikisinin yer değiştirmesi gerekir?"
        )
        cleaned_count += 1

print(f"Cleaned {cleaned_count} questions")

output_code = '// EKYS 2027 Odaklı Soru Veritabanı\nwindow.EKYS_EXTRACTED_QUESTIONS = ' + json.dumps(questions, indent=2, ensure_ascii=False) + ';\n'

with open(r'c:\Users\basin\.gemini\antigravity\scratch\ekys2027\data\questions-db.js', 'w', encoding='utf-8') as f:
    f.write(output_code)

print("questions-db.js updated successfully!")
