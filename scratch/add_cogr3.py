import json

cogr3_questions = [
    {
        "id": "cogr3-q1",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 1,
        "questionText": "Türkiye'nin kara komşularına ilişkin aşağıdakilerden hangisi yanlıştır?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "En uzun kara sınırı Suriye ile olan sınırdır."},
            {"key": "B", "text": "En eski sınır İran ile olan sınırdır."},
            {"key": "C", "text": "Kuzeybatıda Bulgaristan ile komşudur."},
            {"key": "D", "text": "Gürcistan ile en kısa kara sınırına sahiptir."},
            {"key": "E", "text": "Doğuda Ermenistan ile sınırı vardır."}
        ],
        "correctAnswer": "D",
        "explanation": "Doğru Cevap: <strong>D</strong><br>Türkiye'nin en kısa kara sınırı Gürcistan ile değil, Nahçıvan (Azerbaycan) iledir (yaklaşık 18 km / Dilucu Sınır Kapısı)."
    },
    {
        "id": "cogr3-q2",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 2,
        "questionText": "• Iğdır'da pamuk yetişmesi\n• Türkiye'de bitki örtüsü çeşidinin fazla olması\n• Akarsu rejimlerinin farklılık göstermesi\n• Tarım ürünü çeşidinin fazla olması\n\nTürkiye ile ilgili yukarıda verilen özelliklerin ortaya çıkmasında aşağıda verilenlerden hangileri etkilidir?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Matematik konum - Jeopolitik konum"},
            {"key": "B", "text": "Özel konum - Matematik konum"},
            {"key": "C", "text": "Deniz akıntıları - Özel konum"},
            {"key": "D", "text": "Okyanus akıntıları - Jeopolitik konum"},
            {"key": "E", "text": "Matematik konum - Deniz akıntıları"}
        ],
        "correctAnswer": "B",
        "explanation": "Doğru Cevap: <strong>B</strong><br>Iğdır'da pamuk yetişmesi çevresine göre çukurda yer alıp mikroklima oluşturması (özel konum) ile ilgilidir. Bitki örtüsü ve tarım çeşitliliği ise hem matematik konum (orta kuşak) hem de özel konum (yükselti, dağlar, denizellik) koşullarının ortak sonucudur."
    },
    {
        "id": "cogr3-q3",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 3,
        "questionText": "Aşağıda verilen illerden hangisinin sınırında komşu devlet sayısı daha fazladır?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Ağrı"},
            {"key": "B", "text": "Iğdır"},
            {"key": "C", "text": "Şırnak"},
            {"key": "D", "text": "Van"},
            {"key": "E", "text": "Kars"}
        ],
        "correctAnswer": "B",
        "explanation": "Doğru Cevap: <strong>B</strong><br>Iğdır ili; Ermenistan, Nahçıvan (Azerbaycan) ve İran olmak üzere 3 farklı komşu devletle sınır kapısı/bağlantısı bulunan tek ilimizdir."
    },
    {
        "id": "cogr3-q4",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 4,
        "questionText": "Gece-gündüz süreleri arasındaki fark Ekvator'dan kutuplara doğru artar.\n\nBuna göre, yukarıdaki Türkiye haritası üzerinde gösterilen illerden hangi ikisi arasında gece-gündüz süre farkı daha azdır?",
        "hasImage": True,
        "image": "assets/questions/cogr3_q4_map.png",
        "options": [
            {"key": "A", "text": "Zonguldak - Rize"},
            {"key": "B", "text": "Muğla - Ankara"},
            {"key": "C", "text": "Ankara - Rize"},
            {"key": "D", "text": "Zonguldak - Muğla"},
            {"key": "E", "text": "Muğla – Rize"}
        ],
        "correctAnswer": "A",
        "explanation": "Doğru Cevap: <strong>A</strong><br>Aynı enlem üzerindeki noktalarda gece-gündüz süreleri ve süre farkları eşittir. Zonguldak ve Rize yaklaşık olarak aynı enlem üzerinde yer aldıklarından aralarındaki gece-gündüz süre farkı en azdır."
    },
    {
        "id": "cogr3-q5",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 5,
        "questionText": "Aşağıda Türkiye'nin coğrafi konumu ile ilgili yapılan bazı araştırma sonuçları verilmiştir:\n\n• Merve: Türkiye'de tarımsal ürünlere bağlı olarak gelişen iç ticaret, coğrafi konum şartlarına bağlı olarak yapılır.\n• Mete: Türkiye'de gece-gündüz süre farkı güneyinden kuzeyine gidildikçe azalır.\n• Can: Yaz aylarında Güneyden Kuzeye gidildikçe gündüz süresi uzar.\n\nBuna göre, hangi araştırmacıların buldukları sonuçlar doğrudur?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Merve"},
            {"key": "B", "text": "Mete"},
            {"key": "C", "text": "Can"},
            {"key": "D", "text": "Merve ve Can"},
            {"key": "E", "text": "Merve ve Mete"}
        ],
        "correctAnswer": "D",
        "explanation": "Doğru Cevap: <strong>D</strong><br>• Merve doğrudur (coğrafi konum şartlarına bağlı ürün çeşitliliği iç ticareti canlandırır).<br>• Mete yanlıştır (güneyden kuzeye kutuplara yaklaşıldıkça gece-gündüz süre farkı artar).<br>• Can doğrudur (Kuzey Yarım Küre'de yaz aylarında kuzeye gidildikçe gündüzler uzar)."
    },
    {
        "id": "cogr3-q6",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 6,
        "questionText": "Ankara, Sivas ve Iğdır yaklaşık olarak aynı enlem üzerinde yer alır.\n\nBu üç merkez için;\nI. Güneş ışınlarının geliş açısı\nII. Ekvator'a kuş uçuşu mesafe\nIII. Sıcaklık ortalamaları\nIV. Cisimlerin öğle vakti gölge yönü\n\ngibi özelliklerden hangileri benzerlik gösterir?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "I ve III"},
            {"key": "B", "text": "II ve IV"},
            {"key": "C", "text": "I, II ve IV"},
            {"key": "D", "text": "I, III ve IV"},
            {"key": "E", "text": "I, II, III ve IV"}
        ],
        "correctAnswer": "C",
        "explanation": "Doğru Cevap: <strong>C</strong><br>Aynı enlem üzerinde bulunan merkezlerde Güneş ışınlarının geliş açısı (I), Ekvator'a kuş uçuşu mesafe (II) ve öğle vakti gölge yönü (IV) aynıdır. Sıcaklık ortalamaları (III) ise yükselti ve karasallık gibi özel konum şartları sebebiyle farklıdır."
    },
    {
        "id": "cogr3-q7",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 7,
        "questionText": "Türkiye'de,\n- Temmuz ve ağustos aylarının sıcak olması,\n- Dağların güneye bakan yamaçlarının kuzey yamaçlarından daha sıcak olması,\n- Kuzeyden esen rüzgârların hava sıcaklığını düşürmesi\n\ngibi özellikler aşağıdakilerden hangisinin sonucudur?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Topraklarının iki yarımada üzerinde yer alması"},
            {"key": "B", "text": "Çeşitli yer şekillerine sahip olması"},
            {"key": "C", "text": "Ortalama yükseltisinin fazla olması"},
            {"key": "D", "text": "Kuzey Yarım Küre'nin orta kuşağında yer alması"},
            {"key": "E", "text": "Üç tarafının denizlerle çevrili olması"}
        ],
        "correctAnswer": "D",
        "explanation": "Doğru Cevap: <strong>D</strong><br>En sıcak ayların Temmuz-Ağustos olması, Bakı etkisinin güney yamaçta olması ve kuzey sektörlü rüzgarların sıcaklığı düşürmesi Türkiye'nin Kuzey Yarım Küre'nin orta kuşağında (mutlak konum) yer aldığının kesin kanıtlarıdır."
    },
    {
        "id": "cogr3-q8",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 8,
        "questionText": "Aşağıdakilerden hangisi, Türkiye'nin matematik konumunun bir sonucudur?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "İki kıtada topraklarının olması"},
            {"key": "B", "text": "Kara sınırının deniz sınırından uzun olması"},
            {"key": "C", "text": "Yükseltinin batıdan doğuya gidildikçe artması"},
            {"key": "D", "text": "Üç tarafının denizlerle çevrili olması"},
            {"key": "E", "text": "Ilıman iklim kuşağında bulunması"}
        ],
        "correctAnswer": "E",
        "explanation": "Doğru Cevap: <strong>E</strong><br>Ilıman iklim kuşağında (Orta Kuşak, 36°-42° K) bulunmak enlem/matematik konumun bir sonucudur. Diğer maddeler özel (göreceli) konum faktörleridir."
    },
    {
        "id": "cogr3-q9",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 9,
        "questionText": "Hemen hemen aynı enlemler üzerinde bulunan Erzurum ve Çanakkale kentleri için 21 Aralık tarihinde, aşağıdakilerden hangisi kesinlikle aynıdır?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Güneş ışınlarının düşme açısı"},
            {"key": "B", "text": "Günlük sıcaklık farkı"},
            {"key": "C", "text": "Egemen rüzgâr yönü"},
            {"key": "D", "text": "En yüksek bağıl nem değeri"},
            {"key": "E", "text": "Günün en sıcak saati"}
        ],
        "correctAnswer": "A",
        "explanation": "Doğru Cevap: <strong>A</strong><br>Aynı enlemde yer alan noktalara Güneş ışınları yılın her gününde aynı açıyla düşer. Sıcaklık farkı, rüzgar yönü ve bağıl nem ise yükselti ve denizellik şartlarına (özel konum) bağlıdır."
    },
    {
        "id": "cogr3-q10",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 10,
        "questionText": "Aşağıdakilerden hangisi Türkiye'nin Kuzey Yarım Küre'de yer aldığını göstermez?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Güneyden kuzeye gidildikçe sıcaklık azalır."},
            {"key": "B", "text": "Kuzeyden gelen rüzgârlar hava sıcaklığını düşürür, güneyden gelenler artırır."},
            {"key": "C", "text": "Dağların güney yamaçları güneş ışınlarını kuzey yamaçlarına göre daha büyük açıyla alır."},
            {"key": "D", "text": "Yazın kuzeye doğru gidildikçe gündüz süresi, kışın da gece süresi uzar."},
            {"key": "E", "text": "Güneş ışınları asla dik açıyla gelmez ve gölge boyu sıfır olmaz."}
        ],
        "correctAnswer": "E",
        "explanation": "Doğru Cevap: <strong>E</strong><br>Güneş ışınlarının dik açıyla gelmemesi ve gölgenin sıfır olmaması Dönenceler Dışında (23°27' kuzey ve güney enlemleri dışında) yer almanın sonucudur; tek başına Kuzey Yarım Küre'de olduğunu göstermez."
    },
    {
        "id": "cogr3-q11",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 11,
        "questionText": "Fiziki haritalarda kullanılan renkler yer şekillerini değil, yükselti basamaklarını gösterir.\n\nBuna göre, aşağıdaki ovalardan hangisi bir Türkiye fiziki haritasında kahverengi ile gösterilir?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Yüksekova"},
            {"key": "B", "text": "Çarşamba Ovası"},
            {"key": "C", "text": "Çukurova"},
            {"key": "D", "text": "Ergene Ovası"},
            {"key": "E", "text": "Konya Ovası"}
        ],
        "correctAnswer": "A",
        "explanation": "Doğru Cevap: <strong>A</strong><br>Fiziki haritalarda 1500 metre ve üzerindeki yükselti basamakları kahverengiyle gösterilir. Hakkâri Yüksekova yaklaşık 1950-2000 metre rakımda yer aldığından kahverengi tonlarıyla temsil edilir."
    },
    {
        "id": "cogr3-q12",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 12,
        "questionText": "I. Ege Denizi'nin oluşması - İkinci Jeolojik Zaman\nII. Kuzey Anadolu ve Toros Dağlarının oluşması - Üçüncü Jeolojik Zaman\nIII. İstanbul Boğazı'nın oluşması - Dördüncü Jeolojik Zaman\n\nTürkiye'deki bazı coğrafi olayların meydana geldiği jeolojik zamanlarla ilgili yukarıdaki eşleştirmelerden hangileri doğrudur?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Yalnız I"},
            {"key": "B", "text": "Yalnız II"},
            {"key": "C", "text": "Yalnız III"},
            {"key": "D", "text": "I ve II"},
            {"key": "E", "text": "II ve III"}
        ],
        "correctAnswer": "E",
        "explanation": "Doğru Cevap: <strong>E</strong><br>Kuzey Anadolu Dağları ve Toroslar III. Jeolojik Zaman'da (Alp Orojenezi), İstanbul Boğazı ve Ege Denizi ise IV. Jeolojik Zaman'da (Kuvaterner) oluşmuştur. I. öncül yanlıştır (Egeid karası IV. zamanda çökmüştür)."
    },
    {
        "id": "cogr3-q13",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 13,
        "questionText": "Türkiye'de aşağıdaki fosil enerji kaynaklarından hangisinin bilinen toplam rezervi diğerlerinden daha azdır?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Petrol"},
            {"key": "B", "text": "Doğal gaz"},
            {"key": "C", "text": "Asfaltit"},
            {"key": "D", "text": "Linyit"},
            {"key": "E", "text": "Taş kömürü"}
        ],
        "correctAnswer": "B",
        "explanation": "Doğru Cevap: <strong>B</strong><br>Türkiye'de fosil yakıtlar içerisinde bilinen rezervi ve yerli üretimi en az olan enerji kaynağı doğal gazdır (ihtiyacın %98'den fazlası ithal edilir)."
    },
    {
        "id": "cogr3-q14",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 14,
        "questionText": "Türkiye'nin bazı ülkelerle olan sınırları akarsular üzerinden geçmektedir.\n\nAşağıdaki akarsulardan hangisi Türkiye - Ermenistan sınırının büyük bir bölümünü oluşturan akarsudur?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Aras"},
            {"key": "B", "text": "Çoruh"},
            {"key": "C", "text": "Fırat"},
            {"key": "D", "text": "Dicle"},
            {"key": "E", "text": "Asi"}
        ],
        "correctAnswer": "A",
        "explanation": "Doğru Cevap: <strong>A</strong><br>Aras Nehri ve onun önemli kolu olan Arpaçay, Türkiye ile Ermenistan sınırının büyük bir bölümünü oluşturan doğal sınır akarsularımızdır."
    },
    {
        "id": "cogr3-q15",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 15,
        "questionText": "Aşağıdaki haritada bazı alanlar (Yıldız Dağları, Kastamonu-Devrekani, Kırşehir, Menteşe ve Bitlis yöreleri) koyu renkle gösterilmiştir.\n\nAşağıdakilerden hangisi bu alanlar için ortak bir özelliktir?",
        "hasImage": True,
        "image": "assets/questions/cogr3_q15_map.png",
        "options": [
            {"key": "A", "text": "Karstik alanlardır."},
            {"key": "B", "text": "Volkanik alanlardır."},
            {"key": "C", "text": "Yaşlı temel arazilerdir."},
            {"key": "D", "text": "Doğa koruma alanlarıdır."},
            {"key": "E", "text": "Önemli linyit havzalarıdır."}
        ],
        "correctAnswer": "C",
        "explanation": "Doğru Cevap: <strong>C</strong><br>Haritada işaretlenen alanlar (Yıldız, Daday-Devrekani, Kırşehir, Menteşe, Bitlis vb.) I. Jeolojik Zaman'da (Paleozoik) oluşmuş sert, oturmuş kütleler olan <strong>Masif (Yaşlı Temel) Araziler</strong>dir."
    },
    {
        "id": "cogr3-q16",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 16,
        "questionText": "Doğu Anadolu, Akdeniz ve Karadeniz bölgelerindeki sıradağlarla ilgili aşağıdaki ifadelerden hangisi yanlıştır?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Etkin volkanlara rastlanır."},
            {"key": "B", "text": "Alp orojenezi döneminde oluşmuşlardır."},
            {"key": "C", "text": "Genelde yükseltileri 1500 m'yi geçer."},
            {"key": "D", "text": "Bazıları 4. zaman buzullaşmasından etkilenmişlerdir."},
            {"key": "E", "text": "Genelde doğu-batı yönünde uzanırlar"}
        ],
        "correctAnswer": "A",
        "explanation": "Doğru Cevap: <strong>A</strong><br>Türkiye'de aktif (etkin) volkanik dağ bulunmamaktadır. Türkiye'deki sıradağlar Alp Orojenezi kuşağında yer alan genç kıvrım dağlarıdır."
    },
    {
        "id": "cogr3-q17",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 17,
        "questionText": "Akdeniz Bölgesi'nde yer alan Çukurova ve Isparta Ovası fiziki haritada farklı renklerle gösterilmektedir.\n\nAynı bölgede yer aldığı hâlde iki ovanın farklı renklerle gösterilmesinin nedeni hangi bakımdan farklı olmalarıdır?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Yıllık yağış tutarı"},
            {"key": "B", "text": "Bulundukları bölüm"},
            {"key": "C", "text": "Enlem dereceleri"},
            {"key": "D", "text": "Deniz seviyesinden yükseklikleri"},
            {"key": "E", "text": "Bitki örtülerinin farklılığı"}
        ],
        "correctAnswer": "D",
        "explanation": "Doğru Cevap: <strong>D</strong><br>Fiziki haritalarda kullanılan renkler sadece yükselti basamaklarını gösterir. Çukurova kıyı delta ovası olup 0-200 metre (yeşil), Isparta Ovası ise iç kesimde yer alıp ~1000 metre (sarı/turuncu) yükseltiye sahiptir."
    },
    {
        "id": "cogr3-q18",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 18,
        "questionText": "Türkiye'nin dağlarıyla ilgili aşağıda verilen bilgilerden hangisi doğrudur?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Karadeniz ve Akdeniz kıyıları boyunca uzanan sıradağlar, kırılmayla oluşmuştur."},
            {"key": "B", "text": "Güncel buzullar çoğunlukla ülkenin doğusundaki dağlar üzerindedir."},
            {"key": "C", "text": "Ülkenin batısında çok sayıda volkanik dağ vardır."},
            {"key": "D", "text": "Dağların yükseltisi doğudan batıya doğru gidildikçe artmaktadır."},
            {"key": "E", "text": "En yüksek zirve kıvrımlı dağlar üzerindedir."}
        ],
        "correctAnswer": "B",
        "explanation": "Doğru Cevap: <strong>B</strong><br>Türkiye'de güncel buzullar çoğunlukla yükseltisi kalıcı kar sınırını (3500-4000 m) aşan Doğu Anadolu ve Doğu Karadeniz dağlarında (Hakkâri Cilo Dağı, Ağrı Dağı, Kaçkarlar, Süphan) bulunmaktadır."
    },
    {
        "id": "cogr3-q19",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 19,
        "questionText": "Aşağıdakilerden hangisi Türkiye'nin genç oluşumlu bir ülke olduğunun kanıtı olarak gösterilemez?",
        "hasImage": False,
        "image": None,
        "options": [
            {"key": "A", "text": "Taşkömürü yataklarının bulunması"},
            {"key": "B", "text": "Ortalama yükseltinin fazla olması"},
            {"key": "C", "text": "Sıcak su kaynaklarının bulunması"},
            {"key": "D", "text": "Deprem riskinin yüksek olması"},
            {"key": "E", "text": "Linyit yataklarının bulunması"}
        ],
        "correctAnswer": "A",
        "explanation": "Doğru Cevap: <strong>A</strong><br>Taşkömürü yatakları I. Jeolojik Zaman'da (Paleozoik / Karbonifer) oluşmuştur ve arazinin yaşlı (masif) olduğunu gösterir. Linyit, jeotermal sular, depremler ve genç yükselti ise III. ve IV. jeolojik zamanlara aittir."
    },
    {
        "id": "cogr3-q20",
        "testId": "cogr3",
        "testTitle": "Coğrafya Video Tarama Testi 3",
        "topicId": "cogr_tarama_3",
        "topicName": "Coğrafya Video Tarama 3",
        "category": "Genel Kültür - Coğrafya",
        "icon": "🌍",
        "questionNumber": 20,
        "questionText": "Aşağıdaki Türkiye haritasında beş dağ numaralarla gösterilmiştir:\nI: Menteşe Dağları\nII: Nur (Amanos) Dağları\nIII: Küre / Ilgaz Dağları\nIV: Doğu Karadeniz (Kaçkar) Dağları\nV: Karacadağ\n\nDağların oluşumları ile ilgili seçeneklerde yapılan eşleştirmelerden hangisinin doğru olduğu söylenemez?",
        "hasImage": True,
        "image": "assets/questions/cogr3_q20_map.png",
        "options": [
            {"key": "A", "text": "I - Volkanik"},
            {"key": "B", "text": "II - Kırık"},
            {"key": "C", "text": "III - Kıvrım"},
            {"key": "D", "text": "IV - Kıvrım"},
            {"key": "E", "text": "V - Volkanik"}
        ],
        "correctAnswer": "A",
        "explanation": "Doğru Cevap: <strong>A</strong><br>I numaralı konumda yer alan Menteşe Dağları volkanik değil, Ege'deki Horst-Graben sistemine bağlı bir <strong>Kırık (Horst)</strong> dağdır."
    }
]

# Read existing questions
with open('data/questions-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

json_text = text.split('window.EKYS_EXTRACTED_QUESTIONS =')[1].strip().rstrip(';')
all_questions = json.loads(json_text)

# Remove any existing cogr3 to avoid duplicates
all_questions = [q for q in all_questions if q.get('testId') != 'cogr3']

# Find where cogr2 ends to insert cogr3 right after cogr2
insert_idx = len(all_questions)
for i, q in enumerate(all_questions):
    if q.get('testId') == 'cogr2':
        insert_idx = i + 1

for i, q in enumerate(cogr3_questions):
    all_questions.insert(insert_idx + i, q)

new_js = f"""// EKYS 2027 Odaklı Soru Veritabanı
window.EKYS_EXTRACTED_QUESTIONS = {json.dumps(all_questions, ensure_ascii=False, indent=2)};
"""

with open('data/questions-db.js', 'w', encoding='utf-8') as f:
    f.write(new_js)

print(f"Başarıyla güncellendi! Toplam soru sayısı: {len(all_questions)}")
