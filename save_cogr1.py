import json

cogr1_questions = [
    {
        "id": "cogr1-q1",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 1,
        "questionText": "I. Yer çekiminin Trabzon'da Erzurum'a göre fazla olması\nII. Aynı anda farklı mevsimlerin yaşanması\nIII. Orografik yağışların görülmesi\nIV. Batı'dan doğuya gidildikçe Güneş'in daha erken doğması\n\nYukarıda verilen özelliklerden hangileri mutlak, hangileri göreceli konumun sonuçlarındandır?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Mutlak: I - III / Göreceli: II - IV"},
            {"key": "B", "text": "Mutlak: I - II / Göreceli: III - IV"},
            {"key": "C", "text": "Mutlak: II - IV / Göreceli: I - III"},
            {"key": "D", "text": "Mutlak: III - IV / Göreceli: I - II"},
            {"key": "E", "text": "Mutlak: I - IV / Göreceli: II - III"}
        ],
        "correctAnswer": "E",
        "explanation": "Doğru Cevap: <strong>E</strong><br>I (Enlem) ve IV (Boylam) mutlak konumun; II ve III (Yer şekilleri/Yükselti) göreceli konumun sonucudur."
    },
    {
        "id": "cogr1-q2",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 2,
        "questionText": "Bir yerin özel (göreceli) konumunun incelenmesinde aşağıdakilerden hangisinin bilinmesi şart değildir?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Karalar üzerindeki yeri"},
            {"key": "B", "text": "Denizlere göre yeri"},
            {"key": "C", "text": "Kutuplara göre yeri"},
            {"key": "D", "text": "Yer altı zenginlikleri"},
            {"key": "E", "text": "Yükseltisi"}
        ],
        "correctAnswer": "C",
        "explanation": "Doğru Cevap: <strong>C</strong><br>Kutuplara ve Ekvator'a göre yer mutlak (matematik) konum ile ilgilidir."
    },
    {
        "id": "cogr1-q3",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 3,
        "questionText": "Sinop'ta Kutup Yıldızı'nın görünüm açısının Hakkâri'den daha büyük olması aşağıdakilerden hangisiyle açıklanabilir?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Yer şekillerinin sade olması"},
            {"key": "B", "text": "Deniz kenarında olması"},
            {"key": "C", "text": "Enlem itibarıyla daha kuzeyde olması"},
            {"key": "D", "text": "Tan ve grup süresinin daha uzun olması"},
            {"key": "E", "text": "Çizgisel hızın daha yavaş olması"}
        ],
        "correctAnswer": "C",
        "explanation": "Doğru Cevap: <strong>C</strong><br>Kutup Yıldızı'nın görünüm açısı bulunulan yerin Kuzey enlem derecesine eşittir. Sinop (42° K) daha kuzeydedir."
    },
    {
        "id": "cogr1-q4",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 4,
        "questionText": "Aşağıda matematik konumları verilen noktalardan hangisi Türkiye sınırları içinde yer alır?\n(Türkiye: 36°-42° Kuzey Paralelleri ile 26°-45° Doğu Meridyenleri)",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "45° Doğu – 40° Kuzey"},
            {"key": "B", "text": "40° Doğu – 35° Kuzey"},
            {"key": "C", "text": "26° Batı – 42° Kuzey"},
            {"key": "D", "text": "44° Doğu – 26° Kuzey"},
            {"key": "E", "text": "37° Batı – 37° Kuzey"}
        ],
        "correctAnswer": "A",
        "explanation": "Doğru Cevap: <strong>A</strong><br>45° Doğu - 40° Kuzey noktası Türkiye sınırları içerisindedir (Iğdır civarı)."
    },
    {
        "id": "cogr1-q5",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 5,
        "questionText": "• Akdeniz ikliminin görülmesi\n• Tarım ürünlerinin çeşitli olması\n• Orografik yağışların görülmesi\n• Batı rüzgârlarının görülmesi\n• Aynı anda dört mevsimin yaşanması\n\nYukarıda verilen özelliklerden kaç tanesi Türkiye'nin orta kuşakta yer almasının sonuçlarındandır?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "1"},
            {"key": "B", "text": "2"},
            {"key": "C", "text": "3"},
            {"key": "D", "text": "4"},
            {"key": "E", "text": "5"}
        ],
        "correctAnswer": "B",
        "explanation": "Doğru Cevap: <strong>B</strong><br>Akdeniz iklimi ve Batı rüzgârları (A-B-C-D kuralı) Orta Kuşak sonucudur (2 tanesi)."
    },
    {
        "id": "cogr1-q6",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 6,
        "questionText": "Aşağıdakilerden hangisi Türkiye'nin enleme bağlı matematik konum sonuçları arasında yer almaz?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Gölge yönünün daima kuzeyi göstermesi"},
            {"key": "B", "text": "21 Haziran'da Antalya'nın gündüz süresinin Ankara'dan kısa olması"},
            {"key": "C", "text": "Güneş ışınlarının hiçbir zaman dik açı ile gelmemesi"},
            {"key": "D", "text": "Aynı anda tek ortak saatin kullanılması"},
            {"key": "E", "text": "Fiyort ve skyer kıyı tiplerine rastlanılmaması"}
        ],
        "correctAnswer": "D",
        "explanation": "Doğru Cevap: <strong>D</strong><br>Aynı anda tek ortak saat kullanılması Doğu-Batı yönlü boylam genişliğinin az olması sonucudur."
    },
    {
        "id": "cogr1-q7",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 7,
        "questionText": "Güneş ışınlarının yere düşme açısı küçüldükçe atmosferdeki tutulma oranı artmış olur.\n\nBuna göre, yukarıdaki Türkiye haritasında belirtilen illerden hangisinde yıl boyunca Güneş ışınlarının atmosferdeki tutulma oranı en fazladır?",
        "hasImage": True,
        "image": "assets/questions/cogr1_q7_map.png",
        "options": [
            {"key": "A", "text": "İzmir"},
            {"key": "B", "text": "Antalya"},
            {"key": "C", "text": "Sivas"},
            {"key": "D", "text": "Adapazarı"},
            {"key": "E", "text": "Iğdır"}
        ],
        "correctAnswer": "D",
        "explanation": "Doğru Cevap: <strong>D</strong><br>Adapazarı haritada en kuzeyde yer aldığı için Güneş ışınlarını en dar açıyla alır ve atmosferde tutulma en fazla olur."
    },
    {
        "id": "cogr1-q8",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 8,
        "questionText": "Aşağıdaki kentlerin hangisinden geçen paralel dairesinin boyu diğerlerine göre daha uzundur?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Hatay"},
            {"key": "B", "text": "İzmir"},
            {"key": "C", "text": "Iğdır"},
            {"key": "D", "text": "Konya"},
            {"key": "E", "text": "Sinop"}
        ],
        "correctAnswer": "A",
        "explanation": "Doğru Cevap: <strong>A</strong><br>Paralel dairelerinin boyu Ekvator'dan kutuplara doğru kısalır. En güneydeki Hatay'da paralel boyu en uzundur."
    },
    {
        "id": "cogr1-q9",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 9,
        "questionText": "Bolu'dan Muğla'ya giden bir gözlemci;\nI. Yerel saat\nII. Ulusal saat\nIII. Gölge boyu\ngibi özelliklerden hangilerinde değişiklik gözlemlemez?",
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
        "explanation": "Doğru Cevap: <strong>B</strong><br>Türkiye'nin her yerinde ortak (ulusal) saat (45° D Iğdır) kullanıldığı için ulusal saat değişmez."
    },
    {
        "id": "cogr1-q10",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 10,
        "questionText": "Yukarıdaki haritada gösterilen kentlerden (Sinop, Kayseri, Hatay) hangisinde yıl boyunca gece ile gündüz arasındaki zaman farkı daha azdır? Neden?",
        "hasImage": True,
        "image": "assets/questions/cogr1_q10_map.png",
        "options": [
            {"key": "A", "text": "Sinop – Ekvator'a daha uzak olduğu için"},
            {"key": "B", "text": "Iğdır – Güneş daha erken doğduğu için"},
            {"key": "C", "text": "Hatay – Ekvator'a yakın olduğu için"},
            {"key": "D", "text": "İzmir – Başlangıç meridyenine yakın olduğu için"},
            {"key": "E", "text": "Kayseri – Türkiye'nin orta kesiminde yer aldığı için"}
        ],
        "correctAnswer": "C",
        "explanation": "Doğru Cevap: <strong>C</strong><br>Ekvator'da yıl boyu 12 saat gece 12 saat gündüz yaşanır. Ekvator'a en yakın olan Hatay'da fark en azdır."
    },
    {
        "id": "cogr1-q11",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 11,
        "questionText": "I. Ekvator'a olan uzaklık\nII. Ortalama yükselti\nIII. Başlangıç meridyeni ile arasındaki zaman farkı\nIV. Yüz ölçümü\n\nYukarıdakilerden hangileri bir yerin matematik konumunu belirlerken kullanılır?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "I ve II"},
            {"key": "B", "text": "II ve III"},
            {"key": "C", "text": "II ve IV"},
            {"key": "D", "text": "I ve III"},
            {"key": "E", "text": "III ve IV"}
        ],
        "correctAnswer": "D",
        "explanation": "Doğru Cevap: <strong>D</strong><br>Ekvator'a uzaklık (Enlem/Paralel) ve Başlangıç meridyenine zaman farkı (Boylam/Meridyen) matematik konumdur."
    },
    {
        "id": "cogr1-q12",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 12,
        "questionText": "Aşağıdakilerden hangisi Türkiye'nin orta kuşakta yer aldığının bir göstergesidir?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Kuzeye doğru gidildikçe çizgisel hızın azalması"},
            {"key": "B", "text": "Yıl içinde belirgin sıcaklık farklarının ve mevsimlerin oluşması"},
            {"key": "C", "text": "En uzun gündüzün 21 Haziran'da yaşanması"},
            {"key": "D", "text": "Kısa mesafelerde iklim değişimlerinin yaşanması"},
            {"key": "E", "text": "21 Mart tarihinde 12 saat gündüz yaşanması"}
        ],
        "correctAnswer": "B",
        "explanation": "Doğru Cevap: <strong>B</strong><br>Dört mevsimin belirgin yaşanması ve yıllık sıcaklık farkları Orta Kuşak sonucudur."
    },
    {
        "id": "cogr1-q13",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 13,
        "questionText": "Aşağıda verilen kentlerden hangisinin yıl boyu alacakaranlık (tan ve grup) süresi diğerlerinden daha uzundur?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Van"},
            {"key": "B", "text": "Ardahan"},
            {"key": "C", "text": "Mersin"},
            {"key": "D", "text": "Amasya"},
            {"key": "E", "text": "İzmir"}
        ],
        "correctAnswer": "B",
        "explanation": "Doğru Cevap: <strong>B</strong><br>Kuzeye gidildikçe çizgisel hız azaldığı için Güneş daha yavaş doğup batar; Ardahan'da alacakaranlık süresi en uzundur."
    },
    {
        "id": "cogr1-q14",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 14,
        "questionText": "Türkiye 36°-42° Kuzey paralelleri ile 26°-45° Doğu meridyenleri arasında yer almaktadır.\n\nAşağıda verilen özelliklerden hangisi Türkiye'nin matematik konumuyla açıklanamaz?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Dört mevsimin belirgin olarak yaşanması"},
            {"key": "B", "text": "Antalya'dan Sinop'a doğru gidildikçe gece-gündüz süre farkının artması"},
            {"key": "C", "text": "Dağların güney yamacının yıl boyunca daha fazla güneşlenmesi"},
            {"key": "D", "text": "Üç kıtanın birbirine en yakın olduğu yerde bulunması"},
            {"key": "E", "text": "Kuzeye doğru gidildikçe yer çekiminin artması"}
        ],
        "correctAnswer": "D",
        "explanation": "Doğru Cevap: <strong>D</strong><br>Kıtalara, denizlere ve boğazlara göre konum Özel (Göreceli) konumdur."
    },
    {
        "id": "cogr1-q15",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 15,
        "questionText": "Ankara'dan günübirlik bir geziye katılan Atilla, gittiği yerde Güneş'in doğuş ve batış süresinin (alacakaranlık) kısaldığını ve yerel saatin daha geri olduğunu gözlemlemiştir.\n\nAtilla aşağıda verilen kentlerden hangisine gitmiş olabilir?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Safranbolu"},
            {"key": "B", "text": "Fethiye"},
            {"key": "C", "text": "İskenderun"},
            {"key": "D", "text": "Şırnak"},
            {"key": "E", "text": "Sakarya"}
        ],
        "correctAnswer": "B",
        "explanation": "Doğru Cevap: <strong>B</strong><br>Alacakaranlık kısaldığı için daha güneye, yerel saat daha geri olduğu için daha batıya gitmiştir (Güneybatı = Fethiye)."
    },
    {
        "id": "cogr1-q16",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 16,
        "questionText": "Aşağıda verilen kentlerden hangisinde yıl boyunca yerel saat ile ulusal saat (45° Doğu Iğdır) arasındaki farkın daha az olması beklenir?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Gümüşhane"},
            {"key": "B", "text": "İzmir"},
            {"key": "C", "text": "Hatay"},
            {"key": "D", "text": "Artvin"},
            {"key": "E", "text": "Antalya"}
        ],
        "correctAnswer": "D",
        "explanation": "Doğru Cevap: <strong>D</strong><br>Artvin 45° Doğu boylamına en yakın il olduğu için yerel saat farkı en azdır."
    },
    {
        "id": "cogr1-q17",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 17,
        "questionText": "I. Yer çekimi artar.\nII. Gurup ve tan süresi kısalır.\nIII. Gölge boyu uzar.\nIV. Güneş ışınlarının geliş açısı büyür.\n\nHaritada belirtilen ok yönünde (Güneyden Kuzeye) ilerlendiğinde yukarıda verilen durumlardan hangilerinin yaşanması beklenmez?",
        "hasImage": True,
        "image": "assets/questions/cogr1_q17_map.png",
        "options": [
            {"key": "A", "text": "Yalnız II"},
            {"key": "B", "text": "I ve II"},
            {"key": "C", "text": "I ve IV"},
            {"key": "D", "text": "II ve III"},
            {"key": "E", "text": "II ve IV"}
        ],
        "correctAnswer": "E",
        "explanation": "Doğru Cevap: <strong>E</strong><br>Kuzeye gidildikçe tan/gurup süresi uzar (kısalmaz) ve Güneş açısı küçülür (büyümez)."
    },
    {
        "id": "cogr1-q18",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 18,
        "questionText": "Haritada aynı enlem üzerinde yer alan üç il (Çanakkale, Ankara, Erzurum) gösterilmiştir.\n\nBelirtilen illerimizin ortak özellikleri arasında aşağıdakilerden hangisi yer almaz?",
        "hasImage": True,
        "image": "assets/questions/cogr1_q18_map.png",
        "options": [
            {"key": "A", "text": "Güneş ışınlarının geliş açısı"},
            {"key": "B", "text": "Çizgisel hızları"},
            {"key": "C", "text": "Ekvator'a olan kuş uçuşu uzaklıkları"},
            {"key": "D", "text": "Yükselti ortalamaları"},
            {"key": "E", "text": "Öğle vakti gölge boyları ve yönleri"}
        ],
        "correctAnswer": "D",
        "explanation": "Doğru Cevap: <strong>D</strong><br>Batıdan doğuya doğru yükselti artar; dolayısıyla yükselti ortalamaları aynı değildir."
    },
    {
        "id": "cogr1-q19",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 19,
        "questionText": "Yukarıdaki haritada yaklaşık aynı boylam üzerinde yer alan Gümüşhane ve Tunceli illeri gösterilmiştir.\n\nBuna göre, verilen kentlerle ilgili aşağıdakilerden hangisi söylenemez?",
        "hasImage": True,
        "image": "assets/questions/cogr1_q19_map.png",
        "options": [
            {"key": "A", "text": "Başlangıç meridyenine olan uzaklıkları eşittir."},
            {"key": "B", "text": "Öğle vakitleri yıl boyunca aynı anda yaşanır."},
            {"key": "C", "text": "Ulusal saat ile yerel saatleri arasındaki zaman farkı aynıdır."},
            {"key": "D", "text": "Yerel saatleri yıl boyunca aynıdır."},
            {"key": "E", "text": "Gün içinde gölgelerinin en kısa olduğu an aynıdır."}
        ],
        "correctAnswer": "A",
        "explanation": "Doğru Cevap: <strong>A</strong><br>Meridyen aralıkları kutuplara doğru daraldığı için kuzeydeki Gümüşhane Başlangıç Meridyenine km olarak daha yakındır."
    },
    {
        "id": "cogr1-q20",
        "testId": "cogr1",
        "testTitle": "Coğrafya Video Tarama Testi 1",
        "topicId": "cogr_tarama_1",
        "topicName": "Coğrafya Video Tarama 1",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 20,
        "questionText": "Türkiye ile ilgili aşağıda verilen özelliklerden hangisinde enlemin etkisinden söz edilemez?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Cephesel yağışların görülmesi"},
            {"key": "B", "text": "Aynı anda farklı mevsim koşullarının yaşanabilmesi"},
            {"key": "C", "text": "Akdeniz'de kıyı turizm süresinin Karadeniz'den uzun olması"},
            {"key": "D", "text": "Aydın'da aynı tarım ürününün Çanakkale'den önce olgunlaşması"},
            {"key": "E", "text": "Dört mevsimin belirgin yaşanabilmesi"}
        ],
        "correctAnswer": "B",
        "explanation": "Doğru Cevap: <strong>B</strong><br>Aynı anda farklı iklim ve mevsim koşullarının görülmesi yer şekilleri ve yükseltinin (Göreceli Konum) sonucudur."
    }
]

js_content = f"""// EKYS 2027 Odaklı Soru Veritabanı - Coğrafya Video Tarama Testi 1 (20 Soru)
window.EKYS_EXTRACTED_QUESTIONS = {json.dumps(cogr1_questions, ensure_ascii=False, indent=2)};
"""

with open('data/questions-db.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("data/questions-db.js güncellendi!")
