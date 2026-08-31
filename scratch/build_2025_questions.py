import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 2025 EKYS Çıkmış Sınav Soruları (80 Soru - Kısa/Öz Açıklamalı)
ekys2025_questions = [
  # --- GENEL KÜLTÜR: TARİH (1-5) ---
  {
    "id": "ekys2025-q1",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_tarih",
    "topicName": "2025 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 1,
    "questionText": "Bozkırda yaşayan Türklerin, askerî bakımdan çevresindeki topluluklara üstünlük sağlamasında Türk ordularının, yerleşik kavimlerde görülen ağır teçhizatlı piyadelerin aksine hafif ve hareketli süvarilerden oluşması önemli rol oynamıştır.\n\nBuna göre ilk Türk topluluklarında süvari birliklerinin önem kazanmasında\nI. tarımsal faaliyetlerde bulunmaları,\nII. göçebe yaşam tarzına sahip olmaları,\nIII. atı ehlileştirmeleri\n\ngelişmelerinden hangileri etkili olmuştur?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız III"},
      {"key": "C", "text": "I ve III"},
      {"key": "D", "text": "I ve III"},
      {"key": "E", "text": "II ve III"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Göçebe bozkır hayatı (II) ve atın ehlileştirilmesi (III), Türk ordularının hızlı ve manevra kabiliyeti yüksek süvari birliklerinden oluşmasını sağlamıştır."
  },
  {
    "id": "ekys2025-q2",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_tarih",
    "topicName": "2025 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 2,
    "questionText": "Türkiye Selçuklularında, sultanın başkentten ayrıldığı zaman geçici süreyle vekil olarak atadığı görevli aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Emîrü'l-Ümerâ"},
      {"key": "B", "text": "Müstevfî"},
      {"key": "C", "text": "Müşrif"},
      {"key": "D", "text": "Nâib-i saltanat"},
      {"key": "E", "text": "Emîr-i Dâd"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Türkiye Selçuklularında sultan başkentte olmadığında devleti Niyâbet-i Saltanat makamı ve <strong>Nâib-i Saltanat</strong> yönetirdi."
  },
  {
    "id": "ekys2025-q3",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_tarih",
    "topicName": "2025 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 3,
    "questionText": "Osmanlı Devleti'nde fethedilen arazilerin kaydını (tahrir) tutan, dirliklerin dağıtımını yapan ve padişah fermanlarına tuğra çeken Divan-ı Hümayun üyesi aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Kazasker"},
      {"key": "B", "text": "Defterdar"},
      {"key": "C", "text": "Nişancı"},
      {"key": "D", "text": "Reisülküttap"},
      {"key": "E", "text": "Sadrazam"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Osmanlı'da ferman ve berātlara padişahın tuğrasını çeken, tahrir defterlerini tutan divan üyesi <strong>Nişancı</strong>dır."
  },
  {
    "id": "ekys2025-q4",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_tarih",
    "topicName": "2025 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 4,
    "questionText": "Osmanlı devlet teşkilatıyla ilgili\nI. Dergâh-ı Âlî,\nII. Bâb-ı Âlî,\nIII. Bâb-ı Hümâyun\n\nkavramlarından hangileri \"yüce kapı\" manasına gelip hükümet anlamında da kullanılmıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız II"},
      {"key": "C", "text": "Yalnız III"},
      {"key": "D", "text": "I ve II"},
      {"key": "E", "text": "II ve III"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br><strong>Bâb-ı Âlî</strong> (Yüce Kapı), Sadrazam konağı ve Osmanlı Hükümeti anlamında kullanılmıştır."
  },
  {
    "id": "ekys2025-q5",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_tarih",
    "topicName": "2025 EKYS - Tarih",
    "category": "Genel Kültür - Tarih",
    "icon": "🏛️",
    "questionNumber": 5,
    "questionText": "Aşağıdakilerden hangisi Osmanlı Devleti'nde devşirme çocukların hizmete alınıp eğitim gördükleri yerlerden biridir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Defterhâne"},
      {"key": "B", "text": "Rüus Kalemi"},
      {"key": "C", "text": "Menzilhâne"},
      {"key": "D", "text": "Enderun"},
      {"key": "E", "text": "Sıbyan Mektebi"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Devşirme sisteminden seçilen yetenekli çocukların devlet adamı ve asker olarak eğitildiği saray okulu <strong>Enderun</strong>dur."
  },

  # --- GENEL KÜLTÜR: COĞRAFYA (6-10) ---
  {
    "id": "ekys2025-q6",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_cografya",
    "topicName": "2025 EKYS - Coğrafya",
    "category": "Genel Kültür - Coğrafya",
    "icon": "🌍",
    "questionNumber": 6,
    "questionText": "Hidroelektrik potansiyelinden faydalanmak için Yeşilırmak Nehri üzerinde inşa edilen ve bu akarsuyun denize döküldüğü yere daha yakın konumda olan baraj aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Ataköy"},
      {"key": "B", "text": "Hirfanlı"},
      {"key": "C", "text": "Almus"},
      {"key": "D", "text": "Kılıçkaya"},
      {"key": "E", "text": "Suat Uğurlu"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Yeşilırmak üzerinde denize en yakın (aşağı çığırda) konumlanan barajlar Hasan Uğurlu ve <strong>Suat Uğurlu</strong> barajlarıdır."
  },
  {
    "id": "ekys2025-q7",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_cografya",
    "topicName": "2025 EKYS - Coğrafya",
    "category": "Genel Kültür - Coğrafya",
    "icon": "🌍",
    "questionNumber": 7,
    "questionText": "Türkiye fiziki haritasında Batı Toroslar, Orta Toroslar ve Doğu Anadolu kıvrım kuşaklarında yer alan dağ sıraları eşleştirmesinde aşağıdakilerden hangisi doğrudur?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Dedegöl Dağları - Bolkar Dağları - Kaçkar Dağları"},
      {"key": "B", "text": "Geyik Dağları - Bey Dağları - Kaçkar Dağları"},
      {"key": "C", "text": "Bolkar Dağları - Geyik Dağları - Tecer Dağları"},
      {"key": "D", "text": "Geyik Dağları - Aladağlar - Tecer Dağları"},
      {"key": "E", "text": "Aladağlar - Bolkar Dağları - Bey Dağları"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Haritada gösterilen alanlar sırasıyla Geyik Dağları (Batı Toroslar), Aladağlar (Orta Toroslar) ve Tecer Dağları'dır."
  },
  {
    "id": "ekys2025-q8",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_cografya",
    "topicName": "2025 EKYS - Coğrafya",
    "category": "Genel Kültür - Coğrafya",
    "icon": "🌍",
    "questionNumber": 8,
    "questionText": "Aşağıda bazı illerin 2024 yılındaki nüfusunun ortanca yaşları verilmiştir:\n• Şırnak: 23\n• Adana: 34\n• Eskişehir: 38,2\n• Zonguldak: 41,7\n• Sinop: 43,4\n\nYalnızca bu veriler dikkate alındığında\nI. Adana'nın nüfus miktarı Eskişehir'den fazladır.\nII. Zonguldak'ta ortanca yaş Şırnak'tan yüksektir.\nIII. Sinop'ta doğurganlık oranı tüm illerden yüksektir.\n\nifadelerinden hangileri söylenebilir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız II"},
      {"key": "C", "text": "Yalnız III"},
      {"key": "D", "text": "I ve II"},
      {"key": "E", "text": "II ve III"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Yalnızca ortanca yaş tablosundan toplam nüfus miktarı veya kesin doğurganlık çıkarılamaz; sadece II (Zonguldak'ta ortanca yaşın Şırnak'tan yüksek olduğu) söylenebilir."
  },
  {
    "id": "ekys2025-q9",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_cografya",
    "topicName": "2025 EKYS - Coğrafya",
    "category": "Genel Kültür - Coğrafya",
    "icon": "🌍",
    "questionNumber": 9,
    "questionText": "Türkiye maden haritasında işaretli alanlardan hangisinde işletilebilir altın yatakları (Uşak-Kışladağ / Kazdağları / Bergama çevresi) bulunmaktadır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "I (Güneydoğu Anadolu)"},
      {"key": "B", "text": "II (Ege Bölgesi / Uşak - İzmir civarı)"},
      {"key": "C", "text": "III (Orta Karadeniz)"},
      {"key": "D", "text": "IV (Trakya)"},
      {"key": "E", "text": "V (Hakkari Bölümü)"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Türkiye'de en önemli işletilebilir altın madeni yatakları Ege Bölgesi'nde (Uşak-Kışladağ, İzmir-Bergama) yer almaktadır."
  },
  {
    "id": "ekys2025-q10",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_cografya",
    "topicName": "2025 EKYS - Coğrafya",
    "category": "Genel Kültür - Coğrafya",
    "icon": "🌍",
    "questionNumber": 10,
    "questionText": "Türkiye'nin İstatistikî Bölge Birimleri Sınıflaması'na göre aşağıdaki Düzey 1 bölgelerinden hangisi tahıl ürünleri ekim ve üretimi açısından daha düşük paya sahiptir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Ortadoğu Anadolu"},
      {"key": "B", "text": "Batı Marmara"},
      {"key": "C", "text": "Doğu Karadeniz"},
      {"key": "D", "text": "Güneydoğu Anadolu"},
      {"key": "E", "text": "Batı Anadolu"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Doğu Karadeniz'de her mevsim yağışlı iklim ve engebeli yer şekilleri nedeniyle tahıl tarımı alanı ve üretimi en düşüktür."
  },

  # --- GENEL KÜLTÜR: TEMEL YURTTAŞLIK / GÜNCEL (11-16) ---
  {
    "id": "ekys2025-q11",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_yurttaslik",
    "topicName": "2025 EKYS - Yurttaşlık & Güncel",
    "category": "Genel Kültür (%20)",
    "icon": "⚖️",
    "questionNumber": 11,
    "questionText": "1982 Anayasası'na göre Yargıtay Cumhuriyet Başsavcısı aşağıdakilerin hangisi tarafından seçilir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Türkiye Büyük Millet Meclisi"},
      {"key": "B", "text": "Anayasa Mahkemesi"},
      {"key": "C", "text": "Hâkimler ve Savcılar Kurulu"},
      {"key": "D", "text": "Cumhurbaşkanı"},
      {"key": "E", "text": "Adalet Bakanı"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Yargıtay Cumhuriyet Başsavcısını, Yargıtay Genel Kurulunun göstereceği 5 aday arasından 4 yıl için <strong>Cumhurbaşkanı</strong> seçer."
  },
  {
    "id": "ekys2025-q12",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_yurttaslik",
    "topicName": "2025 EKYS - Yurttaşlık & Güncel",
    "category": "Genel Kültür (%20)",
    "icon": "⚖️",
    "questionNumber": 12,
    "questionText": "Siyasi partilerle ilgili aşağıdaki ifadelerden hangisi yanlıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Önceden izin almadan kurulurlar."},
      {"key": "B", "text": "Tüzük ve programları, eşitlik ve hukuk devleti ilkelerine aykırı olamaz."},
      {"key": "C", "text": "Devlet tarafından yeterli düzeyde ve hakça mali yardım yapılır."},
      {"key": "D", "text": "En az 20 Türk vatandaşının bir araya gelmesiyle kurulurlar."},
      {"key": "E", "text": "Mali denetimleri Anayasa Mahkemesi tarafından yapılır."}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Siyasi Partiler Kanunu'na göre siyasi partiler en az <strong>30</strong> Türk vatandaşı tarafından kurulur (20 değil)."
  },
  {
    "id": "ekys2025-q13",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_yurttaslik",
    "topicName": "2025 EKYS - Yurttaşlık & Güncel",
    "category": "Genel Kültür (%20)",
    "icon": "⚖️",
    "questionNumber": 13,
    "questionText": "Aşağıdaki düzenleyici ve denetleyici kurumlardan hangisi 1982 Anayasası'nda açıkça düzenlenmiştir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Radyo ve Televizyon Üst Kurulu (RTÜK)"},
      {"key": "B", "text": "Kişisel Verileri Koruma Kurumu"},
      {"key": "C", "text": "Kamu İhale Kurumu"},
      {"key": "D", "text": "Sermaye Piyasası Kurulu"},
      {"key": "E", "text": "Bilgi Teknolojileri ve İletişim Kurumu"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br><strong>RTÜK</strong>, 1982 Anayasası'nın 133. maddesinde anayasal bir kurul olarak doğrudan düzenlenmiştir."
  },
  {
    "id": "ekys2025-q14",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_yurttaslik",
    "topicName": "2025 EKYS - Yurttaşlık & Güncel",
    "category": "Genel Kültür (%20)",
    "icon": "🌍",
    "questionNumber": 14,
    "questionText": "İspanyol yazar Cervantes'in, kahramanıyla aynı adı taşıyan ünlü romanındaki Don Kişot karakteri, aşağıdakilerden hangisini \"devler\" olarak görüp onlara karşı savaşmıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yel Değirmenleri"},
      {"key": "B", "text": "Saat Kuleleri"},
      {"key": "C", "text": "Kale burçları"},
      {"key": "D", "text": "Çan Kuleleri"},
      {"key": "E", "text": "Dikili Taşlar"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Don Kişot, ova üzerindeki <strong>yel değirmenlerini</strong> dev zannederek onlara mızrağıyla saldırmıştır."
  },
  {
    "id": "ekys2025-q15",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_yurttaslik",
    "topicName": "2025 EKYS - Yurttaşlık & Güncel",
    "category": "Genel Kültür (%20)",
    "icon": "🌍",
    "questionNumber": 15,
    "questionText": "Kendine özgü çekim teknikleriyle sinema tarihinde önemli bir yere sahip olan, yönettiği Rashomon ve Yedi Samuray (Seven Samurai) filmleriyle bilinen dünyaca ünlü Japon yönetmen aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "James Cameron"},
      {"key": "B", "text": "Francis Ford Coppola"},
      {"key": "C", "text": "Clint Eastwood"},
      {"key": "D", "text": "Akira Kurosawa"},
      {"key": "E", "text": "Ridley Scott"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br><em>Rashomon</em> ve <em>Yedi Samuray</em> sinema tarihinin efsanevi Japon yönetmeni <strong>Akira Kurosawa</strong>'ya aittir."
  },
  {
    "id": "ekys2025-q16",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_yurttaslik",
    "topicName": "2025 EKYS - Yurttaşlık & Güncel",
    "category": "Genel Kültür (%20)",
    "icon": "🌍",
    "questionNumber": 16,
    "questionText": "Avrupa'ya Osmanlı Devleti'nden götürüldüğü ve Avrupa dillerine Türkçe'deki \"Tülbent\" kelimesinden türetilerek geçtiği düşünülen, zamanla Hollanda ile özdeşleşen çiçek aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Lavanta"},
      {"key": "B", "text": "Nergis"},
      {"key": "C", "text": "Lale"},
      {"key": "D", "text": "Gül"},
      {"key": "E", "text": "Karanfil"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Avrupa dillerine tülbentten (tulip) geçen ve Osmanlı'dan Hollanda'ya yayılan çiçek <strong>Lale</strong>dir."
  },

  # --- ATATÜRK İLKELERİ VE İNKILAP TARİHİ (17-24) ---
  {
    "id": "ekys2025-q17",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_inkilap",
    "topicName": "2025 EKYS - İnkılap Tarihi",
    "category": "Atatürk İlkeleri ve İnkılap Tarihi (%10)",
    "icon": "🇹🇷",
    "questionNumber": 17,
    "questionText": "Mondros Mütarekesi'nden sonra Osmanlı toprakları işgal edilmeye başlayınca Anadolu halkı işgallere karşı direniş için bazı çalışmalar yapmış ve bu çalışmalar Millî Mücadele hareketinin altyapısını oluşturmuştur.\n\nBuna göre\nI. millî cemiyetlerin kurulması,\nII. Kuvayımilliye'nin ortaya çıkması,\nIII. Nasihat heyetlerinin oluşturulması\n\ngelişmelerinden hangileri Millî Mücadele hareketine katkı sağlamıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız III"},
      {"key": "C", "text": "I ve II"},
      {"key": "D", "text": "I ve III"},
      {"key": "E", "text": "I, II ve III"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Millî cemiyetler (I) ve Kuvayımilliye (II) direnişi örgütlemiştir. Nasihat heyetleri (III) ise İstanbul Hükümeti tarafından halkı yatıştırmak için gönderilmiştir."
  },
  {
    "id": "ekys2025-q18",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_inkilap",
    "topicName": "2025 EKYS - İnkılap Tarihi",
    "category": "Atatürk İlkeleri ve İnkılap Tarihi (%10)",
    "icon": "🇹🇷",
    "questionNumber": 18,
    "questionText": "TBMM; varlığını ve otoritesini kabul ettirmek, Anadolu'da çıkan ayaklanmaları bastırmak, asker kaçaklarını toplamak, yürütülen mücadeleyi yasal bir zemine dayandırmak amacıyla bazı kararlar almıştır.\n\nAşağıdakilerden hangisi TBMM'nin bu yönde almış olduğu kararlardan biri değildir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Heyet-i Temsiliyenin oluşturulması"},
      {"key": "B", "text": "Hıyanet-i Vataniye Kanunu'nun çıkarılması"},
      {"key": "C", "text": "İstanbul Hükümetinin yapmış olduğu işlemlerin geçersiz sayılması"},
      {"key": "D", "text": "Teşkilat-ı Esasiye Kanunu'nun yürürlüğe girmesi"},
      {"key": "E", "text": "İstiklal Mahkemelerinin faaliyete geçmesi"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Heyet-i Temsiliye Erzurum Kongresi'nde kurulmuş ve TBMM açılınca görevi sona ermiştir; TBMM tarafından kurulmamıştır."
  },
  {
    "id": "ekys2025-q19",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_inkilap",
    "topicName": "2025 EKYS - İnkılap Tarihi",
    "category": "Atatürk İlkeleri ve İnkılap Tarihi (%10)",
    "icon": "🇹🇷",
    "questionNumber": 19,
    "questionText": "Vilâyât-ı Şarkiyye Müdâfaa-i Hukuk Cemiyeti ile birlikte Erzurum Kongresi'ni düzenleyen cemiyet aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Trabzon Muhafaza-i Hukuk-ı Milliye Cemiyeti"},
      {"key": "B", "text": "Kilikyalılar Cemiyeti"},
      {"key": "C", "text": "Redd-i İlhak Cemiyeti"},
      {"key": "D", "text": "Millî Kongre Cemiyeti"},
      {"key": "E", "text": "Trakya Paşaeli Müdafaa-i Hukuk Cemiyeti"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Erzurum Kongresi, Şark Vilayetleri Müdafaa-i Hukuk Cemiyeti ve <strong>Trabzon Muhafaza-i Hukuk Cemiyeti</strong> tarafından toplanmıştır."
  },
  {
    "id": "ekys2025-q20",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_inkilap",
    "topicName": "2025 EKYS - İnkılap Tarihi",
    "category": "Atatürk İlkeleri ve İnkılap Tarihi (%10)",
    "icon": "🇹🇷",
    "questionNumber": 20,
    "questionText": "Millî Mücadele yıllarında Türk kuvvetlerinin Yunan ordusuna karşı elde ettiği askerî başarılar TBMM Hükümetinin itibarını artırmış ve diğer devletlerle de siyasi anlaşmalar imzalanmasının yolunu açmıştır.\n\nBuna göre TBMM'ye bağlı kuvvetlerin Yunan ordusuna karşı elde ettiği askerî başarının siyasi bir kazanımı olarak\nI. Kars,\nII. Ankara,\nIII. Moskova\n\nantlaşmalarından hangileri imzalanmıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "I ve II"},
      {"key": "C", "text": "I ve III"},
      {"key": "D", "text": "II ve III"},
      {"key": "E", "text": "I, II ve III"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>I. İnönü sonrası Moskova (III), Sakarya Zaferi sonrası ise Kars (I) ve Ankara (II) antlaşmaları imzalanmıştır."
  },
  {
    "id": "ekys2025-q21",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_inkilap",
    "topicName": "2025 EKYS - İnkılap Tarihi",
    "category": "Atatürk İlkeleri ve İnkılap Tarihi (%10)",
    "icon": "🇹🇷",
    "questionNumber": 21,
    "questionText": "24 Temmuz 1923'te imzalanan Lozan Barış Antlaşması ile ilgili\nI. Kapitülasyonlar tamamen kaldırılmıştır.\nII. Boğazlar Komisyonu başkanı Türk olan uluslararası bir komisyona bırakılmıştır.\nIII. Hatay Türk sınırları içine katılmıştır.\n\nyargılarından hangileri doğrudur?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız II"},
      {"key": "C", "text": "I ve II"},
      {"key": "D", "text": "I ve II"},
      {"key": "E", "text": "I, II ve III"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong> (I ve II)<br>Lozan'da kapitülasyonlar kaldırılmış (I) ve Boğazlar Komisyonu kurulmuştur (II). Hatay ise 1939'da anavatana katılmıştır."
  },
  {
    "id": "ekys2025-q22",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_inkilap",
    "topicName": "2025 EKYS - İnkılap Tarihi",
    "category": "Atatürk İlkeleri ve İnkılap Tarihi (%10)",
    "icon": "🇹🇷",
    "questionNumber": 22,
    "questionText": "Atatürk Dönemi'nde sanayileşmeyi desteklemek, madenleri işletmek ve finansman sağlamak amacıyla\nI. Sümerbank,\nII. Etibank,\nIII. İş Bankası\n\nkurumlarından hangileri doğrudan devlet eliyle kamu iktisadi kuruluşu olarak faaliyete geçirilmiştir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız II"},
      {"key": "C", "text": "I ve II"},
      {"key": "D", "text": "II ve III"},
      {"key": "E", "text": "I, II ve III"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Cumhuriyet döneminde sanayi ve madenciliği finanse etmek için İş Bankası (1924), Sümerbank (1933) ve Etibank (1935) kurulmuştur."
  },
  {
    "id": "ekys2025-q23",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_inkilap",
    "topicName": "2025 EKYS - İnkılap Tarihi",
    "category": "Atatürk İlkeleri ve İnkılap Tarihi (%10)",
    "icon": "🇹🇷",
    "questionNumber": 23,
    "questionText": "Atatürk'ün \"Bizim milletimiz birbirinden çok farklı çıkarları olan sınıflardan değil; aksine birbirine ihtiyacı olan meslek gruplarından oluşur.\" sözü doğrudan hangi Atatürk ilkesiyle ilişkilidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Laiklik"},
      {"key": "B", "text": "Halkçılık"},
      {"key": "C", "text": "Devletçilik"},
      {"key": "D", "text": "Milliyetçilik"},
      {"key": "E", "text": "Cumhuriyetçilik"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Sınıfsız, ayrıcalıksız, dayanışma içindeki toplum yapısı ve eşitlik anlayışı <strong>Halkçılık</strong> ilkesinin temelidir."
  },
  {
    "id": "ekys2025-q24",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_inkilap",
    "topicName": "2025 EKYS - İnkılap Tarihi",
    "category": "Atatürk İlkeleri ve İnkılap Tarihi (%10)",
    "icon": "🇹🇷",
    "questionNumber": 24,
    "questionText": "Atatürk Dönemi'nde, 1930'lu yıllarda Dışişleri Bakanlığı görevini yürüten ve Montrö Boğazlar Sözleşmesi ile Sadabat Paktı görüşmelerinde Türkiye'yi temsil eden diplomat aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Bekir Sami Kunduh"},
      {"key": "B", "text": "Yusuf Kemal Tengirşenk"},
      {"key": "C", "text": "İsmet İnönü"},
      {"key": "D", "text": "Tevfik Rüştü Aras"},
      {"key": "E", "text": "Numan Menemencioğlu"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>1925-1938 yılları arasında aralıksız Dışişleri Bakanlığı yapan ve Montrö'yü imzalayan isim <strong>Tevfik Rüştü Aras</strong>'tır."
  },

  # --- DEĞERLER EĞİTİMİ (25-32) ---
  {
    "id": "ekys2025-q25",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_degerler",
    "topicName": "2025 EKYS - Değerler Eğitimi",
    "category": "Değerler Eğitimi (%10)",
    "icon": "🌱",
    "questionNumber": 25,
    "questionText": "Schwartz Değerler Kuramı'nda bireyin bağımsız düşünme, hareket etme, yaratıcılık ve keşfetme isteklerini ifade eden değer boyutu aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Uyum"},
      {"key": "B", "text": "Güvenlik"},
      {"key": "C", "text": "Öz Yönelim (Özerklik)"},
      {"key": "D", "text": "Geleneksellik"},
      {"key": "E", "text": "Evrenselcilik"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Schwartz kuramında bağımsız düşünce, seçim özgürlüğü ve yaratıcılık <strong>Öz Yönelim</strong> (Self-Direction) boyutudur."
  },
  {
    "id": "ekys2025-q26",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_degerler",
    "topicName": "2025 EKYS - Değerler Eğitimi",
    "category": "Değerler Eğitimi (%10)",
    "icon": "🌱",
    "questionNumber": 26,
    "questionText": "Değer öğretiminde öğrencilerin belirli bir konu hakkındaki fikirlerini büyük bir kağıda yazıp sırayla dolaşarak birbirlerinin yazdıklarına katkı sundukları aktif öğrenme tekniği aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Dedikodu"},
      {"key": "B", "text": "İstasyon"},
      {"key": "C", "text": "Akvaryum"},
      {"key": "D", "text": "Beyin eseri"},
      {"key": "E", "text": "Listeleme"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Öğrencilerin ikili gruplar halinde birbirleriyle görüş alışverişinde bulunup fikir üretmelerini sağlayan teknik <strong>Dedikodu</strong> tekniğidir."
  },
  {
    "id": "ekys2025-q27",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_degerler",
    "topicName": "2025 EKYS - Değerler Eğitimi",
    "category": "Değerler Eğitimi (%10)",
    "icon": "🌱",
    "questionNumber": 27,
    "questionText": "Değerlerle ilgili bir seminer sonrasında üç öğretmen arasında şu konuşma geçmiştir:\n• Mehmet Öğretmen: \"Bireyin veya grubun içinde bulunduğu şartlardan bağımsız davranması ve bunu sürdürmesidir.\"\n• Ahmet Öğretmen: \"Davranışı çeşitli açılardan yönlendiren çok yönlü standartlardır.\"\n• Ayşe Öğretmen: \"İstenilen durumların ve normatif standartların seçilerek belirli durumların ötesine geçilmesidir.\"\n\nÖğretmenler arasında geçen bu konuşma aşağıdakilerden hangisiyle ilgilidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Değerler eğitiminin gerekliliği"},
      {"key": "B", "text": "Değer kavramının tanımları"},
      {"key": "C", "text": "Değer erozyonunun nedenleri"},
      {"key": "D", "text": "Değer aktarmanın önemi"},
      {"key": "E", "text": "Değerlerin programlardaki yeri"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Öğretmenlerin her biri literatürdeki farklı bilim insanlarının <strong>değer kavramına yönelik tanımlarını</strong> açıklamaktadır."
  },
  {
    "id": "ekys2025-q28",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_degerler",
    "topicName": "2025 EKYS - Değerler Eğitimi",
    "category": "Değerler Eğitimi (%10)",
    "icon": "🌱",
    "questionNumber": 28,
    "questionText": "Bir okul müdürü, öğrencileri ile birlikte toplumdaki dezavantajlı gruplara yardım etmek amacıyla okulun bahçesinde kermes düzenlemiştir. Böylece öğrencilerinin toplumsal birlikteliğin oluşmasını destekleyici faaliyetlere katılmalarını teşvik etmiştir.\n\nOkul müdürü bu etkinlikle öğrencilerinde aşağıdaki değerlerden hangisinin gelişmesini daha fazla istemektedir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Bilimsellik"},
      {"key": "B", "text": "Barış"},
      {"key": "C", "text": "Dürüstlük"},
      {"key": "D", "text": "Özgürlük"},
      {"key": "E", "text": "Dayanışma"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Toplumsal birliktelik ve dezavantajlı gruplara yönelik kermes/yardım etkinlikleri <strong>Dayanışma</strong> ve yardımlaşma değerini pekiştirir."
  },
  {
    "id": "ekys2025-q29",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_degerler",
    "topicName": "2025 EKYS - Değerler Eğitimi",
    "category": "Değerler Eğitimi (%10)",
    "icon": "🌱",
    "questionNumber": 29,
    "questionText": "Bir okul müdürü, okulunda demokratik bir okul sürecini temel almakta; okul kurallarının oluşturulmasında tüm paydaşların bir araya gelip olayları tartışmaları ve birlikte karar almaları gerektiğine inanmaktadır.\n\nBu okul müdürünün benimsemiş olduğu değer eğitimi yaklaşımı aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Değer aşılama"},
      {"key": "B", "text": "Değer açıklama"},
      {"key": "C", "text": "Gözlem yoluyla öğrenme"},
      {"key": "D", "text": "Ahlaki muhakeme"},
      {"key": "E", "text": "Adil topluluk okulları (Kohlberg)"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Kohlberg'in <strong>Adil Topluluk Okulları</strong> yaklaşımında tüm okul paydaşları demokratik meclislerde bir araya gelerek kararları ortak alır."
  },
  {
    "id": "ekys2025-q30",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_degerler",
    "topicName": "2025 EKYS - Değerler Eğitimi",
    "category": "Değerler Eğitimi (%10)",
    "icon": "🌱",
    "questionNumber": 30,
    "questionText": "Dersinde değer analizi yaklaşımını kullanan bir öğretmen, sınıfa örnek olay getirmiş, kanıt toplatmış ancak süreçte değer problemine ilişkin öğrencilerine doğrudan çözüm önerileri sunmuştur.\n\nDeğer analizi yaklaşımının aşamaları ve ilkeleri göz önüne alındığında, bu öğretmenin yapmış olduğu hata aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Karar verme aşamasına uygulamanın sonunda yer vermesi"},
      {"key": "B", "text": "Ek kanıtlar toplatması"},
      {"key": "C", "text": "Öğrencilerine soru sorması"},
      {"key": "D", "text": "Çözüm önerilerini kendisinin sunması"},
      {"key": "E", "text": "Örnek olayın tartışmalı olması"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Değer analizinde öğretmen yönlendirici veya çözüm dikte edici olmamalı, alternatif çözüm önerilerini <strong>öğrencilerin</strong> üretmesi sağlanmalıdır."
  },
  {
    "id": "ekys2025-q31",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_degerler",
    "topicName": "2025 EKYS - Değerler Eğitimi",
    "category": "Değerler Eğitimi (%10)",
    "icon": "🌱",
    "questionNumber": 31,
    "questionText": "Türk bilim insanı Erol Güngör tarafından yedinci değer olarak \"millî değerlerin\" de eklendiği değer sınıflaması (Teorik, Ekonomik, Estetik, Sosyal, Politik, Dinî) aşağıdakilerden hangisi tarafından geliştirilmiştir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "C. Peterson"},
      {"key": "B", "text": "Eduard Spranger"},
      {"key": "C", "text": "Milton Rokeach"},
      {"key": "D", "text": "Shalom Schwartz"},
      {"key": "E", "text": "M. E. P. Seligman"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>6'lı temel insan tipleri ve değer sınıflaması <strong>Eduard Spranger</strong>'e aittir."
  },
  {
    "id": "ekys2025-q32",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_degerler",
    "topicName": "2025 EKYS - Değerler Eğitimi",
    "category": "Değerler Eğitimi (%10)",
    "icon": "🌱",
    "questionNumber": 32,
    "questionText": "Edip Ahmet Yüknekî tarafından kaleme alınan; nefsi terbiye etme, huy güzelliği, iyi insan olma, cömertlik gibi İslam ahlakı konularını şiirsel olarak işleyen eser aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Kutadgu Bilig"},
      {"key": "B", "text": "Tehzîbü'l-Ahlâk"},
      {"key": "C", "text": "Dîvânu Lugâti't-Türk"},
      {"key": "D", "text": "Ahlâk-ı Alâî"},
      {"key": "E", "text": "Atabetü'l-Hakâyık"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Hakikatlerin eşiği anlamına gelen ve Edip Ahmet Yüknekî tarafından yazılan ahlak/öğüt eseri <strong>Atabetü'l-Hakâyık</strong>'tır."
  },

  # --- EĞİTİMDE ETİK (33-40) ---
  {
    "id": "ekys2025-q33",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_etik",
    "topicName": "2025 EKYS - Eğitimde Etik",
    "category": "Eğitimde Etik (%10)",
    "icon": "⚖️",
    "questionNumber": 33,
    "questionText": "• Göreviyle ilgili takdir yetkisini makul ölçüler içinde kullanabilmek\n• Görevini yerine getirirken kişisel yeteneklerini sonuna kadar kullanmak\n• Görevle ilgili bilgi, beceri ve tutumları eksiksiz kazanmış olmak\n\nBu davranışlar aşağıdaki öğretmenlik meslek etiği ilkelerinden hangisiyle daha fazla ilgilidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Kaynakların etkili kullanımı"},
      {"key": "B", "text": "Adalet"},
      {"key": "C", "text": "Profesyonellik (Mesleki Yeterlilik)"},
      {"key": "D", "text": "Eşitlik"},
      {"key": "E", "text": "Tarafsızlık"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Mesleki bilgi, beceri ve takdir yetkisini en üst düzeyde kullanma ilkesi <strong>Profesyonellik</strong> ile ilgilidir."
  },
  {
    "id": "ekys2025-q34",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_etik",
    "topicName": "2025 EKYS - Eğitimde Etik",
    "category": "Eğitimde Etik (%10)",
    "icon": "⚖️",
    "questionNumber": 34,
    "questionText": "Kökeni \"bakmak-tekrar bakmak\" anlamına gelen, insan olmanın gereği olarak diğer insanlara karşı özenli, nazik ve anlayışlı olmayı, Kant Etiği'nde ise 'insanı yalnızca bir araç değil bizatihi amaç olarak görmeyi' ifade eden temel etik kavram aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Saygı"},
      {"key": "B", "text": "Duyarlılık"},
      {"key": "C", "text": "Erdem"},
      {"key": "D", "text": "Adalet"},
      {"key": "E", "text": "Hoşgörü"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>İnsanı insan olduğu için değerli görüp özen gösterme anlayışı <strong>Saygı</strong> kavramıdır."
  },
  {
    "id": "ekys2025-q35",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_etik",
    "topicName": "2025 EKYS - Eğitimde Etik",
    "category": "Eğitimde Etik (%10)",
    "icon": "⚖️",
    "questionNumber": 35,
    "questionText": "Bir okul müdürü, toplantıda öğretmenlere, özellikle yorgun ve kızgın olduklarında sakinleşip olaylar hakkında daha sonra karar vermeleri gerektiği yönünde öneride bulunmuştur.\n\nOkul müdürünün bu önerisi etik karar verme aşamalarından hangisini daha fazla içermektedir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Dur ve düşün"},
      {"key": "B", "text": "Amaçların tanımlanması"},
      {"key": "C", "text": "Seçenekler geliştirmek"},
      {"key": "D", "text": "Sonuçları göz önüne almak"},
      {"key": "E", "text": "Gerçekleri bilmek"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Fevri tepkiler yerine sakinleşip durumu değerlendirmeyi temel alan ilk aşama <strong>Dur ve düşün</strong> adımıdır."
  },
  {
    "id": "ekys2025-q36",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_etik",
    "topicName": "2025 EKYS - Eğitimde Etik",
    "category": "Eğitimde Etik (%10)",
    "icon": "⚖️",
    "questionNumber": 36,
    "questionText": "• Jeremy Bentham ve John Stuart Mill tarafından sistematikleştirilmiştir.\n• Bir eylemin doğruluğu ya da yanlışlığı, eylemin doğurduğu sonuçlara (fayda/acı/zevk dengesine) bağlıdır.\n• \"En çok sayıda insana en büyük mutluluğu sağlama\" ilkesini savunur.\n\nHakkında bilgi verilen etik teorisi aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Feministik etik"},
      {"key": "B", "text": "Deontolojik etik"},
      {"key": "C", "text": "Erdem temeline dayalı etik"},
      {"key": "D", "text": "Sezgilere dayalı etik"},
      {"key": "E", "text": "Teleolojik etik (Faydacılık / Sonuçsalcılık)"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Sonuçlara ve faydaya odaklanan Bentham ve Mill'in yaklaşımı <strong>Teleolojik / Faydacı</strong> etiktir."
  },
  {
    "id": "ekys2025-q37",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_etik",
    "topicName": "2025 EKYS - Eğitimde Etik",
    "category": "Eğitimde Etik (%10)",
    "icon": "⚖️",
    "questionNumber": 37,
    "questionText": "Bir kamu görevlisinin görevinin sağladığı nüfuzu kötüye kullanarak bir kişiyi kendisine veya başkasına yarar sağlamaya zorlaması ya da mecbur bırakması, aşağıdaki etik dışı davranışlardan hangisiyle adlandırılmaktadır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "İrtikâp"},
      {"key": "B", "text": "Kronizm"},
      {"key": "C", "text": "Angarya"},
      {"key": "D", "text": "Partizanlık"},
      {"key": "E", "text": "Nepotizm"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Kamu görevlisinin nüfuzunu kullanarak haksız menfaat sağlamaya mecbur bırakması suçu <strong>İrtikâp</strong>tır."
  },
  {
    "id": "ekys2025-q38",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_etik",
    "topicName": "2025 EKYS - Eğitimde Etik",
    "category": "Eğitimde Etik (%10)",
    "icon": "⚖️",
    "questionNumber": 38,
    "questionText": "Bir öğretmen velilerden gelen \"Sevdiği öğrencilere daha yüksek not veriyor.\" şikayeti üzerine \"Aynı şeyi diğer öğretmenler de yapıyor, bunda ne var ki!\" gerekçesiyle kendini savunmuştur.\n\nBu öğretmenin savunması aşağıdaki kavramlardan hangisiyle ifade edilmektedir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Etik iklim"},
      {"key": "B", "text": "Etik ikilem"},
      {"key": "C", "text": "Ahlaki rasyonalizasyon (Akla uydurma)"},
      {"key": "D", "text": "Etik kod"},
      {"key": "E", "text": "Etik kültür"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Kişinin yaptığı etik dışı davranışı \"herkes yapıyor\" diyerek meşrulaştırması <strong>Ahlaki rasyonalizasyon</strong>dur."
  },
  {
    "id": "ekys2025-q39",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_etik",
    "topicName": "2025 EKYS - Eğitimde Etik",
    "category": "Eğitimde Etik (%10)",
    "icon": "⚖️",
    "questionNumber": 39,
    "questionText": "Ahlakı, bireyde fazilet kazandıran ve gerçek mutluluğa (en yüksek iyiye) ulaştıran bir disiplin olarak gören; erdemleri nazarî erdem, düşünce erdemi, ahlakî erdem ve pratik erdem olarak dört kategoride sınıflayan İslam filozofu aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Hârizmî"},
      {"key": "B", "text": "Fârâbî"},
      {"key": "C", "text": "Râzî"},
      {"key": "D", "text": "İbn Sînâ"},
      {"key": "E", "text": "İbn Rüşd"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br><em>Medinetü'l-Fâzıla</em> ve erdemler sınıflamasıyla mutluluk ahlakını temellendiren filozof <strong>Fârâbî</strong>'dir."
  },
  {
    "id": "ekys2025-q40",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_etik",
    "topicName": "2025 EKYS - Eğitimde Etik",
    "category": "Eğitimde Etik (%10)",
    "icon": "⚖️",
    "questionNumber": 40,
    "questionText": "Okul müdürlerinin etik bir lider olarak sahip olması gereken özellikler arasında aşağıdakilerden hangisi yer almaz?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yapıcı iş birliğini sağlamak"},
      {"key": "B", "text": "Öz çıkar politikalarını desteklemek"},
      {"key": "C", "text": "Hesap verebilir olmak"},
      {"key": "D", "text": "Gücü paylaşmak"},
      {"key": "E", "text": "Tutarlılık ve uyum için çaba göstermek"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Etik liderler kişisel çıkarı değil, kamu yararını ve okulun ortak iyiliğini gözetir."
  },

  # --- EĞİTİM YÖNETİMİ VE DENETİMİ (41-64) ---
  {
    "id": "ekys2025-q41",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 41,
    "questionText": "Bir okul müdürünün sene başı kurulunda tüm öğretmenlere eşit mesafede olacağını, kural ve standartları herkese eşit uygulayacağını ifade etmesi yönetim süreçlerinden en çok hangisiyle ilgilidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Objektiflik ve Eşitlik (Adil Yönetim)"},
      {"key": "B", "text": "Bürokrasi"},
      {"key": "C", "text": "Merkeziyetçilik"},
      {"key": "D", "text": "Yetki devri"},
      {"key": "E", "text": "Ödüllendirme"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Kuralların herkese tarafsız ve ayrım gözetilmeksizin uygulanması <strong>Adil ve Eşit Yönetim</strong> ilkesidir."
  },
  {
    "id": "ekys2025-q42",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 42,
    "questionText": "Klasik yönetim kuramlarının insan unsurunu ihmal eden yaklaşımına tepki olarak doğan ve çalışanların psikolojik, sosyal ihtiyaçları ile grup dinamiklerine odaklanan yönetim yaklaşımı aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Bilimsel Yönetim"},
      {"key": "B", "text": "Bürokrasi Yaklaşımı"},
      {"key": "C", "text": "İnsan İlişkileri Yaklaşımı (Neo-Klasik)"},
      {"key": "D", "text": "Sistem Yaklaşımı"},
      {"key": "E", "text": "Durumsallık Yaklaşımı"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Hawthorne araştırmalarıyla başlayan ve insani/sosyal faktörleri öne çıkaran yaklaşım <strong>İnsan İlişkileri Yaklaşımı</strong>dır."
  },
  {
    "id": "ekys2025-q43",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 43,
    "questionText": "Eğitim denetiminde denetmenin öğretmene rehberlik etmesi, ders içi gözlem yapıp geliştirici dönütler vermesi hangi denetim türüne örnektir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Soruşturma Denetimi"},
      {"key": "B", "text": "Mali Denetim"},
      {"key": "C", "text": "Klinik / Öğretimsel Denetim"},
      {"key": "D", "text": "Süreç Dışı Denetim"},
      {"key": "E", "text": "Beklenmedik sonuçlar denetimi"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Sınıf içi öğretimi doğrudan geliştirmeye yönelik yüz yüze rehberlik süreci <strong>Klinik / Öğretimsel Denetim</strong>dir."
  },
  {
    "id": "ekys2025-q44",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 44,
    "questionText": "Okul müdürünün okulda uygulanan öğretim programlarının takibi, öğretmenlerin mesleki gelişimlerinin desteklenmesi ve öğrenci öğrenmelerinin izlenmesi odağında sergilediği liderlik rolü aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Otokratik liderlik"},
      {"key": "B", "text": "Öğretimsel liderlik"},
      {"key": "C", "text": "Karizmatik liderlik"},
      {"key": "D", "text": "İşlemsel liderlik"},
      {"key": "E", "text": "Laissez-faire liderlik"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Doğrudan öğrenme-öğretme süreçlerini merkeze alan liderlik türü <strong>Öğretimsel Liderlik</strong>tir."
  },
  {
    "id": "ekys2025-q45",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 45,
    "questionText": "Örgütsel iletişimde yöneticinin personele görevleri, kuralları ve çalışma yöntemlerini bildirmek amacıyla kullandığı yukarıdan aşağıya doğru iletişim mesajları hangi amaca hizmet eder?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Geri bildirim alma"},
      {"key": "B", "text": "Açıklama / Bilgilendirme"},
      {"key": "C", "text": "Duygusal destek"},
      {"key": "D", "text": "Yönlendirme ve Talimat Verme"},
      {"key": "E", "text": "Yatay koordinasyon"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Yukarıdan aşağıya resmi iletişim kanalları görevlerin yerine getirilmesi için <strong>Yönlendirme ve Talimat Verme</strong> işlevi görür."
  },
  {
    "id": "ekys2025-q46",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 46,
    "questionText": "Bir okulda öğretmenlerin okulun amaçlarını kendi amaçları gibi benimsemesi, okulda gönüllü olarak fazladan sorumluluk üstlenmesi ve işlerini sahiplenmesi aşağıdaki kavramlardan hangisiyle açıklanır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Örgütsel Bağlılık / Vatandaşlık"},
      {"key": "B", "text": "Örgütsel Sinizm"},
      {"key": "C", "text": "Örgütsel Yabancılaşma"},
      {"key": "D", "text": "Rol Çatışması"},
      {"key": "E", "text": "Tükenmişlik"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Örgüt amaçlarını içselleştirme ve fazladan çaba gösterme <strong>Örgütsel Bağlılık ve Örgütsel Vatandaşlık</strong> davranışıdır."
  },
  {
    "id": "ekys2025-q47",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 47,
    "questionText": "French ve Raven'ın güç kaynakları sınıflamasında, yöneticinin sahip olduğu derin bilgi, mesleki tecrübe ve özel yeteneklerinden kaynaklanan güç türü aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yasal güç"},
      {"key": "B", "text": "Ödül gücü"},
      {"key": "C", "text": "Zorlayıcı güç"},
      {"key": "D", "text": "Uzmanlık gücü"},
      {"key": "E", "text": "Karizmatik güç"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Mesleki yetkinlik ve bilgi birikimine dayanan güç <strong>Uzmanlık gücü</strong>dür."
  },
  {
    "id": "ekys2025-q48",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 48,
    "questionText": "Okulun çevresiyle etkileşiminde toplumun ve velilerin beklentilerini karşılamak, toplumsal taleplere duyarlı olmak eğitim yönetiminde hangi boyutla ifade edilir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Kapalı sistem"},
      {"key": "B", "text": "Mekanik yapı"},
      {"key": "C", "text": "İçe dönük örgüt"},
      {"key": "D", "text": "Bürokratik kontrol"},
      {"key": "E", "text": "Toplumsal istem / Açık sistem uyumu"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Açık bir sistem olan okulun çevre taleplerini algılayıp uyum sağlaması <strong>Toplumsal istem</strong> boyutudur."
  },
  {
    "id": "ekys2025-q49",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 49,
    "questionText": "Bir okul müdürü tartışan iki öğretmen için önce görmezden gelmiş (kayıtsız kalma), ardından aralarını yumuşatmış (yumuşatma), rol model olduklarını hatırlatıp ikna etmiş (inandırma) ve meşgul etmek için görevler vermiştir.\n\nBu okul müdürü aşağıdaki çatışma çözüm tekniklerinden hangisine başvurmamıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yumuşatma"},
      {"key": "B", "text": "Meşgul etme"},
      {"key": "C", "text": "Kayıtsız kalma"},
      {"key": "D", "text": "İnandırma"},
      {"key": "E", "text": "Politik yaklaşma"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Müdür kayıtsız kalma, yumuşatma, inandırma ve meşgul etme tekniklerini uygulamış; <strong>Politik yaklaşma</strong> (taraf tutma/pazarlık) uygulamamıştır."
  },
  {
    "id": "ekys2025-q50",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 50,
    "questionText": "Bir okulda öğrencilerin kendilerini ifade etme sorununu aşmaları için motive edici konuşmalar yapılması, geçmiş başarılarının hatırlatılması ve 'yapabilirsin' inancının kazandırılması kararlaştırılmıştır.\n\nAlınan bu kararlarda aşağıdaki motivasyon kuramlarından hangisi temel alınmıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Öz Yeterlik Kuramı (Bandura)"},
      {"key": "B", "text": "İhtiyaçlar Hiyerarşisi (Maslow)"},
      {"key": "C", "text": "Beklenti Kuramı (Vroom)"},
      {"key": "D", "text": "Öğrenilmiş İhtiyaçlar (McClelland)"},
      {"key": "E", "text": "Çift Faktör Kuramı (Herzberg)"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Bireyin bir işi başarabileceğine olan inancı ve geçmiş başarı deneyimleri Bandura'nın <strong>Öz Yeterlik Kuramı</strong>dır."
  },
  {
    "id": "ekys2025-q51",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 51,
    "questionText": "Bir araştırmada öğrencilerin matematik başarısı ile derse yönelik tutum puanları arasındaki pozitif yönlü korelasyon grafiği incelenmiştir.\n\nBuna göre\nI. Matematik başarısı ile derse yönelik tutum puanları arasında pozitif yönlü bir ilişki vardır.\nII. Matematik başarısı yüksek olan öğrencilerin tutum puanları da yüksek olma eğilimindedir.\nIII. Tutum puanının azalması başarının düşük olmasına kesin olarak neden olmaktadır.\n\nyorumlarından hangileri kesinlikle doğrudur?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız II"},
      {"key": "C", "text": "I ve II"},
      {"key": "D", "text": "I ve III"},
      {"key": "E", "text": "II ve III"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Korelasyonel ilişki (I ve II) kesin bir neden-sonuç (III) doğurmaz; bu yüzden yalnız I ve II doğrudur."
  },
  {
    "id": "ekys2025-q52",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 52,
    "questionText": "Müdürlerin liderlik tarzlarını anlattığı konuşmada;\n• I. Müdür etik ilkelere vurgu yapmış (Etik Liderlik)\n• II. Müdür öğrenci başarısı ve eğitime odaklanmış (Öğretimsel Liderlik)\n• III. Müdür ortak karar ve etkileşimi öne çıkarmış (Paylaşılmış Liderlik)\n• IV. Müdür değişime ayak uydurmayı hedeflemiştir (Dönüşümcü Liderlik)\n\nBu konuşmada aşağıdaki liderlik yaklaşımlarının hangisinden söz edilmemiştir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Süper Liderlik (Kendi Kendinin Lideri Olma)"},
      {"key": "B", "text": "Dönüşümcü Liderlik"},
      {"key": "C", "text": "Etik Liderlik"},
      {"key": "D", "text": "Paylaşılmış Liderlik"},
      {"key": "E", "text": "Öğretimsel Liderlik"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>Konuşmada Etik, Öğretimsel, Paylaşılmış ve Dönüşümcü liderlikten bahsedilmiş; <strong>Süper liderlik</strong> yer almamıştır."
  },
  {
    "id": "ekys2025-q53",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 53,
    "questionText": "Bir okul müdürü uzaktan eğitim sürecinde dezavantajlı öğrencilerin tablet ve internet ihtiyaçlarını proje hazırlayarak karşılamıştır (Hizmetkâr / Sosyal Adalet Liderliği).\n\nBuna göre;\nI. Erdal Öğretmen'in sadece başarılı öğrencileri ödüllendirmesi,\nII. Ali Öğretmen'in engelli öğrencilerin eğitime erişimleri için çalışması,\nIII. Gözde Öğretmen'in ev hanımlarına iş olanağı yaratan projeler yürütmesi\n\ndavranışlarından hangileri okul müdürünün gösterdiği liderlik türüyle benzerlik göstermektedir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız III"},
      {"key": "C", "text": "I ve II"},
      {"key": "D", "text": "I ve III"},
      {"key": "E", "text": "II ve III"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Dezavantajlı grupların ihtiyaçlarına yönelik sosyal adalet ve hizmet odaklı çalışmalar II ve III'tür."
  },
  {
    "id": "ekys2025-q54",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 54,
    "questionText": "Okul kültürü ve okul iklimine ilişkin aşağıdaki ifadelerden hangisi yanlıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Okul iklimi ve okul kültürü okulun iç çevresine odaklanır."},
      {"key": "B", "text": "Okul kültürü, okul iklimine göre daha kısa süreli ve değişkendir."},
      {"key": "C", "text": "Okul iklimi ve okul kültürü okuldaki sosyal bağlamın betimlenmesidir."},
      {"key": "D", "text": "Okul kültürü normlar ve varsayımlarla, okul iklimi ise algılanan psikolojik hava ile ilgilidir."},
      {"key": "E", "text": "Okul kültürü ve okul iklimi, okulun değerler sistemine vurgu yapar."}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Okul kültürü uzun vadeli, köklü ve değişmesi zor bir yapıdır; iklim ise anlık algı ve havayı yansıttığı için daha değişkendir."
  },
  {
    "id": "ekys2025-q55",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 55,
    "questionText": "Öğretmenlerin tutum ve davranışları:\nI. Okuluna sevgi duyup amaçları gerçekleştirmek için çabalayan Biyoloji öğretmeni,\nII. Yönetimin kararlarını yetersiz bulup sürekli kötümser/alaycı yorumlar yapan Beden Eğitimi öğretmeni,\nIII. Arkadaşlarına yardımcı olup fazladan görevlere gönüllü olan Matematik öğretmeni\n\nBu durumları en iyi açıklayan kavramlar sırasıyla aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Örgütsel bağlılık - Örgütsel tükenmişlik - Örgütsel güven"},
      {"key": "B", "text": "Örgütsel bağlılık - Örgütsel sinizm - Örgütsel vatandaşlık"},
      {"key": "C", "text": "Örgütsel öğrenme - Örgütsel sinizm - Örgütsel bağlılık"},
      {"key": "D", "text": "Örgütsel öğrenme - Örgütsel tükenmişlik - Örgütsel bağlılık"},
      {"key": "E", "text": "Örgütsel vatandaşlık - Örgütsel sinizm - Örgütsel güven"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>I: <strong>Örgütsel bağlılık</strong>, II: Kötümserlik/inançsızlık yani <strong>Örgütsel sinizm</strong>, III: Fazladan katkı yani <strong>Örgütsel vatandaşlık</strong>tır."
  },
  {
    "id": "ekys2025-q56",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 56,
    "questionText": "Okulunu sürekli geliştirmeyi ve iyileştirmeyi ilke edinen, sorunları örtmek yerine kalıcı çözümler üretmek için çok disiplinli sorun çözme ekipleriyle çalışan okul müdürünün benimsediği sürekli iyileştirme felsefesi aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Beyin Fırtınası"},
      {"key": "B", "text": "Juran-Pareto Analizi"},
      {"key": "C", "text": "Kalite Çemberleri"},
      {"key": "D", "text": "Akış Diyagramı"},
      {"key": "E", "text": "Kaizen (Sürekli İyileştirme)"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Tüm çalışanların katılımıyla aşamalı ve sürekli iyileştirmeyi hedefleyen Japon kalite felsefesi <strong>Kaizen</strong>dir."
  },
  {
    "id": "ekys2025-q57",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 57,
    "questionText": "Bir okul müdürünün öğretmenlerin örgütsel sosyalleşmelerine, mesleki eğitimlerine ve kariyer gelişimlerine yönelik çalışmalar yapması insan kaynakları yönetiminin hangi işleviyle ilişkilidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "İş değerlemesi"},
      {"key": "B", "text": "Geliştirme (Eğitim ve Kariyer)"},
      {"key": "C", "text": "Ücret belirleme"},
      {"key": "D", "text": "Bütünleştirme"},
      {"key": "E", "text": "Personel planlaması"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Personelin mesleki yetkinlik, sosyalleşme ve kariyer adımlarını destekleme süreci İKY'nin <strong>Geliştirme</strong> işlevidir."
  },
  {
    "id": "ekys2025-q58",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 58,
    "questionText": "Program geliştirme sürecinde programın bütün ögelerinin şekillenmesinde faydalanılan, özellikle de hedeflerin tutarlılığını ve öncelik sırasını belirlemede süzgeç rolü oynayan temel disiplin aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Psikoloji"},
      {"key": "B", "text": "Tarih"},
      {"key": "C", "text": "Ekonomi"},
      {"key": "D", "text": "Felsefe"},
      {"key": "E", "text": "Sosyoloji"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Hedeflerin iç ve dış tutarlılığını test eden ve aday hedefleri eleyen süzgeç disiplin <strong>Felsefe</strong>dir."
  },
  {
    "id": "ekys2025-q59",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 59,
    "questionText": "Bir müzik öğretmeni dersinde Hint, Kafkas, İran ve Latin müziği gibi farklı kültürlere ait müzikleri bağımsız üniteler halinde tanıtmayı planlamaktadır.\n\nBu öğretmen aşağıdaki içerik düzenleme yaklaşımlarından hangisini dikkate almaktadır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Doğrusal"},
      {"key": "B", "text": "Sarmal"},
      {"key": "C", "text": "Modüler"},
      {"key": "D", "text": "Piramitsel"},
      {"key": "E", "text": "Çekirdek"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Konuların birbiriyle ön koşulluk ilişkisi olmadan bağımsız anlamlı parçalar/modüller halinde işlenmesi <strong>Modüler</strong> yaklaşımdır."
  },
  {
    "id": "ekys2025-q60",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 60,
    "questionText": "Kesirler konusunu öğretmek için basamaklı öğretim modelini kullanan bir öğretmenin konuyla ilgili verdiği aşağıdaki görevlerden hangisi diğerlerine göre daha üst düzeydedir (A Basamağı)?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Kesirlerle ilgili ders kitabındaki soruları cevaplama"},
      {"key": "B", "text": "Konu alanında uzman bir kişiyle görüşme yapma"},
      {"key": "C", "text": "Farklı kaynaklardan kesirlerle ilgili bilgileri tarama"},
      {"key": "D", "text": "Konu alanına özgün bir hikâye / ürün oluşturma"},
      {"key": "E", "text": "Kesirler konusunu sözlü olarak özetleme"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Basamaklı öğretimde özgün ürün yaratma, sentez ve analiz becerileri en üst basamak olan <strong>A Basamağı</strong>na aittir."
  },
  {
    "id": "ekys2025-q61",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 61,
    "questionText": "Öğrencilerin bir konu hakkında önyargısız düşünmelerini, kanıtları sorgulamalarını ve mantıksal tutarsızlıkları belirlemelerini amaçlayan üst düzey düşünme becerisi aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yakınsak düşünme"},
      {"key": "B", "text": "Yansıtıcı düşünme"},
      {"key": "C", "text": "Analojik düşünme"},
      {"key": "D", "text": "Iraksak düşünme"},
      {"key": "E", "text": "Eleştirel düşünme"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>Sorgulama, kanıta dayandırma ve önyargılardan arınmış değerlendirme <strong>Eleştirel düşünme</strong> becerisidir."
  },
  {
    "id": "ekys2025-q62",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 62,
    "questionText": "Stratejik planlama sürecinde okulun güçlü ve zayıf yönleri ile çevreden gelen fırsat ve tehditlerin belirlenmesi amacıyla yapılan durum analizi aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "SWOT (GZFT) Analizi"},
      {"key": "B", "text": "PESTLE Analizi"},
      {"key": "C", "text": "Paydaş Analizi"},
      {"key": "D", "text": "Kök Neden Analizi"},
      {"key": "E", "text": "Maliyet-Fayda Analizi"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>İç çevre (Güçlü/Zayıf) ve dış çevre (Fırsat/Tehdit) analizi <strong>SWOT (GZFT)</strong> analizidir."
  },
  {
    "id": "ekys2025-q63",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 63,
    "questionText": "Okul yönetiminde bütçenin etkin tahsis edilmesi, araç-gereç ve fiziki mekanların verimli biçimde eğitime kazandırılması hangi yönetim işlevidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Planlama"},
      {"key": "B", "text": "Denetleme"},
      {"key": "C", "text": "Eşgüdüm"},
      {"key": "D", "text": "Kaynak Yönetimi ve Kullanımı"},
      {"key": "E", "text": "İletişim"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Maddi ve mali imkanların hedefler doğrultusunda optimize edilmesi <strong>Kaynak Yönetimi</strong>dir."
  },
  {
    "id": "ekys2025-q64",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_egitimyonetimi",
    "topicName": "2025 EKYS - Eğitim Yönetimi",
    "category": "Eğitim Yönetimi (%30)",
    "icon": "📚",
    "questionNumber": 64,
    "questionText": "Eğitim örgütlerinde karar verme sürecinde rasyonelliği sınırlayan en temel etken aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yeterli personelin olması"},
      {"key": "B", "text": "Eksik bilgi ve zaman kısıtı (Sınırlı Rasyonellik)"},
      {"key": "C", "text": "Mevzuatın açık olması"},
      {"key": "D", "text": "Örgüt kültürünün güçlü olması"},
      {"key": "E", "text": "Demokratik okul iklimi"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>Simon'un Sınırlı Rasyonellik modeline göre karar vericiler <strong>eksik bilgi, belirsizlik ve zaman kısıtı</strong> altında karar alır."
  },

  # --- MEVZUAT (65-80) ---
  {
    "id": "ekys2025-q65",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 65,
    "questionText": "1982 Anayasası'na göre temel hak ve hürriyetlerin sınırlandırılmasıyla ilgili\nI. Anayasa'nın sözüne ve ruhuna aykırı olamaz.\nII. Demokratik toplum düzeninin gereklerine aykırı olamaz.\nIII. Yalnızca Anayasa'nın ilgili maddelerinde belirtilen sebeplere bağlı olarak ancak kanunla sınırlanabilir.\n\nyargılarından hangileri doğrudur?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "I ve II"},
      {"key": "C", "text": "I, II ve III"},
      {"key": "D", "text": "I ve III"},
      {"key": "E", "text": "II ve III"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>Anayasa m.13 gereğince temel haklar ancak kanunla, maddeye bağlı sebeplerle, demokratik düzenin gereklerine ve ölçülülük ilkesine uygun sınırlanabilir."
  },
  {
    "id": "ekys2025-q66",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 66,
    "questionText": "1982 Anayasası'na göre Millî Güvenlik Kuruluna (MGK) aşağıdakilerden hangisi üye olarak katılmaz?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Millî Güvenlik Kurulu Genel Sekreteri (Üye değildir, raportördür)"},
      {"key": "B", "text": "Adalet Bakanı"},
      {"key": "C", "text": "İçişleri Bakanı"},
      {"key": "D", "text": "Dışişleri Bakanı"},
      {"key": "E", "text": "Genelkurmay Başkanı"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>MGK Genel Sekreteri toplantılara katılır ancak Kurulun <strong>üyesi değildir</strong>."
  },
  {
    "id": "ekys2025-q67",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 67,
    "questionText": "222 sayılı İlköğretim ve Eğitim Kanunu'na göre mecburi ilköğretim çağına giren çocuğu ilköğretim okuluna yazdırmakla yükümlü olanlar arasında;\nI. Veli,\nII. Kayyum,\nIII. Aile başkanı\n\nkişilerinden hangileri kanunda açıkça sayılmıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız II"},
      {"key": "C", "text": "I ve II"},
      {"key": "D", "text": "I ve III (Veli, Vasi veya Aile Başkanı)"},
      {"key": "E", "text": "II ve III"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>222 sayılı Kanun m.49'a göre çocuğu okula yazdırmakla veli, vasi veya <strong>aile başkanı</strong> yükümlüdür (kayyum sayılmamıştır)."
  },
  {
    "id": "ekys2025-q68",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 68,
    "questionText": "222 sayılı İlköğretim ve Eğitim Kanunu'na göre her öğrencinin velisi, özrü yüzünden okula gidemeyecek çocuğun durumunu kural olarak en geç kaç gün içinde okul idaresine bildirmekle yükümlüdür?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "1 gün"},
      {"key": "B", "text": "2 gün"},
      {"key": "C", "text": "3 gün"},
      {"key": "D", "text": "5 gün"},
      {"key": "E", "text": "7 gün"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>222 sayılı Kanun m.55 gereği veli özrü bulunan çocuğun durumunu en geç <strong>3 gün</strong> içinde okul idaresine bildirmelidir."
  },
  {
    "id": "ekys2025-q69",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 69,
    "questionText": "Başka bir ildeki kamu kurumuna ilk defa atanan memur, atama emri tebliğ edilmesine rağmen yasal süre içinde geçerli mazeretsiz göreve başlamazsa, 657 sayılı Devlet Memurları Kanunu'na göre ne kadar süreyle devlet memuru olarak istihdam edilemez?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "3 ay"},
      {"key": "B", "text": "6 ay"},
      {"key": "C", "text": "1 yıl"},
      {"key": "D", "text": "2 yıl"},
      {"key": "E", "text": "3 yıl"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>657 sayılı Kanun m.63 uyarınca süresi içinde göreve başlamayanlar <strong>1 yıl</strong> süreyle devlet memurluğuna alınmazlar."
  },
  {
    "id": "ekys2025-q70",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 70,
    "questionText": "657 sayılı Devlet Memurları Kanunu'na göre özürsüz ve kesintisiz olarak 1 yılda toplam 20 gün göreve gelmemek fiilinin gerektirdiği disiplin cezası aşağıdakilerden hangisidir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Uyarma"},
      {"key": "B", "text": "Kınama"},
      {"key": "C", "text": "Aylıktan kesme"},
      {"key": "D", "text": "Kademe ilerlemesinin durdurulması"},
      {"key": "E", "text": "Devlet memurluğundan çıkarma"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>657 sayılı Kanun m.125/E gereğince kesintisiz 10 gün veya 1 yılda toplam <strong>20 gün</strong> özürsüz göreve gelmemenin cezası memurluktan çıkarmadır."
  },
  {
    "id": "ekys2025-q71",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 71,
    "questionText": "657 sayılı Devlet Memurları Kanunu'na göre azami yükselebilecekleri derecelerin 4. kademesinden aylık almaya hak kazanan memurlardan son kaç yıl içinde herhangi bir disiplin cezası almayanların kazanılmış hak aylıkları bir üst dereceye yükseltilir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "3 yıl"},
      {"key": "B", "text": "5 yıl"},
      {"key": "C", "text": "6 yıl"},
      {"key": "D", "text": "8 yıl"},
      {"key": "E", "text": "10 yıl"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>657 sayılı Kanun m.37 gereğince son <strong>8 yıl</strong> içinde disiplin cezası almayan memurlar bir üst dereceye yükseltilir."
  },
  {
    "id": "ekys2025-q72",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 72,
    "questionText": "1739 sayılı Millî Eğitim Temel Kanunu'na göre hangi yükseköğretim kurumlarına, hangi programları bitirenlerin nasıl girecekleri ve giriş şartları Millî Eğitim Bakanlığıyla iş birliği yapılarak aşağıdakilerin hangisi tarafından belirlenir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Mesleki Yeterlilik Kurumu"},
      {"key": "B", "text": "Yükseköğretim Kurulu (YÖK)"},
      {"key": "C", "text": "Üniversitelerarası Kurul"},
      {"key": "D", "text": "Ölçme, Seçme ve Yerleştirme Merkezi (ÖSYM)"},
      {"key": "E", "text": "Eğitim ve Öğretim Politikaları Kurulu"}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>1739 sayılı Kanun m.36 gereğince yükseköğretime giriş şartları MEB ile iş birliği yapılarak <strong>YÖK</strong> tarafından belirlenir."
  },
  {
    "id": "ekys2025-q73",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 73,
    "questionText": "Aşağıdakilerden hangisi 1739 sayılı Millî Eğitim Temel Kanunu'nda yükseköğretim kurumlarının amaç ve görevleri arasında açıkça sayılmamıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Türk toplumunun genel seviyesini yükseltici ve kamuoyunu aydınlatıcı bilim verilerini yaymak"},
      {"key": "B", "text": "Bilim ve tekniğin ilerlemesini sağlayan her türlü yayınları yapmak"},
      {"key": "C", "text": "Bütün bilimsel, teknik ve kültürel sorunları çözmek için araştırmalarda bulunmak"},
      {"key": "D", "text": "Öğrencileri ilgi ve yetenekleri doğrultusunda yüksek kademelerdeki insan gücü olarak yetiştirmek"},
      {"key": "E", "text": "Toplu yaşama, dayanışma ve örgütlenme alışkanlıkları kazandırmak (İlköğretim amaçları arasındadır)"}
    ],
    "correctAnswer": "E",
    "explanation": "Doğru Cevap: <strong>E</strong><br>E seçeneğindeki ifade 1739 sayılı Kanunda ilköğretimin amaçları arasındadır; yükseköğretimin değil."
  },
  {
    "id": "ekys2025-q74",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 74,
    "questionText": "4688 sayılı Kamu Görevlileri Sendikaları ve Toplu Sözleşme Kanunu'na göre yeni kurulan bir sendikanın tüzel kişilik kazanabilmesi için kurucularının, sendika tüzüğü ve kuruluş belgelerini aşağıdakilerden hangisine vermesi gerekir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "İçişleri Bakanlığına"},
      {"key": "B", "text": "Sendika merkezinin bulunacağı ilin Sosyal Güvenlik Kurumu Müdürlüğüne"},
      {"key": "C", "text": "Sendika merkezinin bulunacağı ilin valiliğine"},
      {"key": "D", "text": "Çalışma ve Sosyal Güvenlik Bakanlığına"},
      {"key": "E", "text": "Cumhurbaşkanlığına"}
    ],
    "correctAnswer": "C",
    "explanation": "Doğru Cevap: <strong>C</strong><br>4688 sayılı Kanun m.6 gereğince kuruluş belgeleri <strong>sendika merkezinin bulunacağı ilin valiliğine</strong> verilir ve tüzel kişilik kazanılır."
  },
  {
    "id": "ekys2025-q75",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 75,
    "questionText": "İşçi statüsü dışında çalışan kamu görevlisi, bağlı olduğu A Sendikasından çekilme kararını kamu işverenine bildirir ve aynı gün B Sendikasına üyelik başvurusunda bulunur.\n\n4688 sayılı Kanun'a göre kamu görevlisi, B Sendikası üyeliğini kural olarak hangi anda kazanır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Çekilme bildiriminin kamu işverenine verildiği tarihten itibaren 30 günlük sürenin bittiği an"},
      {"key": "B", "text": "B Sendikasına üyelik başvurusu yapıldığı tarihten itibaren 15 günlük sürenin bittiği an"},
      {"key": "C", "text": "Çekilme kararının A Sendikası Merkez Genel Kurulunca onaylandığı an"},
      {"key": "D", "text": "Kamu işvereninin bildirimi A Sendikasına gönderdiği an"},
      {"key": "E", "text": "B Sendikasına üyelik başvurusunun yapıldığı an"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>4688 sayılı Kanun m.16'ya göre çekilme bildirimi verildikten <strong>30 gün sonra</strong> geçerli olur; yeni sendika üyeliği bu sürenin bitimiyle başlar."
  },
  {
    "id": "ekys2025-q76",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 76,
    "questionText": "3071 sayılı Dilekçe Hakkının Kullanılmasına Dair Kanun'a göre dilekçe hakkıyla ilgili aşağıdaki ifadelerden hangisi yanlıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Dilekçe konusuyla ilgili olmayan bir makama verilirse, yetkili idari makama gönderilir ve dilekçe sahibine bilgi verilir."},
      {"key": "B", "text": "Türkiye'de ikamet eden yabancılar, karşılıklılık esası gözetilmeksizin kendi dillerinde dilekçe hakkından yararlanabilirler."},
      {"key": "C", "text": "Yargı mercilerinin görevine giren konularla ilgili olan dilekçeler yetkili idari makamlarca incelenemez."},
      {"key": "D", "text": "Dilekçe sahiplerine yetkili makamlarca en geç 30 gün içinde gerekçeli cevap verilir."},
      {"key": "E", "text": "TBMM Dilekçe Komisyonunda inceleme ve karara bağlama 60 gün içinde sonuçlandırılır."}
    ],
    "correctAnswer": "B",
    "explanation": "Doğru Cevap: <strong>B</strong><br>3071 sayılı Kanun m.3 gereğince yabancıların dilekçeleri <strong>Türkçe yazılmak</strong> ve <strong>karşılıklılık (mütekabiliyet) esası gözetilmek</strong> kaydıyla kabul edilir."
  },
  {
    "id": "ekys2025-q77",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 77,
    "questionText": "5018 sayılı Kamu Malî Yönetimi ve Kontrol Kanunu'na göre merkezî yönetim bütçe kanunu ile ilgili\nI. Teklifi malî yılbaşından en az 55 gün önce TBMM'ye sunulur.\nII. Süresinde yürürlüğe konulamaması halinde kural olarak geçici bütçe kanunu çıkarılır.\nIII. Malî yılbaşından önce Resmî Gazete'de yayımlanır.\n\nifadelerinden hangileri doğrudur?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız II"},
      {"key": "C", "text": "I ve III"},
      {"key": "D", "text": "II ve III"},
      {"key": "E", "text": "I, II ve III"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong> (II ve III)<br>Bütçe kanun teklifi 55 gün değil, malî yılbaşından en az <strong>75 gün önce</strong> (17 Ekim) TBMM'ye sunulur."
  },
  {
    "id": "ekys2025-q78",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 78,
    "questionText": "Osmaniye'ye bağlı Kadirli ilçesinin, Adana iline bağlanması istenir.\n\n5442 sayılı İl İdaresi Kanunu'na göre bu işlem aşağıdakilerden hangisiyle gerçekleştirilir?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Kanun"},
      {"key": "B", "text": "Tüzük"},
      {"key": "C", "text": "Yönetmelik"},
      {"key": "D", "text": "Cumhurbaşkanlığı kararnamesi"},
      {"key": "E", "text": "Cumhurbaşkanı kararı"}
    ],
    "correctAnswer": "A",
    "explanation": "Doğru Cevap: <strong>A</strong><br>5442 sayılı Kanun m.2 uyarınca bir ilçenin bir ilden başka bir ile bağlanması <strong>Kanun</strong> ile yapılır."
  },
  {
    "id": "ekys2025-q79",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 79,
    "questionText": "Aşağıdakilerden hangisi 1 sayılı Cumhurbaşkanlığı Teşkilatı Hakkında Cumhurbaşkanlığı Kararnamesi'nde Hayat Boyu Öğrenme Genel Müdürlüğünün görev ve yetkileri arasında açıkça sayılmamıştır?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yaygın eğitim ve öğretim ile açık öğretim hizmetlerini yürütmek"},
      {"key": "B", "text": "Örgün eğitim sistemine girmemiş vatandaşlara yaygın eğitim yoluyla eğitim vermek"},
      {"key": "C", "text": "Yaygın eğitim okul ve kurumlarının öğretim programlarını hazırlamak veya hazırlatmak"},
      {"key": "D", "text": "Eğitim ve öğretimde uygulanan yeni teknoloji ve gelişmeleri izlemek ve değerlendirmek (YEĞİTEK'in görevidir)"},
      {"key": "E", "text": "Zorunlu eğitim dışında eğitimi hayat boyu devam edecek şekilde yaygınlaştırmak"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong><br>Eğitim teknolojilerini izlemek ve değerlendirmek <strong>YEĞİTEK</strong> (Yenilik ve Eğitim Teknolojileri GM) görevidir."
  },
  {
    "id": "ekys2025-q80",
    "testId": "ekys2025_tam",
    "testTitle": "2025 EKYS Çıkmış Sınav Soruları",
    "topicId": "ekys2025_mevzuat",
    "topicName": "2025 EKYS - Mevzuat",
    "category": "Mevzuat (%20)",
    "icon": "📜",
    "questionNumber": 80,
    "questionText": "4483 sayılı Memurlar ve Diğer Kamu Görevlilerinin Yargılanması Hakkında Kanun'a göre Cumhuriyet Başsavcısı, memurların bu Kanun kapsamındaki suçlarına dair bir şikayet aldığında evrakın bir örneğini yetkili makama gönderip soruşturma izni istemeden önce\nI. şikayette bulunulan memurların ifadelerine başvurulması,\nII. ivedilikle toplanması gerekli ve kaybolma ihtimali bulunan delillerin tespiti,\nIII. tanık beyanlarının alınması\n\nişlemlerinden hangilerini yapamaz?",
    "hasImage": False,
    "image": None,
    "options": [
      {"key": "A", "text": "Yalnız I"},
      {"key": "B", "text": "Yalnız III"},
      {"key": "C", "text": "I ve II"},
      {"key": "D", "text": "I ve III"},
      {"key": "E", "text": "II ve III"}
    ],
    "correctAnswer": "D",
    "explanation": "Doğru Cevap: <strong>D</strong> (I ve III)<br>4483 sayılı Kanun m.4 gereği Başsavcı yalnızca kaybolma ihtimali olan delilleri tespit eder (II); memurun ifadesini alamaz (I) ve tanık dinleyemez (III)."
  }
]

print(f"Hazırlanan 2025 EKYS soru sayısı: {len(ekys2025_questions)}")

# Read current questions-db.js
with open('data/questions-db.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract existing questions
json_text = content.split('window.EKYS_EXTRACTED_QUESTIONS =')[1].strip().rstrip(';')
existing_questions = json.loads(json_text)

# Remove any existing ekys2025 questions if present
clean_existing = [q for q in existing_questions if not str(q.get('id', '')).startswith('ekys2025')]

# Combine
all_questions = clean_existing + ekys2025_questions

# Write back to questions-db.js
new_content = f"// EKYS 2027 Odaklı Soru Veritabanı (2025 ve 2026 Çıkmış Sorular Dahil)\nwindow.EKYS_EXTRACTED_QUESTIONS = {json.dumps(all_questions, ensure_ascii=False, indent=2)};\n"

with open('data/questions-db.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Başarıyla güncellendi! Toplam soru sayısı: {len(all_questions)}")
