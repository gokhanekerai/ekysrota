// 2027 EKYS Hazır Soru Bankası & Konu Dağılımı Veri Seti
const EKYS_TOPICS = [
  { id: 'mevzuat-657', name: '657 Sayılı Devlet Memurları Kanunu', category: 'Mevzuat', icon: '⚖️', weight: 10 },
  { id: 'mevzuat-1739', name: '1739 Sayılı Millî Eğitim Temel Kanunu', category: 'Mevzuat', icon: '🏛️', weight: 8 },
  { id: 'mevzuat-222', name: '222 Sayılı İlköğretim ve Eğitim Kanunu', category: 'Mevzuat', icon: '🎒', weight: 6 },
  { id: 'mevzuat-cbk1', name: '1 Nolu CB Kararnamesi (MEB Teşkilatı)', category: 'Mevzuat', icon: '📜', weight: 8 },
  { id: 'mevzuat-4483', name: '4483 Sayılı Memurların Yargılanması', category: 'Mevzuat', icon: '🛡️', weight: 6 },
  { id: 'mevzuat-3071', name: '3071 Sayılı Dilekçe Hakkı & 4982 Bilgi Edinme', category: 'Mevzuat', icon: '📝', weight: 6 },
  { id: 'anayasa', name: 'T.C. Anayasası ve İdare Hukuku', category: 'Genel Kültür & Hukuk', icon: '🇹🇷', weight: 10 },
  { id: 'egitim-yonetimi', name: 'Eğitim Yönetimi ve Denetimi Kuramları', category: 'Eğitim Yönetimi', icon: '📊', weight: 20 },
  { id: 'liderlik', name: 'Eğitimde Liderlik, İletişim & Okul Kültürü', category: 'Eğitim Yönetimi', icon: '🌟', weight: 12 },
  { id: 'degerler-egitimi', name: 'Değerler Eğitimi ve Mesleki Etik', category: 'Değerler Eğitimi', icon: '🤝', weight: 10 },
  { id: 'genel-kultur', name: 'Genel Kültür, Türk Tarihi & Coğrafya', category: 'Genel Kültür & Hukuk', icon: '🌍', weight: 10 }
];

