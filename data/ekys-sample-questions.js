// 2027 EKYS Kapsamlı Soru Bankası & Konu Dağılımı Veri Seti
const EKYS_TOPICS = [
  { id: 'mevzuat-657', name: '657 Sayılı Devlet Memurları Kanunu', category: 'Mevzuat (%20)', icon: '⚖️', targetQuestions: 8 },
  { id: 'mevzuat-1739', name: '1739 Sayılı Millî Eğitim Temel Kanunu', category: 'Mevzuat (%20)', icon: '🏛️', targetQuestions: 4 },
  { id: 'mevzuat-222', name: '222 Sayılı İlköğretim ve Eğitim Kanunu', category: 'Mevzuat (%20)', icon: '🎒', targetQuestions: 4 },
  { id: 'mevzuat-cbk1', name: '1 Nolu CB Kararnamesi (MEB Teşkilatı)', category: 'Mevzuat (%20)', icon: '📜', targetQuestions: 4 },
  { id: 'mevzuat-4483', name: '4483 Sayılı Memurların Yargılanması', category: 'Mevzuat (%20)', icon: '🛡️', targetQuestions: 3 },
  { id: 'mevzuat-3071', name: '3071 Dilekçe & 4982 Bilgi Edinme', category: 'Mevzuat (%20)', icon: '📝', targetQuestions: 3 },
  { id: 'mevzuat-5018', name: '5018 Sayılı Kamu Malî Yönetimi Kanunu', category: 'Mevzuat (%20)', icon: '💰', targetQuestions: 3 },
  { id: 'mevzuat-4688', name: '4688 Sayılı Sendikalar Kanunu', category: 'Mevzuat (%20)', icon: '👥', targetQuestions: 3 },
  { id: 'egitim-yonetimi', name: 'Eğitim Yönetimi ve Denetimi Kuramları', category: 'Eğitim Yönetimi (%30)', icon: '📊', targetQuestions: 16 },
  { id: 'liderlik', name: 'Eğitimde Liderlik, İletişim & Okul Kültürü', category: 'Eğitim Yönetimi (%30)', icon: '🌟', targetQuestions: 8 },
  { id: 'degerler-egitimi', name: 'Değerler Eğitimi ve Mesleki Etik', category: 'Etik & Değerler (%10)', icon: '🤝', targetQuestions: 8 }
];

