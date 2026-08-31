import json
import os

q30 = {
  "id": "ekys2026-q30",
  "testId": "ekys2026_tam",
  "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
  "topicId": "ekys2026_egitimyonetimi",
  "topicName": "2026 EKYS - Eğitim Yönetimi",
  "category": "Eğitim Yönetimi (%30)",
  "icon": "🎓",
  "questionNumber": 30,
  "questionText": "Bir okulda öğretmenlerin ve personelin görev tanımlarının net olarak yazılı kurallarla belirlendiği, yetki ve sorumlulukların kademeli bir hiyerarşik yapıya göre düzenlendiği, terfilerin liyakat ve kıdeme dayandırıldığı ve tüm işlemlerin kişisel ilişkilerden uzak, nesnel ve biçimsel kurallara göre yürütüldüğü bir yönetim yapısı benimsenmiştir.\n\nOkul yönetiminin benimsediği bu yönetim anlayışı aşağıdaki klasik örgüt kuramlarından hangisinin temel ilkeleriyle örtüşmektedir?",
  "hasImage": False,
  "image": None,
  "options": [
    {"key": "A", "text": "Max Weber - Bürokrasi Kuramı"},
    {"key": "B", "text": "Frederick Taylor - Bilimsel Yönetim Kuramı"},
    {"key": "C", "text": "Henri Fayol - Yönetim Süreci Kuramı"},
    {"key": "D", "text": "Elton Mayo - İnsan İlişkileri Yaklaşımı"},
    {"key": "E", "text": "Douglas McGregor - X ve Y Kuramı"}
  ],
  "correctAnswer": "A",
  "explanation": "Doğru Cevap: <strong>A</strong><br>Max Weber'in <strong>Bürokrasi Kuramı</strong>; yazılı kurallar, dikey hiyerarşi, nesnellik (gayrişahsilik) ve liyakat ilkelerine dayanır."
}

with open('data/questions-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

json_text = text.split('window.EKYS_EXTRACTED_QUESTIONS =')[1].strip().rstrip(';')
existing = json.loads(json_text)

# remove if q30 already exists
existing = [q for q in existing if q['id'] != 'ekys2026-q30']
existing.append(q30)

# Sort 2026 questions by questionNumber
non_2026 = [q for q in existing if 'ekys2026' not in q.get('id', '')]
ekys_2026 = [q for q in existing if 'ekys2026' in q.get('id', '')]
ekys_2026.sort(key=lambda q: q.get('questionNumber', 0))

all_questions = non_2026 + ekys_2026

js_content = f"// EKYS 2027 Odaklı Soru Veritabanı (2026 Çıkmış Sorular Dahil)\nwindow.EKYS_EXTRACTED_QUESTIONS = {json.dumps(all_questions, ensure_ascii=False, indent=2)};\n"

with open('data/questions-db.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Toplam Havuz Soru Sayısı: {len(all_questions)}")
print(f"2026 EKYS Soru Sayısı: {len(ekys_2026)}")
print(f"Soru Numaraları: {[q['questionNumber'] for q in ekys_2026]}")