const INITIAL_QUESTIONS = [
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
    explanation: '657 DMK Madde 102: Hizmeti 1 yıldan 10 yıla kadar (10 yıl dahil) olanlar için 20 gün, hizmeti 10 yıldan fazla olanlar için 30 gündür. Zorunlu hallerde gidiş ve dönüş için en çok ikişer gün yol izni eklenebilir.'
  },
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
    explanation: 'Liyakat ve Kariyer ilkeleri 657 sayılı Devlet Memurları Kanunu\'nun temel ilkeleridir. 1739 sayılı Kanun\'un temel ilkeleri arasında Genellik ve Eşitlik, Ferdin ve Toplumun İhtiyaçları, Yöneltme, Eğitim Hakkı, Fırsat ve İmkân Eşitliği, Süreklilik, Atatürk İnkılap ve İlkeleri ve Atatürk Milliyetçiliği, Demokrasi Eğitimi, Laiklik, Bilimsellik, Planlılık, Karma Eğitim vb. yer alır.'
  },
  {
    id: 'q-1739-2',
    topicId: 'mevzuat-1739',
    topicName: '1739 Sayılı Kanun',
    question: '1739 sayılı Millî Eğitim Temel Kanunu\'na göre öğretmenlik mesleği ile ilgili aşağıdaki ifadelerden hangisi YANLIŞTIR?',
    options: [
      { key: 'A', text: 'Öğretmenlik, Devletin eğitim, öğretim ve bununla ilgili yönetim görevlerini üzerine alan özel bir ihtisas mesleğidir.' },
      { key: 'B', text: 'Öğretmenler bu görevlerini Türk Millî Eğitiminin amaçlarına ve temel ilkelerine uygun olarak ifa etmekle yükümlüdürler.' },
      { key: 'C', text: 'Öğretmenlik mesleğine hazırlık genel kültür, özel alan eğitimi ve pedagojik formasyon ile sağlanır.' },
      { key: 'D', text: 'Öğretmenlik kariyer basamakları aday öğretmenlik dahil 5 farklı unvandan oluşur.' },
      { key: 'E', text: 'Öğretmenlerin nitelikleri ve seçimi Bakanlıkça belirlenir.' }
    ],
    correctAnswer: 'D',
    explanation: '1739 sayılı Kanun\'un 43. maddesi öğretmenliği "özel bir ihtisas mesleği" olarak tanımlar. Kariyer basamakları Öğretmenlik Meslek Kanunu (ÖMK) düzenlemelerinde Aday Öğretmen, Öğretmen, Uzman Öğretmen ve Başöğretmen basamaklarını içerir.'
  },
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
    explanation: '222 sayılı Kanun Madde 3\'e göre: Mecburi ilköğretim çağı 6-14 yaş grubundaki çocukları kapsar. Bu çağ çocuğun 5 yaşını bitirdiği yılın eylül ayı sonunda başlar, 14 yaşını bitirip 15 yaşına girdiği yılın öğretim yılı sonunda biter.'
  },
  {
    id: 'q-cbk1-1',
    topicId: 'mevzuat-cbk1',
    topicName: '1 Sayılı CB Kararnamesi',
    question: '1 sayılı Cumhurbaşkanlığı Teşkilatı Hakkında Cumhurbaşkanlığı Kararnamesi\'ne göre Millî Eğitim Bakanlığı hizmet birimlerinden hangisi "Ders kitaplarını, eğitim araç-gereçlerini incelemek ve onaylamak" ile görevlidir?',
    options: [
      { key: 'A', text: 'Temel Eğitim Genel Müdürlüğü' },
      { key: 'B', text: 'Ortaöğretim Genel Müdürlüğü' },
      { key: 'C', text: 'Talim ve Terbiye Kurulu Başkanlığı' },
      { key: 'D', text: 'Ölçme, Değerlendirme ve Sınav Hizmetleri Genel Müdürlüğü' },
      { key: 'E', text: 'Yenilik ve Eğitim Teknolojileri Genel Müdürlüğü' }
    ],
    correctAnswer: 'C',
    explanation: 'Talim ve Terbiye Kurulu Başkanlığı, öğretim programları ve ders kitaplarının incelenmesi, onaylanması ve eğitim politikalarının belirlenmesinde Bakanlığın en yetkili bilimsel danışma ve karar organıdır.'
  },
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
    explanation: 'Dönüşümcü Liderlik; vizyon oluşturma, ilham verme, entelektüel uyarım ve çalışanları bireysel olarak destekleyerek değişimi yönetme özellikleriyle öne çıkar. İşlemci liderlik ise mevcut düzeni koruma ve ödül-ceza dengesine dayanır.'
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
    explanation: 'Öğretimsel Liderlik (Instructional Leadership); okul yöneticisinin sınıf içi öğrenme-öğretme süreçlerine, ders programlarına ve öğrenci başarısını artırıcı akademik etkinliklere bizzat odaklanmasını ifade eder.'
  },
  {
    id: 'q-anayasa-1',
    topicId: 'anayasa',
    topicName: 'T.C. Anayasası',
    question: '1982 Anayasası\'na göre, Türkiye Büyük Millet Meclisi (TBMM) genel seçimleri kaç yılda bir yapılır?',
    options: [
      { key: 'A', text: '3 yılda bir' },
      { key: 'B', text: '4 yılda bir' },
      { key: 'C', text: '5 yılda bir' },
      { key: 'D', text: '6 yılda bir' },
      { key: 'E', text: 'Cumhurbaşkanı kararına göre 2 yılda bir' }
    ],
    correctAnswer: 'C',
    explanation: '1982 Anayasası Madde 77\'ye göre: Türkiye Büyük Millet Meclisi ve Cumhurbaşkanlığı seçimleri beş yılda bir aynı günde yapılır.'
  },
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