const INITIAL_QUESTIONS = [
  // --- 657 SAYILI DMK ---
  {
    id: 'q-657-1',
    topicId: 'mevzuat-657',
    topicName: '657 Sayılı DMK',
    question: '657 sayılı Devlet Memurları Kanunu\'na göre, devlet memurluğuna alınan adayların adaylık süresi kanunda belirtilen alt ve üst sınırlar açısından aşağıdakilerden hangisinde doğru olarak verilmiştir?',
    options: [
      { key: 'A', text: 'En az 6 ay, en çok 1 yıl' },
      { key: 'B', text: 'En az 1 yıl, en çok 2 yıl' },
      { key: 'C', text: 'En az 1 yıl, en çok 3 yıl' },
      { key: 'D', text: 'En az 6 ay, en çok 2 yıl' },
      { key: 'E', text: 'En az 2 yıl, en çok 3 yıl' }
    ],
    correctAnswer: 'B',
    explanation: '657 sayılı DMK Madde 54\'e göre: Adaylık süresi 1 yıldan az, 2 yıldan çok olamaz ve bu süre içinde aday memurun başka kurumlara nakli yapılamaz.'
  },
  {
    id: 'q-657-2',
    topicId: 'mevzuat-657',
    topicName: '657 Sayılı DMK',
    question: '657 sayılı Devlet Memurları Kanunu\'na göre, "Özürsüz olarak bir yılda toplam 20 gün göreve gelmemek" fiilini işleyen bir memura aşağıdaki disiplin cezalarından hangisi verilir?',
    options: [
      { key: 'A', text: 'Aylıktan kesme' },
      { key: 'B', text: 'Kademe ilerlemesinin durdurulması' },
      { key: 'C', text: 'Devlet memurluğundan çıkarma' },
      { key: 'D', text: 'Kınama' },
      { key: 'E', text: 'Uyarma' }
    ],
    correctAnswer: 'C',
    explanation: '657 DMK Madde 125/E-d bendine göre: Özürsüz veya izinsiz olarak kesintisiz 10 gün veya bir yılda toplam 20 gün göreve gelmemek "Devlet memurluğundan çıkarma" cezasını gerektirir.'
  },
  {
    id: 'q-657-3',
    topicId: 'mevzuat-657',
    topicName: '657 Sayılı DMK',
    question: '657 sayılı DMK\'ya göre memurlara verilecek yıllık izin süreleri ile ilgili hangisi DOĞRUDUR?',
    options: [
      { key: 'A', text: 'Hizmeti 1 yıldan 10 yıla kadar olanlar için 15 gün' },
      { key: 'B', text: 'Hizmeti 10 yıldan fazla olanlar için 20 gün' },
      { key: 'C', text: 'Hizmeti 1 yıldan 10 yıla kadar (10 yıl dahil) olanlar için 20 gün, 10 yıldan fazla olanlar için 30 gün' },
      { key: 'D', text: 'Hizmeti 5 yıla kadar olanlar için 20 gün, 5 yıldan fazla olanlar için 30 gün' },
      { key: 'E', text: 'Aday memurlar ilk 6 aydan sonra 15 gün yıllık izin hakkı kazanır' }
    ],
    correctAnswer: 'C',
    explanation: '657 DMK Madde 102: Hizmeti 1 yıldan 10 yıla kadar (10 yıl dahil) olanlar için 20 gün, hizmeti 10 yıldan fazla olanlar için 30 gündür.'
  },
  {
    id: 'q-657-4',
    topicId: 'mevzuat-657',
    topicName: '657 Sayılı DMK',
    question: '657 sayılı Devlet Memurları Kanunu\'na göre, memurun kasıt, kusur, ihmal veya tedbirsizliği sonucu idare zarara uğratılmışsa, bu zararın ödettirilmesi kimin yetkisindedir ve hangi değer üzerinden hesaplanır?',
    options: [
      { key: 'A', text: 'Zarar, o günkü piyasa rayiç bedeli üzerinden doğrudan memurun maaşından tek seferde kesilir.' },
      { key: 'B', text: 'Zarar, rayiç bedeli üzerinden ilgili memur tarafından ödenir veya genel hükümlere göre tahsil edilir.' },
      { key: 'C', text: 'Zarar sadece disiplin amirinin takdir edeceği tutar üzerinden tahsil edilir.' },
      { key: 'D', text: 'Zarar miktarı memurun bir aylık net maaşını geçemez.' },
      { key: 'E', text: 'Memur zararı ödemeyi reddederse sadece kınama cezası verilir.' }
    ],
    correctAnswer: 'B',
    explanation: '657 sayılı DMK Madde 12: Kişiler kamu hukukuna tabi görevlerle ilgili olarak uğradıkları zararlardan ötürü bu görevleri yerine getiren personel aleyhine değil, ilgili kurum aleyhine dava açarlar. Kurumun rücu hakkı saklıdır ve zarar rayiç bedel üzerinden tahsil edilir.'
  },

  // --- 1739 SAYILI MİLLÎ EĞİTİM TEMEL KANUNU ---
  {
    id: 'q-1739-1',
    topicId: 'mevzuat-1739',
    topicName: '1739 Sayılı Kanun',
    question: '1739 sayılı Millî Eğitim Temel Kanunu\'na göre aşağıdakilerden hangisi Türk Millî Eğitiminin temel ilkelerinden biri DEĞİLDİR?',
    options: [
      { key: 'A', text: 'Genellik ve Eşitlik' },
      { key: 'B', text: 'Fırsat ve İmkân Eşitliği' },
      { key: 'C', text: 'Liyakat ve Kariyer' },
      { key: 'D', text: 'Yöneltme' },
      { key: 'E', text: 'Laiklik' }
    ],
    correctAnswer: 'C',
    explanation: 'Liyakat ve Kariyer ilkeleri 657 sayılı DMK ilkeleridir. 1739\'un ilkeleri: Genellik ve Eşitlik, Ferdin ve Toplumun İhtiyaçları, Yöneltme, Eğitim Hakkı, Fırsat Eşitliği, Süreklilik, Laiklik, Bilimsellik, Karma Eğitim vb.'
  },
  {
    id: 'q-1739-2',
    topicId: 'mevzuat-1739',
    topicName: '1739 Sayılı Kanun',
    question: '1739 sayılı Kanun\'a göre, "Eğitim kurumları dil, ırk, cinsiyet, engellilik ve din ayırımı gözetilmeksizin herkese açıktır. Eğitimde hiçbir kişiye, aileye, zümreye veya sınıfa imtiyaz tanınamaz." hükmü hangi ilkeyi ifade eder?',
    options: [
      { key: 'A', text: 'Fırsat ve İmkân Eşitliği' },
      { key: 'B', text: 'Genellik ve Eşitlik' },
      { key: 'C', text: 'Eğitim Hakkı' },
      { key: 'D', text: 'Demokrasi Eğitimi' },
      { key: 'E', text: 'Süreklilik' }
    ],
    correctAnswer: 'B',
    explanation: '1739 sayılı Kanun Madde 4 "Genellik ve Eşitlik" ilkesidir. Fırsat ve imkân eşitliği ise maddi imkanlardan yoksun başarılı öğrencilere burs ve yardım sağlanmasını kapsar.'
  },

  // --- 222 SAYILI İLKÖĞRETİM KANUNU ---
  {
    id: 'q-222-1',
    topicId: 'mevzuat-222',
    topicName: '222 Sayılı Kanun',
    question: '222 sayılı İlköğretim ve Eğitim Kanunu\'na göre, mecburi ilköğretim çağı hangi yaş grubundaki çocukları kapsar?',
    options: [
      { key: 'A', text: '6-13 yaş' },
      { key: 'B', text: '6-14 yaş' },
      { key: 'C', text: '5-12 yaş' },
      { key: 'D', text: '7-14 yaş' },
      { key: 'E', text: '6-15 yaş' }
    ],
    correctAnswer: 'B',
    explanation: '222 sayılı Kanun Madde 3: Mecburi ilköğretim çağı 6-14 yaş grubundaki çocukları kapsar. 5 yaşını bitirdiği yılın eylül ayı sonunda başlar, 14 yaşını bitirip 15 yaşına girdiği yılın öğretim yılı sonunda biter.'
  },
  {
    id: 'q-222-2',
    topicId: 'mevzuat-222',
    topicName: '222 Sayılı Kanun',
    question: '222 sayılı Kanun\'a göre, ilköğretim kurumlarında ders yılı süresi en az kaç iş günüdür?',
    options: [
      { key: 'A', text: '160 iş günü' },
      { key: 'B', text: '170 iş günü' },
      { key: 'C', text: '180 iş günü' },
      { key: 'D', text: '190 iş günü' },
      { key: 'E', text: '200 iş günü' }
    ],
    correctAnswer: 'C',
    explanation: '222 sayılı Kanun Madde 44: İlköğretim okullarında ders yılı süresi, derslerin başladığı günden kesildiği güne kadar, dinlenme ve tatil günleri hariç en az 180 iş günüdür.'
  },

  // --- 1 NOLU CB KARARNAMESİ (MEB) ---
  {
    id: 'q-cbk1-1',
    topicId: 'mevzuat-cbk1',
    topicName: '1 Sayılı CB Kararnamesi',
    question: '1 sayılı Cumhurbaşkanlığı Teşkilatı Hakkında CB Kararnamesi\'ne göre Millî Eğitim Bakanlığı hizmet birimlerinden hangisi "Ders kitaplarını, eğitim araç-gereçlerini incelemek ve onaylamak" ile görevlidir?',
    options: [
      { key: 'A', text: 'Temel Eğitim Genel Müdürlüğü' },
      { key: 'B', text: 'Ortaöğretim Genel Müdürlüğü' },
      { key: 'C', text: 'Talim ve Terbiye Kurulu Başkanlığı' },
      { key: 'D', text: 'Ölçme, Değerlendirme ve Sınav Hizmetleri Genel Müdürlüğü' },
      { key: 'E', text: 'Yenilik ve Eğitim Teknolojileri Genel Müdürlüğü' }
    ],
    correctAnswer: 'C',
    explanation: 'Talim ve Terbiye Kurulu Başkanlığı, öğretim programları ve ders kitaplarının incelenmesi ve onaylanmasında Bakanlığın bilimsel danışma ve karar organıdır.'
  },

  // --- 4483 SAYILI KANUN ---
  {
    id: 'q-4483-1',
    topicId: 'mevzuat-4483',
    topicName: '4483 Sayılı Kanun',
    question: '4483 sayılı Memurlar ve Diğer Kamu Görevlilerinin Yargılanması Hakkında Kanun\'a göre, ilçe milli eğitim müdürü hakkında soruşturma izni vermeye yetkili merci aşağıdakilerden hangisidir?',
    options: [
      { key: 'A', text: 'İlçe Millî Eğitim Müdürü' },
      { key: 'B', text: 'Kaymakam' },
      { key: 'C', text: 'Vali' },
      { key: 'D', text: 'Bakan' },
      { key: 'E', text: 'Cumhuriyet Başsavcısı' }
    ],
    correctAnswer: 'B',
    explanation: '4483 sayılı Kanun Madde 3/b bendine göre: İlçede görevli memurlar ve diğer kamu görevlileri hakkında soruşturma izni vermeye yetkili merci Kaymakamdır.'
  },
  {
    id: 'q-4483-2',
    topicId: 'mevzuat-4483',
    topicName: '4483 Sayılı Kanun',
    question: '4483 sayılı Kanun\'a göre yetkili merci soruşturma izni verilmesi veya verilmemesi konusundaki kararını en geç kaç gün içinde verir?',
    options: [
      { key: 'A', text: '15 gün (zorunlu hallerde 15 gün uzatılabilir)' },
      { key: 'B', text: '30 gün (zorunlu hallerde 15 gün uzatılabilir)' },
      { key: 'C', text: '30 gün (uzatılamaz)' },
      { key: 'D', text: '60 gün' },
      { key: 'E', text: '45 gün' }
    ],
    correctAnswer: 'B',
    explanation: '4483 sayılı Kanun Madde 7: Yetkili merci soruşturma izni konusundaki kararını 30 gün içinde verir. Bu süre zorunlu hallerde 15 günü geçmemek üzere bir defa uzatılabilir.'
  },

  // --- EĞİTİM YÖNETİMİ & KURAMLAR ---
  {
    id: 'q-yonetim-1',
    topicId: 'egitim-yonetimi',
    topicName: 'Eğitim Yönetimi',
    question: 'Eğitim yönetiminde yöneticinin okul vizyonunu öğretmen ve paydaşlarla paylaşarak onları değişime ve yüksek performansa motive ettiği, çalışanların bireysel gelişimine odaklandığı liderlik yaklaşımı aşağıdakilerden hangisidir?',
    options: [
      { key: 'A', text: 'Dönüşümcü (Dönüştürücü) Liderlik' },
      { key: 'B', text: 'Etkileşimci (İşlemci) Liderlik' },
      { key: 'C', text: 'Otokratik Liderlik' },
      { key: 'D', text: 'Bürokratik Liderlik' },
      { key: 'E', text: 'Serbest Bırakıcı (Laissez-faire) Liderlik' }
    ],
    correctAnswer: 'A',
    explanation: 'Dönüşümcü Liderlik; vizyon oluşturma, ilham verme, entelektüel uyarım ve çalışanları bireysel olarak destekleme özellikleriyle öne çıkar.'
  },
  {
    id: 'q-yonetim-2',
    topicId: 'egitim-yonetimi',
    topicName: 'Eğitim Yönetimi',
    question: 'Henri Fayol\'un klasik yönetim süreçleri modelinde yer alan 5 temel yönetsel işlev aşağıdakilerden hangisinde eksiksiz olarak verilmiştir?',
    options: [
      { key: 'A', text: 'Planlama - Örgütleme - Yöneltme (Emir-Komuta) - Eşgüdümleme (Koordinasyon) - Denetim' },
      { key: 'B', text: 'Gözlem - Teftiş - Bütçeleme - Personel Alma - Raporlama' },
      { key: 'C', text: 'Motivasyon - İletişim - Karar Verme - Liderlik - Değerlendirme' },
      { key: 'D', text: 'Amaç Belirleme - Öğretim Tasarımı - Ölçme - Rehberlik - İnceleme' },
      { key: 'E', text: 'Yetki Devri - Hiyerarşi - Disiplin - Kayıt Tutma - Onaylama' }
    ],
    correctAnswer: 'A',
    explanation: 'Henri Fayol\'un klasik yönetim süreçleri: Planlama (Öngörme), Örgütleme (Teşkilatlanma), Yöneltme (Emir Verme), Eşgüdüm (Koordinasyon) ve Denetim (Kontrol) olarak 5 temel işleve dayanır.'
  },
  {
    id: 'q-liderlik-1',
    topicId: 'liderlik',
    topicName: 'Eğitimde Liderlik',
    question: 'Okul yöneticisinin öğretim programlarının uygulanması, öğretmenlerin mesleki gelişimi, ders denetimi ve öğrenci öğrenmesinin geliştirilmesine doğrudan odaklandığı liderlik türü aşağıdakilerden hangisidir?',
    options: [
      { key: 'A', text: 'Öğretimsel (Öğretim) Liderliği' },
      { key: 'B', text: 'Karizmatik Liderlik' },
      { key: 'C', text: 'Paternalist Liderlik' },
      { key: 'D', text: 'Durumsal Liderlik' },
      { key: 'E', text: 'Stratejik Liderlik' }
    ],
    correctAnswer: 'A',
    explanation: 'Öğretimsel Liderlik (Instructional Leadership); okul yöneticisinin sınıf içi öğrenme-öğretme süreçlerine, ders programlarına ve öğrenci başarısını artırıcı etkinliklere odaklanmasını ifade eder.'
  },

  // --- DEĞERLER EĞİTİMİ & ETİK ---
  {
    id: 'q-degerler-1',
    topicId: 'degerler-egitimi',
    topicName: 'Değerler Eğitimi & Etik',
    question: 'Kamu Görevlileri Etik Davranış İlkeleri ile Başvuru Usul ve Esasları Hakkında Yönetmelik\'e göre, kamu görevlilerinin hediye alma yasağı kapsamına aşağıdakilerden hangisi GİRMEZ?',
    options: [
      { key: 'A', text: 'Görev yapılan kurumla iş ilişkisi olanlardan alınan değerli eşyalar' },
      { key: 'B', text: 'Hizmetten yararlananlardan sağlanan borç veya krediler' },
      { key: 'C', text: 'Kurumun tanıtımına katkı sağlayan ve ticari değeri olmayan anı eşyaları (plaket, rozet vb.)' },
      { key: 'D', text: 'Tedarikçi firmaların sağladığı ücretsiz tatil veya seyahatler' },
      { key: 'E', text: 'Doğrudan veya dolaylı olarak sağlanan menfaatler' }
    ],
    correctAnswer: 'C',
    explanation: 'Kitap, dergi, makale, bülten veya kurum faaliyetlerini tanıtıcı plaket, rozet gibi ticari değeri olmayan hatıra niteliğindeki eşyalar hediye alma yasağının kapsamı dışındadır.'
  }
];

if (typeof window !== 'undefined') {
  window.EKYS_TOPICS = EKYS_TOPICS;
  window.INITIAL_QUESTIONS = INITIAL_QUESTIONS;
}
