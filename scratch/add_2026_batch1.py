import json
import os

new_questions = [
  {
    "id": "ekys2026-q1",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 1,
    "questionText": "İslamiyet öncesi Türk topluluklarında\n\nI. oguş,\nII. urug,\nIII. şanyü\n\nkavramlarından hangileri milleti oluşturan unsurlar arasındadır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız III"},
      {"key": "C", "text": "I ve II"},
      {"key": "D", "text": "II ve III"},
      {"key": "E", "text": "I, II ve III"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>İslamiyet öncesi Türklerde toplumsal yapı: <em>Oguş (Aile) → Urug (Sülale/Aileler Birliği) → Boy (Kabile) → Bodun (Millet) → İl (Devlet)</em> hiyerarşisine sahiptir. I ve II toplumsal unsurlardır. III (Şanyü) ise Hunlarda hükümdar unvanıdır."
  },
  {
    "id": "ekys2026-q2",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 2,
    "questionText": "Alp Arslan'ın komutanlarından Ebu'l Kasım Saltuk, Mengücek Gazi ve Artuk Bey'in Anadolu'da beylik kurması\n\nI. kılıç hakkı,\nII. gulam sistemi,\nIII. atabeylik uygulaması\n\nifadelerinden hangileriyle ilgilidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız II"},
      {"key": "C", "text": "I ve III"},
      {"key": "D", "text": "II ve III"},
      {"key": "E", "text": "I, II ve III"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Büyük Selçuklu Sultanı Alp Arslan, 1071 Malazgirt Zaferi'nden sonra komutanlarına 'Fethedilen yer fethedenin malıdır' anlayışıyla fethettikleri bölgeleri <strong>kılıç hakkı</strong> olarak vermiştir. Bu sayede I. Dönem Anadolu Beylikleri kurulmuştur."
  },
  {
    "id": "ekys2026-q3",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 3,
    "questionText": "Moğol İstilası'ndan kaçarak Anadolu'ya gelen kişiler olduğu gibi bu coğrafyada doğup yetişmiş çok sayıda ilim ve fikir adamı da vardı.\n\nBuna göre aşağıdakilerden hangisi Anadolu'da dünyaya gelmiş ve Türkçe divanı olan kişilerden biridir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Hoca Dehhanî"},
      {"key": "B", "text": "Mevlana Celaleddin Rumî"},
      {"key": "C", "text": "Bahaeddin Veled"},
      {"key": "D", "text": "Yunus Emre"},
      {"key": "E", "text": "Ömer Hayyam"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br><strong>Yunus Emre</strong>, Anadolu'da (Eskişehir-Sivrihisar yöresi) doğup büyümüş, tasavvufi şiirlerini yalın ve duru bir Türkçe ile yazarak Türkçe Divan ve Risaletü'n-Nushiyye eserlerini bırakmıştır. Mevlana ve Bahaeddin Veled Belh (Horasan) doğumludur."
  },
  {
    "id": "ekys2026-q4",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 4,
    "questionText": "İkinci Meşrutiyet Dönemi'nde Batıcılık düşüncesinin temsilcileri tarafından çıkarılan süreli yayın aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "İçtihat"},
      {"key": "B", "text": "Volkan"},
      {"key": "C", "text": "Mahfil"},
      {"key": "D", "text": "Meşveret"},
      {"key": "E", "text": "Mizan"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>II. Meşrutiyet devrinde Batıcılık (Garpçılık) akımının en önemli yayın organı Abdullah Cevdet tarafından çıkarılan <strong>İçtihat</strong> dergisidir."
  },
  {
    "id": "ekys2026-q5",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 5,
    "questionText": "Aşağıdakilerden hangisi Osmanlı Devleti'nde Tanzimat Dönemi'nde açılan eğitim kurumlarından biridir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Mühendishane-i Berrî-i Hümayun"},
      {"key": "B", "text": "Mühendishane-i Bahrî-i Hümayun"},
      {"key": "C", "text": "Mekteb-i Mülkiye"},
      {"key": "D", "text": "Tıbhane-i Âmire"},
      {"key": "E", "text": "Mekteb-i Harbiye"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br><strong>Mekteb-i Mülkiye</strong>, Tanzimat Dönemi'nde 1859 yılında Sultan Abdülmecid devrinde modern sivil mülki idareci (kaymakam vb.) yetiştirmek üzere açılmıştır."
  },
  {
    "id": "ekys2026-q6",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_cografya",
    "topicName": "2026 EKYS - Coğrafya",
    "category": "Genel Kültür - Coğrafya",
    "icon": "🌍",
    "questionNumber": 6,
    "questionText": "Türkiye, Kuzey Yarım Küre'de ve orta kuşakta yer almaktadır. Ülkenin bu konumuna bağlı olarak bazı coğrafi durum ve olaylar ortaya çıkmaktadır.\n\nAşağıdakilerden hangisi bu durum veya olaylar arasında yer almaz?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Güneye bakan yamaçların kuzeye bakan yamaçlara göre daha sıcak olması"},
      {"key": "B", "text": "Akarsu sıklığına bağlı olarak hidroelektrik enerji potansiyelinin yüksek olması"},
      {"key": "C", "text": "Güneş ışınlarının geliş açısının güneyden kuzeye doğru daralması"},
      {"key": "D", "text": "Kuzeyden esen rüzgârların genellikle sıcaklık ortalamalarını düşürmesi"},
      {"key": "E", "text": "Dört mevsimin belirgin olması nedeniyle turizm aktivitelerinin çeşitlenmesi"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Hidroelektrik potansiyelin yüksek olması enlem veya orta kuşak (mutlak/matematik konum) ile değil; Türkiye'nin engebeli ve yüksek yer şekillerine (özel/göreceli konum) bağlıdır."
  }
]

# Read existing questions
with open('data/questions-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

json_text = text.split('window.EKYS_EXTRACTED_QUESTIONS =')[1].strip().rstrip(';')
existing = json.loads(json_text)

# Remove any existing ekys2026 questions with same IDs to prevent duplicates
existing_filtered = [q for q in existing if not q['id'].startswith('ekys2026-q')]

# Append new ones
updated = existing_filtered + new_questions

js_content = f"// EKYS 2027 Odaklı Soru Veritabanı (2026 Çıkmış Sorular Dahil)\nwindow.EKYS_EXTRACTED_QUESTIONS = {json.dumps(updated, ensure_ascii=False, indent=2)};\n"

with open('data/questions-db.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Başarıyla güncellendi! Toplam soru sayısı: {len(updated)}")
