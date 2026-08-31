import json
import os

new_questions = [
  {
    "id": "ekys2026-q69",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 69,
    "questionText": "222 sayılı İlköğretim ve Eğitim Kanunu'na göre nüfus hüviyet cüzdanı bulunmayan veya henüz nüfus kaydı yaptırılmamış çocukların yaşlarını aşağıdakilerden hangisi tayin ve tespit eder?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "İhtiyar kurulu"},
      {"key": "B", "text": "İl sağlık müdürlüğü"},
      {"key": "C", "text": "İl gençlik ve spor müdürlüğü"},
      {"key": "D", "text": "Cumhuriyet savcılığı"},
      {"key": "E", "text": "Adli Tıp Kurumu"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>222 Sayılı Kanun Madde 47'ye göre nüfus cüzdanı bulunmayan çocukların yaşları <strong>ihtiyar kurulu</strong> tarafından tayin ve tespit edilir."
  },
  {
    "id": "ekys2026-q70",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 70,
    "questionText": "1739 sayılı Millî Eğitim Temel Kanunu'na göre \"İlköğretim görmek her Türk vatandaşının hakkıdır.\" ifadesi aşağıdaki ilkelerden hangisinin tanımında yer alır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Ferdin ve toplumun ihtiyaçları"},
      {"key": "B", "text": "Her yerde eğitim"},
      {"key": "C", "text": "Genellik ve eşitlik"},
      {"key": "D", "text": "Eğitim hakkı"},
      {"key": "E", "text": "Fırsat ve imkân eşitliği"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>1739 Sayılı Kanun Madde 7'de 'İlköğretim görmek her Türk vatandaşının hakkıdır.' ifadesi <strong>Eğitim hakkı</strong> ilkesinde yer alır."
  },
  {
    "id": "ekys2026-q71",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 71,
    "questionText": "1739 sayılı Millî Eğitim Temel Kanunu'na göre askerî öğrenciler hariç olmak üzere Türk vatandaşlarının yurt dışında eğitim, öğrenim ve ihtisas görmeleriyle ilgili Devlet hizmetlerini aşağıdakilerden hangisi düzenler?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Millî Eğitim Bakanlığı"},
      {"key": "B", "text": "Cumhurbaşkanlığı"},
      {"key": "C", "text": "Yükseköğretim Kurulu"},
      {"key": "D", "text": "Eğitim ve Öğretim Politikaları Kurulu"},
      {"key": "E", "text": "Dışişleri Bakanlığı"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>1739 Sayılı Kanun Madde 58'e göre askerî öğrenciler hariç yurt dışı eğitim hizmetlerini <strong>Millî Eğitim Bakanlığı</strong> düzenler."
  },
  {
    "id": "ekys2026-q72",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 72,
    "questionText": "1 sayılı Cumhurbaşkanlığı Teşkilatı Hakkında Cumhurbaşkanlığı Kararnamesi'ne göre aşağıdakilerden hangisi Ölçme, Değerlendirme ve Sınav Hizmetleri Genel Müdürlüğünün görev ve yetkileri arasında sayılmamıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Merkezî sistemle yürütülen resmî ve özel yerleştirme, bitirme, karşılaştırma sınavlarını planlamak, uygulamak ve değerlendirmek"},
      {"key": "B", "text": "Kamu kurum ve kuruluşları ile özel hukuk tüzel kişileri tarafından talep edilen mesleğe giriş, yeterlik, görevde yükselme ve benzeri sınav hizmetlerini yürütmek"},
      {"key": "C", "text": "Sınavlara ilişkin değerlendirme ve sonuç belgelerinin düzenlenmesi ile itirazların incelenmesi işlemlerini yürütmek"},
      {"key": "D", "text": "Genel Müdürlük tarafından yapılan sınavlarda sorulacak soruları hazırlamak veya hazırlatmak, denetlemek ve güvenli bir şekilde saklanması için gerekli tedbirleri almak"},
      {"key": "E", "text": "Yükseköğretime giriş sistemine ilişkin usul ve esasların belirlenmesinde ilgili birim, kurum ve kuruluşlarla iş birliği yapmak"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Yükseköğretime giriş sistemiyle ilgili iş birliği yapma görevi <strong>Ortaöğretim Genel Müdürlüğü</strong>'ne aittir."
  },
  {
    "id": "ekys2026-q73",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 73,
    "questionText": "• Eğitim sistemini, eğitim ve öğretim plan ve programlarını, ders kitaplarını hazırlatmak, hazırlananları incelemek veya inceletmek, araştırmak, geliştirmek ve uygulamaya ilişkin görüşlerini Bakana sunmak\n• Bakanlık birimlerince hazırlanan eğitim ve öğretim programları, ders kitapları, yardımcı kitaplar ile öğretmen kılavuz kitaplarını incelemek, inceletmek ve sonucunu Bakana sunmak\n• Yurt dışı eğitim ve öğretim kurumlarından alınmış, ilköğretim ve ortaöğretim diploma ve öğrenim belgelerinin derece ve denkliklerine ilişkin ilke kararlarını Bakanın onayına sunmak\n\n1 Sayılı Cumhurbaşkanlığı Teşkilatı Hakkında Cumhurbaşkanlığı Kararnamesi'ne göre yukarıdaki görevler, Millî Eğitim Bakanlığının hangi hizmet birimi tarafından yerine getirilir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Talim ve Terbiye Kurulu Başkanlığı"},
      {"key": "B", "text": "Yükseköğretim ve Yurt Dışı Eğitim Genel Müdürlüğü"},
      {"key": "C", "text": "Temel Eğitim Genel Müdürlüğü"},
      {"key": "D", "text": "Teftiş Kurulu Başkanlığı"},
      {"key": "E", "text": "Yenilik ve Eğitim Teknolojileri Genel Müdürlüğü"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Programları, ders kitaplarını inceleme ve denklik ilke kararları alma yetkisi <strong>Talim ve Terbiye Kurulu Başkanlığı</strong>'na aittir."
  },
  {
    "id": "ekys2026-q74",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 74,
    "questionText": "657 sayılı Devlet Memurları Kanunu'na göre siyasi parti üyesi olduğu öğrenilen bir Devlet memuru hakkında yürütülecek disiplin kovuşturmasının başlatılması için belirlenen zaman aşımı süresi aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Üyeliğin öğrenildiği tarihten itibaren 1 ay"},
      {"key": "B", "text": "Üyeliğin gerçekleştiği tarihten itibaren 1 ay"},
      {"key": "C", "text": "Üyeliğin öğrenildiği tarihten itibaren 2 ay"},
      {"key": "D", "text": "Üyeliğin öğrenildiği tarihten itibaren 6 ay"},
      {"key": "E", "text": "Üyeliğin gerçekleştiği tarihten itibaren 6 ay"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Siyasi parti üyeliği memurluktan çıkarma cezası gerektirir; 657 Sayılı Kanun Madde 127 uyarınca bu cezada disiplin kovuşturmasına <strong>fiilin öğrenildiği tarihten itibaren 6 ay</strong> içinde başlanmalıdır."
  },
  {
    "id": "ekys2026-q75",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 75,
    "questionText": "657 sayılı Devlet Memurları Kanunu'na göre özürsüz olarak iki gün göreve gelmeyen memura kural olarak aşağıdaki disiplin cezalarından hangisi verilir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Uyarma"},
      {"key": "B", "text": "Kınama"},
      {"key": "C", "text": "Aylıktan kesme"},
      {"key": "D", "text": "Kademe ilerlemesinin durdurulması"},
      {"key": "E", "text": "Devlet memurluğundan çıkarma"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>657 Sayılı Kanun Madde 125/C-b bendine göre özürsüz veya izinsiz olarak 1 veya 2 gün göreve gelmemenin cezası <strong>Aylıktan kesme</strong>dir."
  },
  {
    "id": "ekys2026-q76",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 76,
    "questionText": "4688 sayılı Kamu Görevlileri Sendikaları ve Toplu Sözleşme Kanunu'na göre aşağıdakilerden hangisi sendikaların kurulabileceği hizmet kolları arasında sayılmamıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Basın, yayın ve iletişim hizmetleri"},
      {"key": "B", "text": "Kültür ve sanat hizmetleri"},
      {"key": "C", "text": "Tarım ve ormancılık hizmetleri"},
      {"key": "D", "text": "Diyanet ve vakıf hizmetleri"},
      {"key": "E", "text": "Yargı ve adalet hizmetleri"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>4688 Sayılı Kanun'da 11 hizmet kolu sayılmıştır; 'Yargı ve adalet hizmetleri' adında bir hizmet kolu yoktur (adliye personeli Büro, bankacılık ve sigortacılık hizmet kolundadır)."
  },
  {
    "id": "ekys2026-q77",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 77,
    "questionText": "4688 sayılı Kamu Görevlileri Sendikaları ve Toplu Sözleşme Kanunu'na göre aşağıdakilerden hangisi sendika üyesi olabilir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Millî Güvenlik Kurulu Genel Sekreterliğinde çalışan kamu görevlileri"},
      {"key": "B", "text": "Cumhurbaşkanlığı İletişim Başkanlığında çalışan kamu görevlileri"},
      {"key": "C", "text": "Mülkî idare amirleri"},
      {"key": "D", "text": "Üniversite rektörleri"},
      {"key": "E", "text": "Ceza infaz kurumlarında çalışan kamu görevlileri"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>MGK personeli, mülki amirler, rektörler ve cezaevi görevlileri sendika üyesi olamazken; <strong>Cumhurbaşkanlığı İletişim Başkanlığı çalışanları</strong> sendika üyesi olabilir."
  },
  {
    "id": "ekys2026-q78",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 78,
    "questionText": "5018 sayılı Kamu Malî Yönetimi ve Kontrol Kanunu'na göre aşağıdakilerden hangisi Kanun'a ekli (II) sayılı cetvelde sayılan özel bütçeli idarelerden biridir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Ölçme, Seçme ve Yerleştirme Merkezi Başkanlığı"},
      {"key": "B", "text": "Yargıtay"},
      {"key": "C", "text": "Emniyet Genel Müdürlüğü"},
      {"key": "D", "text": "Tapu ve Kadastro Genel Müdürlüğü"},
      {"key": "E", "text": "Gelir İdaresi Başkanlığı"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Yargıtay, Emniyet, Tapu Kadastro ve Gelir İdaresi (I) sayılı cetvelde genel bütçeli iken; <strong>ÖSYM Başkanlığı</strong> (II) sayılı cetvelde özel bütçeli idaredir."
  },
  {
    "id": "ekys2026-q79",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 79,
    "questionText": "5442 sayılı İl İdaresi Kanunu'na göre yeni bir ilin kurulması\n\nI. kanun,\nII. Cumhurbaşkanı kararı,\nIII. Cumhurbaşkanlığı kararnamesi\n\nişlemlerinden hangileriyle gerçekleştirilebilir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız III"},
      {"key": "C", "text": "I ve II"},
      {"key": "D", "text": "II ve III"},
      {"key": "E", "text": "I, II ve III"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>5442 Sayılı İl İdaresi Kanunu Md. 2 ve Anayasa Md. 126 uyarınca yeni bir ilin kurulması veya kaldırılması <strong>yalnızca KANUNLA</strong> yapılır."
  },
  {
    "id": "ekys2026-q80",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 80,
    "questionText": "3071 sayılı Dilekçe Hakkının Kullanılmasına Dair Kanun'a göre Türkiye Büyük Millet Meclisine gönderilen dilekçelerde dilekce sahibine dair\n\nI. geçerli elektronik posta adresi,\nII. Türkiye Cumhuriyeti kimlik numarası,\nIII. iş veya ikametgâh adresi\n\nbilgilerinden hangilerinin bulunması zorunlu sayılmıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız III"},
      {"key": "C", "text": "I ve II"},
      {"key": "D", "text": "II ve III"},
      {"key": "E", "text": "I, II ve III"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>3071 Sayılı Kanun Madde 4'e göre dilekçede dilekçe sahibinin adı-soyadı, imzası ile <strong>iş veya ikametgâh adresinin</strong> bulunması zorunludur."
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
