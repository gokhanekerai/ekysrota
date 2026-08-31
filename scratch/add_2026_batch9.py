import json
import os

new_questions = [
  {
    "id": "ekys2026-q49",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 49,
    "questionText": "2024 Türkiye Yüzyılı Maarif Modeli'nde beceri kazanma sürecindeki işlem adımları aşağıdaki kavramların hangisiyle ifade edilmiştir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Alan Becerisi"},
      {"key": "B", "text": "Okuryazarlık"},
      {"key": "C", "text": "Öğrenme Kanıtları"},
      {"key": "D", "text": "Süreç Bileşeni"},
      {"key": "E", "text": "Köprü Kurma"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Maarif Modeli'nde bir becerinin eyleme dökülme ve kazanılma işlem adımlarına <strong>Süreç Bileşeni</strong> adı verilir."
  },
  {
    "id": "ekys2026-q50",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 50,
    "questionText": "Bir Fizik Öğretmeni, 2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'nde yer alan sosyal-duygusal öğrenme becerilerine ilişkin aşağıdaki tabloyu hazırlamıştır. Tabloda \"Sosyal Yaşam Becerileri ve Ortak/Birleşik Beceriler\" üst başlığı ve bu beceri gruplarına ilişkin alt becerilere yer vermiştir. Ancak tabloda bazı becerilerin sınıflandırılmasında hata olduğunu görmüştür:\n\n| Sosyal Yaşam Becerileri | Ortak/Birleşik Beceriler |\n|---|---|\n| İletişim | Uyum |\n| Sorumlu karar verme | Esneklik |\n| Sosyal Farkındalık | İş birliği |\n\nBu tabloda yapılan sınıflandırma hatası aşağıdaki becerilerden hangilerinin yeri değiştirilirse düzeltilmiş olur?",
    "hasImage": True,
    "image": "assets/questions/ekys2026_q50_table.png",
    "options": [
      {"key": "A", "text": "İletişim ile Esneklik"},
      {"key": "B", "text": "Sorumlu karar verme ile Esneklik"},
      {"key": "C", "text": "Sorumlu karar verme ile İş birliği"},
      {"key": "D", "text": "Sosyal farkındalık ile Uyum"},
      {"key": "E", "text": "Sosyal farkındalık ile İş birliği"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>İş birliği Sosyal Yaşam Becerileri altında; Sorumlu karar verme ise Ortak/Birleşik Beceriler altında yer almalıdır."
  },
  {
    "id": "ekys2026-q51",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 51,
    "questionText": "2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'ne göre Erdem-Değer-Eylem Çerçevesi'nin bileşenlerinden birini de \"İçsel Ahenge Sahip Huzurlu İnsan\" kategorisi oluşturmaktadır.\n\nAşağıdakilerden hangisi \"İçsel Ahenge Sahip Huzurlu İnsan\" kapsamında yer alan değerlerden biri değildir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Estetik"},
      {"key": "B", "text": "Sabır"},
      {"key": "C", "text": "Çalışkanlık"},
      {"key": "D", "text": "Mütevazılık"},
      {"key": "E", "text": "Mahremiyet"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Sabır, çalışkanlık, mütevazılık ve mahremiyet içsel ahenk değerlerindendir. Estetik ise dış dünyayla ahenk ve sanat boyutuna aittir."
  },
  {
    "id": "ekys2026-q52",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 52,
    "questionText": "2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'ne göre okuryazarlık becerilerinde \"sistemin parçalarını belirleme\" olarak ifade edilen düzey aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Esneklik"},
      {"key": "B", "text": "İşlevsellik"},
      {"key": "C", "text": "Eylemsellik"},
      {"key": "D", "text": "Farkındalık"},
      {"key": "E", "text": "Bütünlük"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Okuryazarlık becerileri basamaklarında 'sistemin parçalarını belirleme' <strong>Farkındalık</strong> düzeyini ifade eder."
  },
  {
    "id": "ekys2026-q53",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 53,
    "questionText": "2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'ne göre disiplinler arası ilişkiler öğrencilere\n\nI. çoklu bakış açıları geliştirme,\nII. farklı disiplinlerin konu alanları arasında bağlantılar kurma,\nIII. yapay zekâ, dijital teknolojiler ve aile okuryazarlığı konularında uzmanlaşma\n\nkatkılarından hangilerini sağlamaktadır?",
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
    "explanation": "Doğru Cevap: <strong>C</strong><br>Disiplinler arası yaklaşım çoklu bakış açısı (I) ve alanlar arası bağlantı kurma (II) sağlar. K12 düzeyinde doğrudan uzmanlaşma yer almaz."
  },
  {
    "id": "ekys2026-q54",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 54,
    "questionText": "\"... sürecin niteliğinin artmasına katkı sağlamaktadır. Öğrenme çıktılarında odağa alınan becerilerin yanı sıra bu becerilerle ilişkilendirilen ve öğrenme öğretme faaliyetlerinde anlam bulan diğer becerilere de yer verildiği görülmektedir.\"\n\nAli Bey aşağıdaki sorulardan hangisini cevaplamıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yaşam becerilerinin temel aşamaları hangi bilişsel düzeye göre biçimlendirilmiştir"},
      {"key": "B", "text": "Öğretim programlarında yer alan beceriler hangi yöntem/tekniklerle öğretilecektir"},
      {"key": "C", "text": "Beceriler arası ilişkiler öğretim programlarında nasıl ele alınmıştır"},
      {"key": "D", "text": "Becerilerin ölçülüp değerlendirmesinde hangi araçlar kullanılacaktır"},
      {"key": "E", "text": "Becerilerin okul dışındaki yaşamla ilişkilendirilmesi hangi boyutlarda ele alınmıştır"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Paragrafta odak becerilerin diğer alan becerileriyle ilişkisi ve programdaki bütünleşmesi açıklanmıştır."
  },
  {
    "id": "ekys2026-q55",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 55,
    "questionText": "2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'nin temel bileşenlerinden biri olan içerik çerçevesi, öğrenme sürecinde ele alınan bilgi kümesini temsil etmektedir. Becerilerin gerçekleşmesine zemin hazırlayan içerik çerçevesi, becerilerle bir araya gelerek öğrenme çıktılarını oluşturmaktadır.\n\nBuna göre içerik çerçevesi aşağıdaki sorulardan hangisine cevap vermektedir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Öğretmen nasıl öğretmelidir?"},
      {"key": "B", "text": "Öğrenci ne zaman öğrenmelidir?"},
      {"key": "C", "text": "Öğrenci ihtiyaçları nelerdir?"},
      {"key": "D", "text": "Öğrenci beklentileri nelerdir?"},
      {"key": "E", "text": "Öğrenci ne bilmelidir?"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>İçerik çerçevesi öğrencinin edinmesi gereken bilgi kümesini, yani 'Öğrenci ne bilmelidir?' sorusunu yanıtlar."
  },
  {
    "id": "ekys2026-q56",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 56,
    "questionText": "Dersinde çarpma ve bölme işlemlerine yer verecek olan bir matematik öğretmeni, öğrencilerin bu işlemleri öğrenebilmeleri için gerekli olan toplama ve çıkarma işlemini bildiklerini düşünerek dersi işlemeye başlamıştır.\n\n2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'ne göre öğretmenin bu düşünce ile hareket etmesi aşağıdaki kavramlardan hangisi ile açıklanır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Öğrenme kanıtı"},
      {"key": "B", "text": "Temel kabuller"},
      {"key": "C", "text": "Köprü kurma"},
      {"key": "D", "text": "Zenginleştirme"},
      {"key": "E", "text": "Biçimlendirme"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Öğrencilerin yeni bir konuyu öğrenmeden önce sahip oldukları varsayılan ön koşul beceriler <strong>Temel Kabuller</strong> olarak adlandırılır."
  },
  {
    "id": "ekys2026-q57",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 57,
    "questionText": "2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'ne göre aşağıdakilerden hangisi ön değerlendirmenin amaçları arasında yer almaz?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Öğrencilerin mevcut bilgi ve beceri düzeylerini belirlemek"},
      {"key": "B", "text": "Öğrenme sürecinde öğrenci ihtiyaçlarını tespit etmek"},
      {"key": "C", "text": "Öğrencilerin öğrenme çıktı ve beklentilerini anlamak"},
      {"key": "D", "text": "Öğrencilerin derse aktif katılımlarını sağlamak"},
      {"key": "E", "text": "Öğretim programının içeriğini özelleştirmek"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Öğrencilerin derse aktif katılımını sağlamak doğrudan öğrenme-öğretme uygulamalarının (ders sürecinin) amacıdır; ön değerlendirmenin değil."
  },
  {
    "id": "ekys2026-q58",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 58,
    "questionText": "Bir öğretmen, sosyal bilgiler dersinde \"Toplumsal sorun\" konusuna başlarken, öğrencilerin dikkatini çekmek için aşağıdaki haberi tahtaya yansıtmıştır:\n\n\"...Avrupa Çevre Ajansı tarafından yayımlanan rapora göre Avrupa; kirlilik, nehirlerin fiziksel özellikleri ve aşırı çekilmesi ve iklim değişikliği nedeniyle gelecekte sürekli yeterli ve iyi kalitede suya sahip olamayabilir...\"\n\nSonrasında öğrencilerden bu haber üzerine tartışmalarını istemiş ve bu tartışmaların düşünme sürecini başlatıcı rol oynamasını sağlamıştır.\n\n2025 Türkiye Yüzyılı Maarif Modeli Ortak Metni'ne göre bu öğretmen öğrenme-öğretme yaşantıları bileşenlerinden hangisine yönelik bir uygulama yapmıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Temel kabuller"},
      {"key": "B", "text": "Ön değerlendirme süreci"},
      {"key": "C", "text": "Köprü kurma"},
      {"key": "D", "text": "Öğrenme-öğretme uygulamaları"},
      {"key": "E", "text": "Farklılaştırma uygulamaları"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Dersin başlangıcında güncel hayatla ilişkilendirme yaparak ön bilgileri harekete geçirme ve düşünmeyi tetikleme aşaması <strong>Köprü Kurma</strong>dır."
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
