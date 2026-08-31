import json
import os

new_questions = [
  {
    "id": "ekys2026-q25",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 25,
    "questionText": "Millî Mücadele Dönemi'nde Türk ordusunun Batı Cephesi'nde kazandığı başarılar sonucunda TBMM Hükûmeti 1921 yılında\n\nI. Fransa,\nII. Yunanistan,\nIII. Sovyet Rusya\n\ndevletlerinden hangileriyle siyasi antlaşma imzalayarak varlığını kabul ettirmiştir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız II"},
      {"key": "C", "text": "I ve III"},
      {"key": "D", "text": "II ve III"},
      {"key": "E", "text": "I, II ve III"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>1921 yılında Sovyet Rusya ile Moskova Antlaşması (16 Mart 1921) ve Fransa ile Ankara Antlaşması (20 Ekim 1921) imzalanmıştır. Yunanistan ile 1921'de antlaşma imzalanmamıştır."
  },
  {
    "id": "ekys2026-q26",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 26,
    "questionText": "Lozan Barış Konferansı'nda Barış Antlaşması'na ek olarak bütünü oluşturan çok sayıda \"senetler\" (protokol, bildiri, sözleşme) imzalanmıştır.\n\nAşağıdaki senetlerden hangisinde yalnızca Türkiye ve Yunanistan'ın imzası bulunmaktadır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Boğazlar Rejimine İlişkin Sözleşme"},
      {"key": "B", "text": "Trakya Sınırına İlişkin Sözleşme"},
      {"key": "C", "text": "Genel Affa İlişkin Bildiri"},
      {"key": "D", "text": "Mübadele Sözleşmesi"},
      {"key": "E", "text": "Karaağaç Arazisi ile Bozcaada ve İmroz Adalarına İlişkin Protokol"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>30 Ocak 1923'te imzalanan Mübadele Sözleşmesi, doğrudan doğruya ve yalnızca Türkiye ile Yunanistan arasında imzalanmış ikili bir sözleşmedir."
  },
  {
    "id": "ekys2026-q27",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 27,
    "questionText": "1 Nisan 1923 tarihinde TBMM'de Meclisin yenilenmesiyle ilgili seçim kararının alınmasından sonra Mustafa Kemal tarafından 8 Nisan 1923'te yayımlanan seçim bildirgesi niteliğindeki belge aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Dokuz Umde"},
      {"key": "B", "text": "Misak-ı İktisadi"},
      {"key": "C", "text": "Halkçılık Beyannamesi"},
      {"key": "D", "text": "Tekalif-i Milliye Emirleri"},
      {"key": "E", "text": "Misakımillî"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Mustafa Kemal Paşa 1923 seçimlerine giderken inkılapların ve kurulacak partinin hedeflerini ortaya koyan <strong>Dokuz Umde</strong> bildirisini yayımlamıştır."
  },
  {
    "id": "ekys2026-q28",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 28,
    "questionText": "İsviçre'den davet edilen Profesör Albert Malche hazırladığı raporda \"Türkçe yayım yeteri kadar yoktur. Yabancı yayımları okuyup anlayacak öğrenci sayısı çok azdır. Türkçe dersler ufuk açıcı değil sadece bir ansiklopedinin özeti şeklinde ele alınmaktadır. Pratik dersler toplam eğitim süresinin en az üçte birini kapsamalıdır.\" ifadelerine yer vermiştir.\n\nAlbert Malche bu değerlendirmeleri aşağıdaki eğitim kurumlarından hangisiyle ilgili olarak yapmıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Darülfünun"},
      {"key": "B", "text": "Millet Mektepleri"},
      {"key": "C", "text": "Harp Okulu"},
      {"key": "D", "text": "Ankara Hukuk Mektebi"},
      {"key": "E", "text": "Dil ve Tarih-Coğrafya Fakültesi"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Prof. Dr. Albert Malche'nin 1932 raporu <strong>Darülfünun</strong> ile ilgilidir. Bu rapor neticesinde 1933 Üniversite Reformu ile Darülfünun kapatılıp İstanbul Üniversitesi kurulmuştur."
  },
  {
    "id": "ekys2026-q29",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_egitimyonetimi",
    "topicName": "2026 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🎓",
    "questionNumber": 29,
    "questionText": "Bir okul müdürü, katıldığı hizmet içi eğitimden sonra öğrendiği kavram ve konular hakkında eğitimi veren uzman ile aşağıdaki konuşmayı yapmıştır.\n\nOkul müdürü: Klasik örgüt kuramında yer alan kavramlardan bahsederken iş görenlerden hiç kimsenin birden fazla kişiden emir almaması gerektiğini söylediniz. Bu bana uygulanabilir gelmedi.\n\nEğitim uzmanı: Evet, haklısınız. Eğitim esnasında öyle söyledim fakat örgütler ve işler karmaşıklaştıkça bu ilke işlevselliğini yitirmiştir.\n\nBu konuşma Fayol'un Klasik Örgüt Kuramı ilkelerinden hangisiyle ilgilidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Düzen"},
      {"key": "B", "text": "Merkezîleşme"},
      {"key": "C", "text": "Yetki"},
      {"key": "D", "text": "İş bölümü"},
      {"key": "E", "text": "Komuta birliği"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Henri Fayol'un <strong>Komuta Birliği</strong> ilkesine göre bir çalışan yalnızca tek bir amirden emir almalı ve ona hesap vermelidir."
  },
  {
    "id": "ekys2026-q31",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_egitimyonetimi",
    "topicName": "2026 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🎓",
    "questionNumber": 31,
    "questionText": "İki farklı okul müdürünün uyguladıkları denetim modelleri aşağıda verilmiştir:\n\nI. okul müdürü: Öğretmende belirlenmiş standart davranışları gözlemlemeyi beklemektedir. Eğitim öğretim sürecini dikkate almaktadır ve değerlendirmelerini de buna uygun yapmaktadır.\n\nII. okul müdürü: Öncelikli olarak öğretmenin özelliklerini dikkate almaktadır. Değerlendirmenin ana ögesini mesleki yeterlik olarak görüp değerlendirmelerini öğretmenle etkileşimli olarak yapmaktadır. Denetim sürecinde de planlama, gözlem ve geri bildirim aşamalarını takip etmektedir.\n\nBu okul müdürlerinin benimsemiş oldukları denetim modelleri aşağıdakilerin hangisinde sırasıyla verilmiştir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Klinik - Gelişimsel"},
      {"key": "B", "text": "Bilimsel - Sanatsal"},
      {"key": "C", "text": "Öğretimsel - Klinik"},
      {"key": "D", "text": "Bilimsel - Klinik"},
      {"key": "E", "text": "Öğretimsel - Gelişimsel"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Standartlara ve davranışçı gözleme dayanan model <strong>Bilimsel Denetim</strong>; öğretmenle birebir etkileşimli planlama-gözlem-dönüt döngüsünü içeren model <strong>Klinik Denetim</strong>dir."
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
