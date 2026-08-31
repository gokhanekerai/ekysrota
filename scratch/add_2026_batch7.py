import json
import os

new_questions = [
  {
    "id": "ekys2026-q37",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_egitimyonetimi",
    "topicName": "2026 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🎓",
    "questionNumber": 37,
    "questionText": "I. okula ilişkin standartlar belirlemesi, bu standartlara ulaşıp ulaşmadığını ölçmesi ve raporlaştırması,\nII. okulun başarı kriterlerini yakalamak için öğrencilerin başarısız oldukları konularda velileri bilgilendirmesi,\nIII. okulun gelişim sürecini değerlendirmek üzere öğretmenler ve velilerden gelen soruları cevaplaması\n\ndavranışlarından hangileri yönetim anlayışı olarak hesap verebilirliği benimsediğini göstermektedir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız III"},
      {"key": "C", "text": "I ve II"},
      {"key": "D", "text": "II ve III"},
      {"key": "E", "text": "I, II ve III"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Hesap verebilirlik; okul hedeflerinin ölçülüp raporlanmasını (I), paydaşların şeffaf bilgilendirilmesini (II) ve veli/öğretmen sorularına yanıt verilmesini (III) kapsayan bütüncül bir anlayıştır."
  },
  {
    "id": "ekys2026-q38",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_egitimyonetimi",
    "topicName": "2026 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🎓",
    "questionNumber": 38,
    "questionText": "Bir görsel sanatlar öğretmeni resimlerde renklerin kullanımını öğrencilerin renk kullanım becerileri geliştikçe derslerinde daha ayrıntılı bir şekilde ele almaktadır. Gerektiğinde yaptığı tekrar ve hatırlatmalarla öğrencilerin renkleri etkili kullanmalarına destek olmaktadır.\n\nBu öğretmen ders içeriğini aşağıdaki içerik düzenleme yaklaşımlarından hangisine uygun olarak şekillendirmiştir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Konu ağı - Proje merkezli"},
      {"key": "B", "text": "Modüler"},
      {"key": "C", "text": "Sarmal"},
      {"key": "D", "text": "Piramitsel"},
      {"key": "E", "text": "Çekirdek"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Öğrenci becerisi geliştikçe konuların genişleyip derinleşmesi ve tekrarlarla pekiştirilerek ilerletilmesi Bruner'in <strong>Sarmal (Spiral)</strong> yaklaşımıdır."
  },
  {
    "id": "ekys2026-q39",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_egitimyonetimi",
    "topicName": "2026 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🎓",
    "questionNumber": 39,
    "questionText": "Okul müdürü; bir öğrencinin derslerde sınıfın ilgisini dağıttığını, öğretmenlere zorluk çıkardığını ve arkadaşlarına karşı kaba tutum ve davranışlar sergilediğini öğrenmiştir. Öğrenciyi yakından izlemeye başlayan okul müdürü öğrencinin futbolu çok sevdiğini, bu konuda yetenekli olduğunu ve okul futbol takımına girmeyi çok istediğini fark etmiştir. Bunun üzerine öğrenciyi odasına çağırarak \"Futbolda yetenekli olduğunu gördüm. Öğretmenlerine ve arkadaşlarına karşı olumlu davranışlar sergilediğin takdirde seni okul futbol takımına alacağız.\" demiştir.\n\nÖğrenmede davranışçı görüşler dikkate alındığında okul müdürünün, öğrencinin istenmeyen davranışlarıyla başa çıkmada kullandığı yöntem aşağıdakilerden hangisine örnektir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Olumsuz pekiştirme"},
      {"key": "B", "text": "Premack ilkesi"},
      {"key": "C", "text": "Üst düzey koşullama"},
      {"key": "D", "text": "Şekillendirme"},
      {"key": "E", "text": "Karşıt koşullama"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Bireyin çok sevdiği yüksek olasılıklı bir etkinliğin (futbol takımına girmek), istenen davranışı pekiştirmek için ödül olarak sunulması <strong>Premack İlkesi (Büyükanne Kuralı)</strong>dir."
  },
  {
    "id": "ekys2026-q40",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_egitimyonetimi",
    "topicName": "2026 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🎓",
    "questionNumber": 40,
    "questionText": "Kriz durumları için doğal karar verme modelini kullanan bir okul yöneticisinin aşağıdakilerden hangisini yapması beklenmez?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Her bir alternatifin her adımını ayrıntılı olarak incelemesi"},
      {"key": "B", "text": "Yararlanabileceği eylem planlarını uygun ölçütler kullanarak oluşturması"},
      {"key": "C", "text": "İçinde bulunulan bağlama yönelik bilgi modellemesi yapması"},
      {"key": "D", "text": "Durumsal değerlendirmeyi ön plana çıkarması"},
      {"key": "E", "text": "Karar vermede süreç odaklı yaklaşımı kullanması"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Doğal Karar Verme Modeli (NDM), kriz ortamında yöneticinin durumsal ipuçlarına göre hızla tatmin edici bir karar almasını ifade eder. Rasyonel modellerdeki 'tüm alternatiflerin her adımını ayrıntılı incelemek' kriz anında beklenmez."
  },
  {
    "id": "ekys2026-q41",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 41,
    "questionText": "2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'nde bireyin; zihinsel, sosyal, duygusal, fiziksel ve ahlaki açıdan çok yönlü gelişimi için\n\nI. öğretim programları,\nII. dijital ekosistem,\nIII. öğretmen gelişimi\n\nunsurlarından hangileri birlikte uyum içinde hareket etmelidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız III"},
      {"key": "C", "text": "I ve II"},
      {"key": "D", "text": "II ve III"},
      {"key": "E", "text": "I, II ve III"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Maarif Modeli Ortak Metni'ne göre; öğretim programları, öğretmen gelişimi ve dijital ekosistem unsurları bireyin bütüncül gelişimi için birlikte uyum içinde hareket etmelidir."
  },
  {
    "id": "ekys2026-q42",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_maarif",
    "topicName": "2026 EKYS - Türkiye Yüzyılı Maarif Modeli",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "🌟",
    "questionNumber": 42,
    "questionText": "Aşağıdakilerden hangisi 2025 Türkiye Yüzyılı Maarif Modeli Öğretim Programları Ortak Metni'nde yer alan \"sorgulayıcı öğrenci profili\" özelliklerinden biri değildir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Öğrenme sürecine merakla yaklaşır ve konulara derinlemesine ilgi gösterir."},
      {"key": "B", "text": "Bilgi, olgu ya da sorunların nedenini anlamada farklı kaynaklardan yararlanır."},
      {"key": "C", "text": "Etkili iletişim becerilerine sahiptir ve takım çalışmasına katkı verir."},
      {"key": "D", "text": "Değişen koşullara uyum sağlama ve yeni fikirlere açık olma becerisine sahiptir."},
      {"key": "E", "text": "Sorumluluklarını yerine getirme konusunda tutarlı davranır."}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Sorumluluklarını yerine getirme konusunda tutarlı davranmak Maarif Modeli'nde <strong>Sorumlu Öğrenci Profili</strong>ne aittir; Sorgulayıcı profile ait değildir."
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
