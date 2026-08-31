import json
import os

new_questions = [
  {
    "id": "ekys2026-q43",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 43,
    "questionText": "2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'ne göre öğrencilerinin gelişimi sürecinde özellikle \"zamansal bütünlük\" kavramını dikkate alan bir öğretmen aşağıdakilerden hangisine odaklanmalıdır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Ruh ve beden bütünlüğünü korumada kendi kendini yönetme"},
      {"key": "B", "text": "Hayatta karşılaşacağı problemleri anlama ve çözmede bilgiyi etkili kullanma"},
      {"key": "C", "text": "Ahlaki ilkeleri anlayıp değerlendirme ve davranışa dönüştürme"},
      {"key": "D", "text": "Zihinsel gelişimin yanında bedensel ve duygusal gelişimi de dikkate alma"},
      {"key": "E", "text": "Toplumca sahip olunan ortak bilinci ve kültürü eğitim yoluyla kazandırma"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Zamansal Bütünlük; toplumun geçmişten devraldığı ortak kültürü, bilinci ve değerleri koruyarak eğitim yoluyla geleceğe aktarmayı ifade eder."
  },
  {
    "id": "ekys2026-q44",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 44,
    "questionText": "Aşağıdakilerden hangisi 2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'nin benimsediği bütüncül eğitim yaklaşımının hedeflerinden biri değildir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "İnsanı temel erdemler doğrultusunda yetiştirmek ve geleceğe hazırlamak"},
      {"key": "B", "text": "Eğitim programı ögelerinin birbirinden bağımsız olduğu sistematik bir model oluşturmak"},
      {"key": "C", "text": "Hedeflenen öğrenci profiline uyumlu paydaş rol ve sorumlulukları kazandırmak"},
      {"key": "D", "text": "Eğitim öğretim ve ölçme değerlendirme yöntem ve tekniklerine yol gösterici olmak"},
      {"key": "E", "text": "Bireyin tüm yönleriyle gelişimini temel alan özgün bir eğitim modeli tasarlamak"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Bütüncül eğitim modelinde program ögeleri birbirinden bağımsız değil, organik bir <strong>uyum ve bütünlük</strong> içerisindedir."
  },
  {
    "id": "ekys2026-q45",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 45,
    "questionText": "2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'ndeki bütüncül eğitim yaklaşımına göre aşağıdakilerden hangisi \"farklılaştırılmış öğretim\" bileşeni ile ilgilidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Okulların yerel ve bölgesel eğitim ihtiyaçlarını dikkate alma"},
      {"key": "B", "text": "Program dışında sosyal sorumluluk etkinlikleri yürütme"},
      {"key": "C", "text": "Bireysel durumların dikkate alınarak nitelikli çeşitliliğin sağlanması"},
      {"key": "D", "text": "Gelecekteki uygulamaları iyileştirmeye yönelik uygulayıcı yansıtmaları"},
      {"key": "E", "text": "Öğretmenin merkezde olduğu öğrenme yaşantıları düzenleme"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Farklılaştırılmış öğretim; öğrencilerin bireysel durum ve ihtiyaçları gözetilerek öğrenme sürecinde <strong>nitelikli çeşitlilik</strong> sağlanmasıdır."
  },
  {
    "id": "ekys2026-q46",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 46,
    "questionText": "Bir öğretmen, derste iklim değişikliği ve küresel ısınma konusu ile ilgili öğrencilere bir örnek olay çalışması yaptırmıştır. Bu kapsamda öğrenciler sırasıyla\n\n• Örnek olayla ilgili çözümleme yapmışlardır.\n• Örnek olayla ilgili sınıflandırmalar yapmışlardır.\n• Örnek olayı kendi cümleleriyle yorumlamışlardır.\n\n2025 Türkiye Yüzyılı Maarif Modeli Ortak Metni'ne göre bu öğretmenin bütünleşik becerilerden hangisine yönelik bir uygulama gerçekleştirdiği söylenebilir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Gözlemleme Becerisi"},
      {"key": "B", "text": "Özetleme Becerisi"},
      {"key": "C", "text": "Bilgi Toplama Becerisi"},
      {"key": "D", "text": "Yapılandırma Becerisi"},
      {"key": "E", "text": "Yansıtma Becerisi"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Maarif Modeli'nde <strong>Özetleme Becerisi</strong>; çözümleme yapma, sınıflandırma ve kendi ifadeleriyle yorumlama süreç bileşenlerinden oluşur."
  },
  {
    "id": "ekys2026-q47",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 47,
    "questionText": "Aşağıdakilerden hangisi 2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'nde yer alan Sosyal Bilimler Alan Becerileri'nden biri değildir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Mantıksal Muhakeme Becerisi"},
      {"key": "B", "text": "Tablo, Grafik, Şekil ve/veya Diyagram Becerisi"},
      {"key": "C", "text": "Mekânsal Düşünme Becerisi"},
      {"key": "D", "text": "Görsel Mesajı Okuma Becerisi"},
      {"key": "E", "text": "Sosyal Katılım Becerisi"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Görsel Mesajı Okuma genel okuryazarlık alanına aittir; Sosyal Bilimler Alan Becerileri arasında yer almaz."
  },
  {
    "id": "ekys2026-q48",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 48,
    "questionText": "Bir öğretmen, benlik eğilimlerinin gelişmesi amacıyla öğrencilerinin\n\n• yeni ve ilginç bir bilgi veya nesneyle karşılaştıklarında gözlemleme, araştırma, keşfetme ve anlama arzusu duymalarını,\n• bir işi/eylemi yerine getirme konusunda gayretli ve bu yöndeki kararları her türlü zorluğa karşı yılmaksızın uygulamada çaba göstermelerini,\n• belirlenen hedefleri gerçekleştirme sürecinde gerekli eylemleri planlama ve yürütme becerisine olan kişisel inanca sahip olmalarını\n\nhedeflemektedir.\n\n2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'ne göre bu öğretmen öğrencilerinde aşağıdaki benlik eğilimlerinden hangilerini geliştirmeyi hedeflemektedir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Merak, kendine güvenme, azim ve kararlılık"},
      {"key": "B", "text": "Bağımsızlık, azim ve kararlılık, kendine güvenme"},
      {"key": "C", "text": "Bağımsızlık, seçicilik, kendine inanma"},
      {"key": "D", "text": "Merak, azim ve kararlılık, kendine inanma"},
      {"key": "E", "text": "Kendine inanma, merak, seçicilik"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Keşfetme arzusu: <strong>Merak</strong>; Zorluklara rağmen yılmadan çalışma: <strong>Azim ve Kararlılık</strong>; Hedefleri başarabileceğine dair inanç: <strong>Kendine İnanma</strong>."
  }
]

with open('data/questions-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

json_text = text.split('window.EKYS_EXTRACTED_QUESTIONS =')[1].strip().rstrip(';')
existing = json.loads(json_text)

new_ids = {q['id'] for q in new_questions}
existing_filtered = [q for q in existing if q['id'] not in new_ids]
updated = existing_filtered + new_questions

js_content = f"// EKYS 2027 Odaklı Soru Veritabanı (2026 Çıkmış Sorular Dahil)\nwindow.EKYS_EXTRACTED_QUESTIONS = {json.dumps(updated, ensure_ascii=False, indent=2)};\n"

with open('data/questions-db.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Başarıyla güncellendi! Toplam soru sayısı: {len(updated)}")
