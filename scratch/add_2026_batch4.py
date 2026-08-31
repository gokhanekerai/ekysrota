import json
import os

new_questions = [
  {
    "id": "ekys2026-q19",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 19,
    "questionText": "15 Mayıs 1919'da İzmir ve çevresini işgale başlayan ve Milne Hattı adı verilen bir çizgide durdurulan Yunan ordusunun, 22 Haziran 1920'de yeniden harekâta geçip Bursa, Balıkesir ve Alaşehir'i ele geçirerek işgal bölgesini genişletmesinin nedeni aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Osmanlı Hükûmeti'ni Sevr Antlaşması'nı imzalamaya zorlamak"},
      {"key": "B", "text": "Millî cemiyetlerin tek çatı altında birleşmesinin önüne geçmek"},
      {"key": "C", "text": "Mebusan Meclisi'nde Misakımillî'nin onaylanmasını önlemek"},
      {"key": "D", "text": "Ankara'da yeni bir meclisin toplanmasına engel olmak"},
      {"key": "E", "text": "Osmanlı Sadrazamı Tevfik Paşa'yı istifa etmeye zorlamak"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>İtilaf Devletleri, hazırlanan Sevr Antlaşması taslağını imzalamakta tereddüt eden Osmanlı Hükümeti'ne baskı kurmak amacıyla Yunan ordusunu Milne Hattı'ndan taarruza geçirmiş ve Bursa-Uşak hattını işgal ettirmiştir."
  },
  {
    "id": "ekys2026-q20",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 20,
    "questionText": "19 Mayıs 1919'da Samsun'a ayak basan Mustafa Kemal, Anadolu'daki direnişi tek çatı altında toplamak istiyordu. Bu amaçla Havza ve Amasya genelgelerini yayımlamış; Erzurum ve Sivas'ta düzenlenen kongrelerde ulusal kararların alınmasını sağlamıştır.\n\nAşağıdakilerden hangisi bu süre içerisinde gerçekleşmemiştir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Manda ve himayenin reddedilmesi"},
      {"key": "B", "text": "Heyet-i Temsiliyenin oluşturulması"},
      {"key": "C", "text": "Mustafa Kemal'in askerlikten istifa etmesi"},
      {"key": "D", "text": "Millî cemiyetlerin birleştirilmesi"},
      {"key": "E", "text": "İstiklal Mahkemelerinin kurulması"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>İstiklal Mahkemeleri kongreler sürecinde değil, TBMM açıldıktan sonra Hıyanet-i Vataniye ve Firariler Kanunlarını uygulamak üzere Eylül 1920'de kurulmuştur."
  },
  {
    "id": "ekys2026-q21",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 21,
    "questionText": "Mustafa Kemal, TBMM'nin açılmasından bir gün sonra, 24 Nisan 1920'de verdiği önergede \"Hükûmet kurmak zorunludur.\" ifadesini kullanmıştır.\n\nBu ifadeden hareketle\nI. İstanbul Hükûmeti'nin yok sayıldığı,\nII. yürütme gücünün TBMM'de olduğu,\nIII. çok partili sistemin benimsendiği\nyargılarından hangilerine ulaşılabilir?",
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
    "explanation": "Doğru Cevap: <strong>C</strong><br>24 Nisan Önergesi'nde hükümet kurulmasının zorunlu kılınması ve geçici bir padişah kaymakamı tanınmaması İstanbul Hükümeti'nin yok sayıldığını (I) ve Meclis Hükümeti sistemiyle yürütmenin mecliste olduğunu (II) gösterir."
  },
  {
    "id": "ekys2026-q22",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 22,
    "questionText": "Aşağıdakilerden hangisi verdiği vaazlar ve Sebilürreşad dergisinde yazdığı yazılarla halkı işgallere karşı direnişe katılmaya teşvik etmiş ve Millî Mücadele'yi desteklemek için Ankara'ya gelmiştir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Mehmet Âkif (Ersoy)"},
      {"key": "B", "text": "Adnan (Adıvar)"},
      {"key": "C", "text": "Hamdullah Suphi (Tanrıöver)"},
      {"key": "D", "text": "Şevket Süreyya (Aydemir)"},
      {"key": "E", "text": "Ahmet Hamdi (Tanpınar)"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>İstiklal Marşı şairimiz <strong>Mehmet Âkif Ersoy</strong>, başyazarı olduğu Sebilürreşad dergisi ve kürsü vaazlarıyla halkı bağımsızlık mücadelesine teşvik etmiştir."
  },
  {
    "id": "ekys2026-q23",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 23,
    "questionText": "Millî Mücadele Dönemi'nde cephelerin yeniden düzenlenmesini ve Kuvayımilliye güçlerinin düzenli orduya katılımını hızlandıran gelişme aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Kütahya-Eskişehir Muharebesi"},
      {"key": "B", "text": "Gediz Taarruzu"},
      {"key": "C", "text": "İkinci İnönü Savaşı"},
      {"key": "D", "text": "Sakarya Meydan Muharebesi"},
      {"key": "E", "text": "Büyük Taarruz"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Ekim 1920'deki <strong>Gediz Taarruzu</strong>'nun başarısızlığı, düzensiz Kuvayımilliye birlikleriyle savaş kazanılamayacağını göstererek Batı Cephesi'nin bölünmesine ve düzenli orduya geçişe neden olmuştur."
  },
  {
    "id": "ekys2026-q24",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 24,
    "questionText": "Millî Mücadele yıllarında TBMM Hükûmeti'nin Aralık 1920'de imzalamış olduğu, Kars ve çevresinin Türkiye'ye geri verileceği ve Sevr Antlaşması'nın geçersiz sayılacağı hükümlerinin yer aldığı antlaşma aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Gümrü Antlaşması"},
      {"key": "B", "text": "Ankara Antlaşması"},
      {"key": "C", "text": "Moskova Antlaşması"},
      {"key": "D", "text": "Kars Antlaşması"},
      {"key": "E", "text": "Lozan Antlaşması"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>3 Aralık 1920'de imzalanan <strong>Gümrü Antlaşması</strong> ile Ermenistan Sevr'i geçersiz saymış ve Kars/Sarıkamış Türkiye'ye bırakılmıştır."
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
