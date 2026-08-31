import json
import os

new_questions = [
  {
    "id": "ekys2026-q59",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 59,
    "questionText": "2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'ndeki öğrenme ortamları sınıflandırmaları göz önüne alındığında aşağıdaki eşleştirmelerden hangisi yanlıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Artırılmış gerçeklik tabanlı öğrenme ortamları - Web seminerleri"},
      {"key": "B", "text": "Çevrim içi öğrenme ortamları - Eğitim portalları"},
      {"key": "C", "text": "Geleneksel fiziksel ortamlar - Atölyeler"},
      {"key": "D", "text": "Sosyal öğrenme ortamları - Kulüpler ve organizasyonlar"},
      {"key": "E", "text": "Açık alan öğrenme ortamları - Spor eğitimi merkezleri"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Web seminerleri <strong>Çevrim İçi Öğrenme Ortamları</strong>na aittir; Artırılmış Gerçeklik ortamı değildir."
  },
  {
    "id": "ekys2026-q60",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 60,
    "questionText": "Bir öğretmen dersine \"Yerel yönetimler hakkında neler biliyorsunuz?\" sorusu ile başlayıp devamında her bir öğrencisinden;\n\nI. çeşitli kaynaklardan yaşadığı yerin yönetim birimleri ile ilgili bilgi toplamasını ve topladığı bilgileri kaydetmesini,\nII. yapılandırılmış görüşme formu hazırlamasını ve bu görüşme formunu kullanarak bir yetişkin ile görüşme yapmasını,\nIII. görüşme sonuçları ile araştırmalarından edindiği bilgileri karşılaştıran bir sunum hazırlamasını,\nIV. hazırladığı sunumu sınıfta arkadaşlarına sunmasını\n\nistemiştir.\n\n2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'ne göre bu öğretmenin temel aldığı öğrenme yaklaşımı aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Bağlam temelli öğrenme"},
      {"key": "B", "text": "Yaşantı temelli öğrenme"},
      {"key": "C", "text": "İş birlikli öğrenme"},
      {"key": "D", "text": "Proje temelli öğrenme"},
      {"key": "E", "text": "Sorgulamaya dayalı öğrenme"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Araştırıcı bir soruyla başlayıp veri toplama, görüşme yapma ve analiz ederek sonuca ulaşma süreci <strong>Sorgulamaya Dayalı Öğrenme</strong>dir."
  },
  {
    "id": "ekys2026-q61",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 61,
    "questionText": "2024 Türkiye Yüzyılı Maarif Modeli'nde yer alan ölçme araçlarından biri, öğrencilerin bilgileri düzenleme, ilişkilendirme ve analiz etme becerilerini değerlendirmek için oldukça işlevseldir. Bu ölçme aracında öğrencilere genellikle bir dizi veri, ifade veya soru verilir. Öğrencilerden bu bilgileri, verilen kategorilere göre doğru sırayla sınıflandırmaları veya yerleştirmeleri istenir. Öğrencinin sınıf düzeyine göre 3×3, 3×4 veya 4×4'lük kutulardan oluşan cevap alanları verilebilir.\n\nBu parçada bahsedilen ölçme aracı aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yapılandırılmış grid"},
      {"key": "B", "text": "Kontrol listesi"},
      {"key": "C", "text": "Kelime ilişkilendirme testi"},
      {"key": "D", "text": "Tanılayıcı dallanmış ağaç"},
      {"key": "E", "text": "Dereceli puanlama anahtarı"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Kutucuklar (3x3, 4x4 vb.) halinde sunulan ve çoklu kavramsal ilişkileri ölçen araç <strong>Yapılandırılmış Grid</strong>dir."
  },
  {
    "id": "ekys2026-q62",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 62,
    "questionText": "Aşağıdakilerden hangisi 2024 Türkiye Yüzyılı Maarif Modeli'nde yer alan sürece dayalı zenginleştirme boyutlarından biri değildir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Üst düzey düşünme"},
      {"key": "B", "text": "Açık uçluluk"},
      {"key": "C", "text": "Dönüşümler"},
      {"key": "D", "text": "Öğretim hızı"},
      {"key": "E", "text": "Akıl yürütme"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Üst düzey düşünme, açık uçluluk, derinleşme ve öğretim hızı sürece dayalı boyutlardır; Dönüşümler sürece dayalı zenginleştirmede yer almaz."
  },
  {
    "id": "ekys2026-q63",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 63,
    "questionText": "2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'nde yer alan okul temelli planlamayla ilgili aşağıdakilerden hangisi söylenemez?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Öğrenci katılımını destekler nitelikte olmalıdır."},
      {"key": "B", "text": "Yaparak ve yaşayarak öğrenmeye olanak tanımalıdır."},
      {"key": "C", "text": "Öğrencinin bütüncül gelişimine hizmet etmelidir."},
      {"key": "D", "text": "Öğrenme çıktıları dikkate alınmalıdır."},
      {"key": "E", "text": "Farklı zümre uygulamaları için ölçüt oluşturulmalıdır."}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Okul temelli planlama esnek ve yerel ihtiyaçları gözeten bir süreçtir; farklı zümreler için katı sınırlayıcı ölçütler oluşturmaz."
  },
  {
    "id": "ekys2026-q64",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 64,
    "questionText": "2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'nde yer alan program dışı etkinliklerin alt alanları ve bu alanların açıklamalarına ilişkin tablo aşağıda verilmiştir:\n\n| Alt Alan | Açıklama |\n|---|---|\n| I. Bireysel gelişimin desteklenmesi | Öğrencilere ilgi ve yeteneklerini keşfetme, öz güven oluşturma ve güçlü bir şahsiyet geliştirme fırsatı sunar. |\n| II. Zihinsel gelişimin desteklenmesi | Öğrencilerde stres, kaygı ve zorluklarla başa çıkma becerisini geliştirerek onlara akranları ve çevreleriyle etkileşim kurma fırsatı sunar. |\n| III. Sosyal-duygusal gelişimin desteklenmesi | Öğrencilere entelektüel büyüme, karar verme, eleştirel düşünme ve problem çözmeyi geliştirme fırsatı sunar. |\n| IV. Fiziksel gelişimin desteklenmesi | Öğrencileri sağlıklı gelişimleri konusunda desteklemenin yanı sıra becerileri hayat boyu yerine getirme ve sağlıklı hayat tarzı benimseme fırsatı sunar. |\n| V. Ahlaki gelişimin desteklenmesi | Birlikte çalışma, merhamet, dayanışma, adil rekabet, yardımlaşma gibi değerleri deneyimleme fırsatı sunar. |\n\nBu eşleştirmelerin doğru olması için numaralandırılmış alt alanlardan hangi ikisinin yer değiştirmesi gerekir?",
    "hasImage": True,
    "image": "assets/questions/ekys2026_q64_table.png",
    "options": [
      {"key": "A", "text": "I ve II"},
      {"key": "B", "text": "II ve III"},
      {"key": "C", "text": "II ve V"},
      {"key": "D", "text": "III ve IV"},
      {"key": "E", "text": "IV ve V"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Stresle başa çıkma ve akran etkileşimi <strong>Sosyal-Duygusal</strong> gelişim; problem çözme ve entelektüel büyüme ise <strong>Zihinsel</strong> gelişimdir. Dolayısıyla II ve III yer değiştirmelidir."
  },
  {
    "id": "ekys2026-q65",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 65,
    "questionText": "1982 Anayasası'na göre Türkiye Büyük Millet Meclisi tarafından kabul edilen kanunları Cumhurbaşkanı kural olarak en geç kaç gün içinde yayımlar?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "5"},
      {"key": "B", "text": "10"},
      {"key": "C", "text": "15"},
      {"key": "D", "text": "20"},
      {"key": "E", "text": "30"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>1982 Anayasası Madde 89 gereğince Cumhurbaşkanı, TBMM'ce kabul edilen kanunları <strong>15 gün</strong> içinde yayımlar."
  },
  {
    "id": "ekys2026-q66",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 66,
    "questionText": "1982 Anayasası'na göre aşağıdakilerden hangisi Millî Güvenlik Kurulunda yer almaz?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Cumhurbaşkanlığı Genel Sekreteri"},
      {"key": "B", "text": "Adalet Bakanı"},
      {"key": "C", "text": "İçişleri Bakanı"},
      {"key": "D", "text": "Dışişleri Bakanı"},
      {"key": "E", "text": "Cumhurbaşkanı Yardımcıları"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Cumhurbaşkanlığı Genel Sekreteri MGK üyesi değildir (bu makam 2018'de kaldırılmıştır)."
  },
  {
    "id": "ekys2026-q67",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 67,
    "questionText": "1982 Anayasası'na göre Kamu Denetçiliği Kurumu aşağıdakilerden hangisine bağlı olarak kurulmuştur?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Cumhurbaşkanlığı"},
      {"key": "B", "text": "Türkiye Büyük Millet Meclisi Başkanlığı"},
      {"key": "C", "text": "Türkiye İnsan Hakları ve Eşitlik Kurumu"},
      {"key": "D", "text": "Adalet Bakanlığı"},
      {"key": "E", "text": "Anayasa Mahkemesi"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Anayasa Madde 74'e göre Kamu Denetçiliği Kurumu, <strong>TBMM Başkanlığına</strong> bağlı olarak kurulmuştur."
  },
  {
    "id": "ekys2026-q68",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 68,
    "questionText": "222 sayılı İlköğretim ve Eğitim Kanunu'na göre çocuğun ailesinin yanında kalmasını gerektirecek şekilde ailede düğün olması durumunda okul idarelerince öğrencilere kural olarak bir yıl içinde en fazla kaç gün izin verilir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "5"},
      {"key": "B", "text": "10"},
      {"key": "C", "text": "15"},
      {"key": "D", "text": "20"},
      {"key": "E", "text": "30"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>222 Sayılı Kanun Madde 53'e göre zorunlu ailevi hallerde okul idaresince öğrenciye yılda en fazla <strong>15 gün</strong> izin verilebilir."
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
