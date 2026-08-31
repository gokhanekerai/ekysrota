import json
import os

new_questions = [
  {
    "id": "ekys2026-q13",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_mevzuat",
    "topicName": "2026 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "⚖️",
    "questionNumber": 13,
    "questionText": "1982 Anayasası'na göre eğitim ve öğrenim hakkı ve ödeviyle ilgili aşağıdaki ifadelerden hangisi yanlıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Eğitim ve öğretim kurumlarında okutulacak yabancı diller Cumhurbaşkanlığı kararnamesiyle düzenlenir."},
      {"key": "B", "text": "İlköğretim kız ve erkek bütün vatandaşlar için zorunludur ve Devlet okullarında parasızdır."},
      {"key": "C", "text": "Devlet, maddi imkânlardan yoksun başarılı öğrencilerin, öğrenimlerini sürdürebilmeleri amacı ile burslar ve başka yollarla gerekli yardımları yapar."},
      {"key": "D", "text": "Eğitim ve öğretim kurumlarında sadece eğitim, öğretim, araştırma ve inceleme ile ilgili faaliyetler yürütülür."},
      {"key": "E", "text": "Eğitim ve öğretim hürriyeti, Anayasaya sadakat borcunu ortadan kaldırmaz."}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>1982 Anayasası Madde 42 gereğince; eğitim ve öğretim kurumlarında okutulacak yabancı diller CBK ile değil, <strong>kanunla</strong> düzenlenir."
  },
  {
    "id": "ekys2026-q14",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_genelkultur",
    "topicName": "2026 EKYS - Genel Kültür",
    "category": "Genel Kültür (%20)",
    "icon": "🎭",
    "questionNumber": 14,
    "questionText": "Cengiz Aytmatov'un romanından uyarlanan; başrollerinde Kadir İnanır, Türkan Şoray ve Ahmet Mekin'in yer aldığı \"Sevgi neydi? Sevgi iyilikti, dostluktu, sevgi emekti.\" repliğiyle akıllarda kalan film aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Sevmek Zamanı"},
      {"key": "B", "text": "Selvi Boylum Al Yazmalım"},
      {"key": "C", "text": "Bizim Aile"},
      {"key": "D", "text": "Neşeli Günler"},
      {"key": "E", "text": "Mavi Boncuk"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Cengiz Aytmatov'un 'Kırmızı Eşarp' adlı romanından uyarlanan ve başrollerini Türkan Şoray ile Kadir İnanır'ın paylaştığı kült film <strong>Selvi Boylum Al Yazmalım</strong>'dır."
  },
  {
    "id": "ekys2026-q15",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_genelkultur",
    "topicName": "2026 EKYS - Genel Kültür",
    "category": "Genel Kültür (%20)",
    "icon": "📚",
    "questionNumber": 15,
    "questionText": "Türkiye'nin doğu yöresi âşıkları ve Azerbaycan âşıkları tarafından rağbet gören, âşıklık gücünün ve sanatının ortaya konulması bakımından önemsenen şiirlerdir. Bu şiirlerde âşıklar; iki dudağının arasına iğne koyar ve \"b, f, m, p, v\" dudaksıl seslerini kullanmadan rakiplerine cevap vermeyi amaçlar.\n\nHakkında bazı bilgiler verilen bu şiirler aşağıdakilerden hangisiyle adlandırılmaktadır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Balad"},
      {"key": "B", "text": "Deme"},
      {"key": "C", "text": "Lebdeğmez"},
      {"key": "D", "text": "Nefes"},
      {"key": "E", "text": "Arbav"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Âşık edebiyatında dudak ünsüzleri (b, p, m, v, f) kullanılmadan dudak arasına iğne koyularak yapılan atışmaya <strong>Lebdeğmez (Dudakdeğmez)</strong> denir."
  },
  {
    "id": "ekys2026-q16",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_genelkultur",
    "topicName": "2026 EKYS - Genel Kültür",
    "category": "Genel Kültür (%20)",
    "icon": "👑",
    "questionNumber": 16,
    "questionText": "Tarihe Tanıklığım, İslam Deklarasyonu, Doğu-Batı Arasında İslam adlı kitapların yazarı olan ve \"Bilge Kral\" olarak da adlandırılan devlet adamı aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Haydar Aliyev"},
      {"key": "B", "text": "Aliya İzzetbegoviç"},
      {"key": "C", "text": "Muhammed Ali Cinnah"},
      {"key": "D", "text": "Yaser Arafat"},
      {"key": "E", "text": "Cemal Abdünnasır"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Bosna-Hersek'in kurucu lideri ve 'Doğu ve Batı Arasında İslam' gibi eserlerin yazarı olan <strong>Bilge Kral Aliya İzzetbegoviç</strong>'tir."
  },
  {
    "id": "ekys2026-q17",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 17,
    "questionText": "Mustafa Kemal, yazmış olduğu Zabit ve Kumandan ile Hasbihâl adlı kitapta \"Bir gün işittim ki vatanım Selânik ve orada anam, kardeşim, bütün akraba ve taallukatım düşmana hibe edilmiştir.\" ifadelerine yer vermiştir.\n\nBu eserdeki ifade aşağıdaki savaşların hangisiyle ilgilidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Balkan Savaşları"},
      {"key": "B", "text": "Trablusgarp Savaşı"},
      {"key": "C", "text": "93 Harbi"},
      {"key": "D", "text": "Birinci Dünya Savaşı"},
      {"key": "E", "text": "1897 Osmanlı-Yunan Savaşı"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Mustafa Kemal'in memleketi Selanik, <strong>I. Balkan Savaşı (1912)</strong> sırasında kurşun atılmadan Yunan ordusuna teslim edilmiştir."
  },
  {
    "id": "ekys2026-q18",
    "testId": "ekys2026_tam",
    "testTitle": "2026 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2026_tarih",
    "topicName": "2026 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 18,
    "questionText": "\"İmzaladığımız mütareke sonucunda devletimizin bağımsızlığı, saltanatımızın hukuku bütünüyle korunmuştur. Bu mütareke galip ile mağlup arasında yapılan bir mütareke değil, belki savaş durumundan çıkmak isteyen denk iki kuvvet arasında çıkabilecek bir savaşa son vermek niteliğindedir.\"\n\nDönemin Bahriye Nazırı Rauf (Orbay) Bey tarafından basına verilen bu demeç aşağıdakilerin hangisiyle ilgilidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Erzincan Ateşkes Antlaşması"},
      {"key": "B", "text": "Sevr Antlaşması"},
      {"key": "C", "text": "Mondros Ateşkes Antlaşması"},
      {"key": "D", "text": "Brest-Litovsk Antlaşması"},
      {"key": "E", "text": "Mudanya Ateşkes Antlaşması"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>30 Ekim 1918'de Bahriye Nazırı Rauf Orbay tarafından imzalanan <strong>Mondros Ateşkes Antlaşması</strong> sonrası basına bu iyimser açıklama yapılmıştır."
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
