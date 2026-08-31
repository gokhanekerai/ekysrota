import json
import os

new_questions = [
  {
    "id": "ekys2026-q32",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_egitimyonetimi",
    "topicName": "2026 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🎓",
    "questionNumber": 32,
    "questionText": "Bir okul müdürü düzenlediği veli toplantısında öğrencilerin bilişsel gelişiminin yanında duyuşsal ve psikomotor gelişimlerine de dikkat edilmesi gerektiğini ifade etmiştir. Fakat bazı veliler bu kavramların neyi ifade ettiğini bilmediklerini söylemiş ve okul müdüründen örnekler vererek bu kavramları kendilerine açıklamalarını istemiştir.\n\nBu iletişim sorununun çözülmesinde aşağıdakilerden hangisinin yapılması beklenir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Ortak deneyim alanının genişletilmesi"},
      {"key": "B", "text": "Kişi odaklı geri bildirim alınması"},
      {"key": "C", "text": "İletişim kanalının değiştirilmesi"},
      {"key": "D", "text": "Sosyal gürültünün ortadan kaldırılması"},
      {"key": "E", "text": "Velilerin empati yeteneğinin geliştirilmesi"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>İletişim sürecinde kaynağın mesajının alıcı tarafından doğru anlaşılması için kavramların somutlaştırılması ve <strong>ortak deneyim alanının genişletilmesi</strong> gerekir."
  },
  {
    "id": "ekys2026-q33",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_egitimyonetimi",
    "topicName": "2026 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🎓",
    "questionNumber": 33,
    "questionText": "Okul müdürü okul ortamının daha sağlıklı ve güvenli olması için neler yapılması gerektiğine yönelik bir toplantı düzenlemiştir. Toplantıya katılan öğretmenlerle veliler arasında fikir ayrılıkları ortaya çıkmış ve kısa süreli tartışmalar yaşanmıştır.\n\nToplantıda yaşanan bu çatışmanın türü aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Rol içi çatışma"},
      {"key": "B", "text": "Roller arası çatışma"},
      {"key": "C", "text": "Örgüt ile çevre arasındaki çatışma"},
      {"key": "D", "text": "Bireyin kendisinden kaynaklanan çatışma"},
      {"key": "E", "text": "Grup içi çatışma"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Okulun iç üyeleri (öğretmenler) ile dış çevresini oluşturan veliler arasındaki fikir ayrılıkları <strong>örgüt ile çevre arasındaki çatışma</strong>dır."
  },
  {
    "id": "ekys2026-q34",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_egitimyonetimi",
    "topicName": "2026 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🎓",
    "questionNumber": 34,
    "questionText": "Bir okuldaki 200 öğrenci, benzer içerikte hazırlanan iki sınava katılmış ve bu sınav sonuçlarına göre başarılı ve başarısız olarak sınıflandırılmıştır. Bu sınıflama sonucunda elde edilen başarılı ve başarısız öğrenci sayıları aşağıdaki tabloda verilmiştir:\n\n| | II. Sınav: Başarılı | II. Sınav: Başarısız |\n|---|:---:|:---:|\n| I. Sınav: Başarılı | 145 | 15 |\n| I. Sınav: Başarısız | 5 | 35 |\n\nBuna göre öğrencilerin sınıflandırılmasına ilişkin aşağıdakilerden hangisi yanlıştır?",
    "hasImage": True,
    "image": "assets/questions/ekys2026_q34_table.png",
    "options": [
      {"key": "A", "text": "I. sınava göre 160 öğrenci başarılı olarak sınıflandırılmıştır."},
      {"key": "B", "text": "II. sınava göre 50 öğrenci başarısız olarak sınıflandırılmıştır."},
      {"key": "C", "text": "Her iki sınava göre toplam 20 öğrenci farklı sınıflandırılmıştır."},
      {"key": "D", "text": "Öğrencilerin %90'ı her iki sınava göre aynı sınıflandırılmıştır."},
      {"key": "E", "text": "Her iki sınava göre 55 öğrenci başarısız olarak sınıflandırılmıştır."}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Her iki sınavda da başarısız olan öğrenci sayısı tabloda kesişim hücresinde <strong>35</strong> kişidir (55 değil)."
  },
  {
    "id": "ekys2026-q35",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_egitimyonetimi",
    "topicName": "2026 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🎓",
    "questionNumber": 35,
    "questionText": "Aşağıdakilerden hangisi otantik liderlik anlayışını benimseyen okul yöneticisinin sergileyeceği bir davranış değildir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Kişilerin ahlaki değerleriyle uyumlu bir tavır içerisinde olmalarını desteklemesi"},
      {"key": "B", "text": "Okuldaki süreçlerin öngörüldüğü gibi aksamadan gerçekleşmesini sağlaması"},
      {"key": "C", "text": "Söylemek istediği şeyi açık ve net bir şekilde ifade etmesi"},
      {"key": "D", "text": "Bir karara varmadan önce farklı bakış açılarını da değerlendirmesi"},
      {"key": "E", "text": "Bulunduğu ortamda güvene dayalı bir iklim oluşturması"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Süreçlerin rutin ve aksamadan işlemesini sağlama davranışı geleneksel <strong>İşlemsel (Bürokratik) Liderlik</strong> özelliğidir; otantik liderliğe ait değildir."
  },
  {
    "id": "ekys2026-q36",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_egitimyonetimi",
    "topicName": "2026 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🎓",
    "questionNumber": 36,
    "questionText": "Okulda güçlü bir kültür oluşturmak isteyen okul yönetimi iki konuya oldukça önem vermiştir. Bunlardan biri akademik başarıyı yakalamak için kaliteli bir eğitimin vazgeçilmez bir ilke olarak kabul edilmesidir. Diğeri ise eğitim alanında yapılan yeni araştırma ve uygulamaları değerlendirip tartışmak ve bu etkinliklere katılanları onurlandırmak amacıyla her on beş günde bir \"Eğitim Araştırmaları\" adı altında toplantılar düzenlemektir.\n\nOkul yönetiminin yaptığı bu iki uygulama sırasıyla Deal ve Kennedy'nin oluşturduğu aşağıdaki kültür boyutlarının hangileriyle ilgilidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Değerler - Kutlamalar"},
      {"key": "B", "text": "İletişim ağları - Kutlamalar"},
      {"key": "C", "text": "Değerler - Kahramanlar"},
      {"key": "D", "text": "İletişim ağları - Kahramanlar"},
      {"key": "E", "text": "İletişim ağları - Değerler"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Kaliteli eğitimin temel ilke/inanç kabul edilmesi <strong>Değerler</strong>; periyodik etkinlik ve onurlandırmalar ise <strong>Kutlamalar / Törenler (Ritüeller)</strong> boyutudur."
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
