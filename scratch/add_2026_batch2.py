import json
import os

new_questions = [
  {
    "id": "ekys2026-q7",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_cografya",
    "topicName": "2026 EKYS - Coğrafya",
    "category": "Genel Kültür - Coğrafya",
    "icon": "🌍",
    "questionNumber": 7,
    "questionText": "Aşağıdaki akarsulardan hangisinin beslenmesinde karstik kaynakların etkisi daha azdır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Manavgat"},
      {"key": "B", "text": "Aksu"},
      {"key": "C", "text": "Göksu"},
      {"key": "D", "text": "Zamantı"},
      {"key": "E", "text": "Gediz"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Manavgat, Aksu, Göksu ve Zamantı karstik kaynaklarla beslenir. Gediz Nehri ise Ege graben kuşağında akar; karstik kaynaklarla değil, yağmur ve yerel sularla beslenir."
  },
  {
    "id": "ekys2026-q8",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_cografya",
    "topicName": "2026 EKYS - Coğrafya",
    "category": "Genel Kültür - Coğrafya",
    "icon": "🌍",
    "questionNumber": 8,
    "questionText": "Nüfus artışında doğum oranları; ölüm ve göçlere oranla daha fazla belirleyicidir.\n\nBuna göre günümüzde Türkiye'de doğum oranlarının düşmesi üzerinde aşağıdakilerden hangisinin etkili olduğu söylenemez?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Evlenme yaşının yükselmesi"},
      {"key": "B", "text": "Kentlerde yaşayan nüfusun artması"},
      {"key": "C", "text": "Kadınların iş gücüne daha fazla katılması"},
      {"key": "D", "text": "Uygulanan nüfus politikaları"},
      {"key": "E", "text": "Eğitimli nüfus oranının artması"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Türkiye'de uygulanan resmi nüfus politikaları doğum oranlarını düşürmeyi değil, doğurganlığı artırmayı (pronatalist) hedefler. Doğumların düşmesi kentleşme, kadının iş hayatına girmesi ve eğitim düzeyinin yükselmesi gibi sosyoekonomik nedenlere bağlıdır."
  },
  {
    "id": "ekys2026-q9",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_cografya",
    "topicName": "2026 EKYS - Coğrafya",
    "category": "Genel Kültür - Coğrafya",
    "icon": "🌍",
    "questionNumber": 9,
    "questionText": "I. Tekirdağ ve Edirne'de zengin demir cevheri yatakları son derece yaygındır.\nII. Adana ve Kayseri çevresinde önemli krom yatakları bulunmaktadır.\nIII. Van ve Bitlis'te büyük rezervli boksit yatakları söz konusudur.\nIV. Rize ve Artvin illerinde önemli bakır yatakları vardır.\n\nifadelerinden hangileri doğrudur?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "I ve II"},
      {"key": "B", "text": "I ve III"},
      {"key": "C", "text": "II ve III"},
      {"key": "D", "text": "II ve IV"},
      {"key": "E", "text": "III ve IV"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>II (Adana ve Kayseri'de krom) ve IV (Rize-Çayeli ve Artvin-Murgul'da bakır) doğrudur. Trakya'da demir değil linyit ve doğalgaz vardır; Boksit ise Konya-Seydişehir ve Antalya-Akseki'dedir."
  },
  {
    "id": "ekys2026-q10",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_cografya",
    "topicName": "2026 EKYS - Coğrafya",
    "category": "Genel Kültür - Coğrafya",
    "icon": "🌍",
    "questionNumber": 10,
    "questionText": "Aşağıdaki Türkiye haritasında dört farklı alan taranarak numaralandırılmıştır.\n\nBu alanların hangilerinde güneş enerjisi potansiyelinin daha fazla olduğu söylenebilir?",
    "hasImage": True,
    "image": "assets/questions/ekys2026_q10_map.png",
    "options": [
      {"key": "A", "text": "I ve II"},
      {"key": "B", "text": "I ve III"},
      {"key": "C", "text": "II ve III"},
      {"key": "D", "text": "II ve IV"},
      {"key": "E", "text": "III ve IV"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Güneşlenme süresi ve güneş enerjisi potansiyeli güney enlemlerde ve bulutluluğun az olduğu yerlerde en yüksektir. Akdeniz kıyı kuşağı (IV) ve Doğu Anadolu (III) yüksek potansiyele sahiptir."
  },
  {
    "id": "ekys2026-q11",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 11,
    "questionText": "\"Anayasa hükümlerinden hiçbiri, Devlete veya kişilere, Anayasayla tanınan temel hak ve hürriyetlerin yok edilmesini veya Anayasada belirtilenden daha geniş şekilde sınırlandırılmasını amaçlayan bir faaliyette bulunmayı mümkün kılacak şekilde yorumlanamaz.\"\n\nYukarıdaki hüküm, 1982 Anayasası'ndaki başlıklardan hangisinde yer alır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Temel hak ve hürriyetlerin kötüye kullanılamaması"},
      {"key": "B", "text": "Temel hak ve hürriyetlerin sınırlanması"},
      {"key": "C", "text": "Temel hak ve hürriyetlerin kullanılmasının durdurulması"},
      {"key": "D", "text": "Temel hak ve hürriyetlerin niteliği"},
      {"key": "E", "text": "Anayasanın bağlayıcılığı ve üstünlüğü"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>1982 Anayasası'nın <strong>Madde 14</strong> kenar başlığı 'Temel hak ve hürriyetlerin kötüye kullanılamaması'dır."
  },
  {
    "id": "ekys2026-q12",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 12,
    "questionText": "1982 Anayasası'na göre seçim kanunlarında yapılan değişiklikler, yürürlüğe girdiği tarihten itibaren en az ne kadar süre içinde yapılacak seçimlerde uygulanmaz?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "2 ay"},
      {"key": "B", "text": "4 ay"},
      {"key": "C", "text": "6 ay"},
      {"key": "D", "text": "1 yıl"},
      {"key": "E", "text": "2 yıl"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>1982 Anayasası'nın <strong>Madde 67 (Son Fıkra)</strong> hükmüne göre: 'Seçim kanunlarında yapılan değişiklikler, yürürlüğe girdiği tarihten itibaren bir yıl içinde yapılacak seçimlerde uygulanmaz.'"
  }
]

with open('data/questions-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

json_text = text.split('window.EKYS_EXTRACTED_QUESTIONS =')[1].strip().rstrip(';')
existing = json.loads(json_text)

# Filter out duplicate IDs from new_questions
new_ids = {q['id'] for q in new_questions}
existing_filtered = [q for q in existing if q['id'] not in new_ids]
updated = existing_filtered + new_questions

js_content = f"// EKYS 2027 Odaklı Soru Veritabanı (2026 Çıkmış Sorular Dahil)\nwindow.EKYS_EXTRACTED_QUESTIONS = {json.dumps(updated, ensure_ascii=False, indent=2)};\n"

with open('data/questions-db.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Başarıyla güncellendi! Toplam soru sayısı: {len(updated)}")
