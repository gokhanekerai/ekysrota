// EKYS 2027 Pro - Ana Uygulama Kontrolcüsü (SPA Controller)

class EKYSApp {
  constructor() {
    this.currentView = 'dashboard';
    this.activeQuiz = null;
    this.timerInterval = null;
    this.countdownInterval = null;
    this.strikeMode = false;
    this.currentCategoryFilter = 'all';

    this.init();
  }

  init() {
    this.bindNavigation();
    this.startExamCountdown();
    this.renderDashboard();
    this.renderTestHub();
    this.renderWrongPoolList();
    this.renderFavoritesList();
    this.renderStatsView();
    this.applySavedTheme();
    this.initDropzones();

    // Çıkış uyarısı
    window.addEventListener('beforeunload', (e) => {
      if (this.activeQuiz && !this.activeQuiz.isFinished) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  // --- NAVİGASYON ---
  bindNavigation() {
    const navButtons = document.querySelectorAll('[data-view-target]');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = btn.getAttribute('data-view-target');
        this.navigateTo(targetView);
      });
    });
  }

  navigateTo(viewId) {
    if (this.activeQuiz && !this.activeQuiz.isFinished && viewId !== 'quiz-active') {
      if (!confirm('Devam eden bir sınavınız var. Çıkmak istediğinize emin misiniz?')) {
        return;
      }
      this.stopQuizTimer();
      this.activeQuiz = null;
    }

    this.currentView = viewId;

    // View görünürlüklerini ayarla
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });
    const targetSection = document.getElementById(`view-${viewId}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Menü aktifliklerini güncelle
    document.querySelectorAll('[data-view-target]').forEach(btn => {
      if (btn.getAttribute('data-view-target') === viewId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Sayfa değiştikçe verileri tazele
    if (viewId === 'dashboard') this.renderDashboard();
    if (viewId === 'test-hub') this.renderTestHub();
    if (viewId === 'wrong-pool') this.renderWrongPoolList();
    if (viewId === 'favorites') this.renderFavoritesList();
    if (viewId === 'stats') this.renderStatsView();
    if (viewId === 'admin-panel') this.loadAdminUsersList();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- GERİ SAYIM SAYACI ---
  startExamCountdown() {
    const target = new Date('2027-03-15T09:30:00').getTime();

    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        const cd = document.getElementById('countdown-display');
        if (cd) cd.innerHTML = '<span style="color:#ef4444; font-weight:800;">🎯 2027 EKYS Günü Geldi! Başarılar!</span>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const elDays = document.getElementById('cd-days');
      const elHours = document.getElementById('cd-hours');
      const elMins = document.getElementById('cd-mins');
      const elSecs = document.getElementById('cd-secs');

      if (elDays) elDays.textContent = days;
      if (elHours) elHours.textContent = hours < 10 ? '0' + hours : hours;
      if (elMins) elMins.textContent = mins < 10 ? '0' + mins : mins;
      if (elSecs) elSecs.textContent = secs < 10 ? '0' + secs : secs;
    };

    update();
    this.countdownInterval = setInterval(update, 1000);
  }

  // --- DASHBOARD (GENEL BAKIŞ) ---
  renderDashboard() {
    const questions = window.storageService.getQuestions();
    const history = window.storageService.getQuizHistory();
    const wrongPool = window.storageService.getWrongPool();
    const favs = window.storageService.getFavorites();

    const totalSolved = history.reduce((acc, q) => acc + (q.totalQuestions || 0), 0);
    const totalCorrect = history.reduce((acc, q) => acc + (q.correctCount || 0), 0);
    const successRate = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

    const elTotalQ = document.getElementById('stat-total-questions');
    const elTotalSolved = document.getElementById('stat-total-solved');
    const elSuccessRate = document.getElementById('stat-success-rate');
    const elWrongCount = document.getElementById('stat-wrong-count');
    const badgeWrong = document.getElementById('badge-wrong-count');
    const badgeFav = document.getElementById('badge-fav-count');

    if (elTotalQ) elTotalQ.textContent = questions.length;
    if (elTotalSolved) elTotalSolved.textContent = totalSolved;
    if (elSuccessRate) elSuccessRate.textContent = `%${successRate}`;
    if (elWrongCount) elWrongCount.textContent = wrongPool.length;

    if (badgeWrong) {
      badgeWrong.textContent = wrongPool.length;
      badgeWrong.style.display = wrongPool.length > 0 ? 'inline-block' : 'none';
    }
    if (badgeFav) {
      badgeFav.textContent = favs.length;
      badgeFav.style.display = favs.length > 0 ? 'inline-block' : 'none';
    }

    // Son çözülen testler
    const recentEl = document.getElementById('dashboard-recent-quizzes');
    if (recentEl) {
      if (history.length === 0) {
        recentEl.innerHTML = `
          <div class="card" style="text-align: center; color: var(--text-secondary); padding: 24px;">
            Henüz çözülen bir test bulunmuyor. Test Merkezinden hemen bir deneme veya soru seti başlatabilirsiniz.
          </div>
        `;
      } else {
        recentEl.innerHTML = `
          <div class="grid-cards">
            ${history.slice(0, 3).map(h => `
              <div class="card">
                <div style="font-weight: 700; font-size: 1rem; margin-bottom: 6px;">${h.title}</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 12px;">${new Date(h.date).toLocaleDateString('tr-TR')}</div>
                <div style="display: flex; gap: 8px; font-size: 0.85rem;">
                  <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">✅ ${h.correctCount} D</span>
                  <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">❌ ${h.wrongCount} Y</span>
                  <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc;">🎯 ${parseFloat(h.netScore).toFixed(2)} Net</span>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    }
  }

  // --- SINAV & TEST MERKEZİ ---
  filterTestHub(category) {
    this.currentCategoryFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      if (btn.getAttribute('data-category') === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    this.renderTestHub();
  }

  filterTestHubCategory(cat) {
    this.navigateTo('test-hub');
    this.filterTestHub(cat);
  }

  // --- ALT KONU SEÇİM VE QUIZ MOTORU ---
  getSubTopicData() {
    return {
      'genel-kultur': {
        title: '🌍 Genel Kültür Alt Konu Testleri (Soru 1-16)',
        desc: 'Tarih, Coğrafya, Temel Yurttaşlık ve Güncel Olaylar arasından test seçin:',
        items: [
          {
            id: 'tarih',
            name: 'Tarih Testleri',
            icon: '📜',
            desc: 'İslamiyet Öncesi Türk Tarihi, Türk-İslam Devletleri, Osmanlı Tarihi ve Kültür Medeniyeti.',
            filterKey: 'tarih',
            badge: '%20 Genel Kültür'
          },
          {
            id: 'cografya',
            name: 'Coğrafya Testleri',
            icon: '🗺️',
            desc: 'Türkiye Fiziki, Beşeri ve Ekonomik Coğrafyası, Harita Bilgisi ve Doğal Kaynaklar.',
            filterKey: 'cografya',
            badge: '%20 Genel Kültür'
          },
          {
            id: 'yurttaslik',
            name: 'Temel Yurttaşlık Bilgisi',
            icon: '🏛️',
            desc: 'Temel Hukuk Kavramları, Türk Anayasa Tarihi, Devlet Yapısı ve İdari Teşkilat.',
            filterKey: 'yurttaslik',
            badge: '%20 Genel Kültür'
          },
          {
            id: 'guncel',
            name: 'Güncel / Kültürel Olaylar',
            icon: '🌐',
            desc: 'Türkiye ve Dünya ile İlgili Genel, Kültürel ve Güncel Sosyoekonomik Gelişmeler.',
            filterKey: 'guncel',
            badge: '%20 Genel Kültür'
          }
        ]
      },
      'inkilap': {
        title: '⚔️ T.C. İnkılâp Tarihi ve Atatürkçülük (Soru 17-28)',
        desc: 'Milli Mücadele, İlkeler, İnkılaplar ve Atatürk Dönemi konularından test seçin:',
        items: [
          {
            id: 'inkilap_milli_mucadele',
            name: 'Milli Mücadele Dönemi',
            icon: '⚔️',
            desc: 'Genelgeler, Kongreler, TBMM\'nin Açılması, Kurtuluş Savaşı Cepheleri, Mudanya ve Lozan.',
            filterKey: 'inkilap',
            badge: '%15 İnkılap Tarihi'
          },
          {
            id: 'inkilap_ilkeler',
            name: 'Atatürk İlkeleri ve İnkılapları',
            icon: '💡',
            desc: 'Cumhuriyetçilik, Milliyetçilik, Halkçılık, Devletçilik, Laiklik, İnkılapçılık ve Reformlar.',
            filterKey: 'inkilap',
            badge: '%15 İnkılap Tarihi'
          },
          {
            id: 'inkilap_politika',
            name: 'Türk İç ve Dış Politikası',
            icon: '🤝',
            desc: 'Çok Partili Hayat Denemeleri, Balkan Antantı, Sadabat Paktı, Montrö ve Hatay.',
            filterKey: 'inkilap',
            badge: '%15 İnkılap Tarihi'
          },
          {
            id: 'inkilap_tum',
            name: '🏆 Tüm İnkılap Tarihi Karma Testi',
            icon: '🎯',
            desc: 'Tüm İnkılap Tarihi ve Atatürkçülük soru havuzundan karma pratik ve süreli sınav.',
            filterKey: 'inkilap',
            badge: 'Karma Test'
          }
        ]
      },
      'egitim': {
        title: '🎓 Eğitim Bilimleri Alt Konu Testleri (Soru 29-40)',
        desc: 'Eğitim Yönetimi, Liderlik, Ölçme ve Öğrenme Kuramları konularından test seçin:',
        items: [
          {
            id: 'egitim_yonetim',
            name: 'Eğitim Yönetimi ve Denetimi',
            icon: '🏫',
            desc: 'Yönetim Süreçleri, Okul Yönetimi, Denetim Kuramları ve Çağdaş Yaklaşımlar.',
            filterKey: 'egitim',
            badge: '%15 Eğitim Bilimleri'
          },
          {
            id: 'egitim_liderlik',
            name: 'Liderlik ve İletişim',
            icon: '👥',
            desc: 'Liderlik Kuramları, Örgütsel İletişim, Çatışma Yönetimi ve Motivasyon.',
            filterKey: 'egitim',
            badge: '%15 Eğitim Bilimleri'
          },
          {
            id: 'egitim_olcme',
            name: 'Ölçme ve Değerlendirme',
            icon: '📊',
            desc: 'Geçerlik, Güvenirlik, Madde ve Test İstatistikleri, Tamamlayıcı Değerlendirme.',
            filterKey: 'egitim',
            badge: '%15 Eğitim Bilimleri'
          },
          {
            id: 'egitim_ogrenme',
            name: 'Öğrenme ve Öğretim Kuramları',
            icon: '🧠',
            desc: 'Davranışçı, Bilişsel ve Yapılandırmacı Kuramlar, Öğretim Stratejileri ve Yöntemleri.',
            filterKey: 'egitim',
            badge: '%15 Eğitim Bilimleri'
          }
        ]
      },
      'maarif': {
        title: '🌟 Türkiye Yüzyılı Maarif Modeli (Soru 41-64)',
        desc: 'Ortak Metin, Beceriler, Erdem-Değer-Eylem ve Öğrenci Profili testleri:',
        items: [
          {
            id: 'maarif_ortak_metin',
            name: 'Öğretim Programları Ortak Metni',
            icon: '📑',
            desc: 'Maarif Modelinin Felsefesi, Temel Yaklaşımı, Öğrenme Tasarımı ve Esasları.',
            filterKey: 'maarif',
            badge: '%30 Maarif Modeli'
          },
          {
            id: 'maarif_beceriler',
            name: 'Beceriler Çerçevesi',
            icon: '🧩',
            desc: 'Kavramsal Beceriler, Alan Becerileri, Sosyo-Duygusal Beceriler ve Eğilimler.',
            filterKey: 'maarif',
            badge: '%30 Maarif Modeli'
          },
          {
            id: 'maarif_erdem_deger',
            name: 'Erdem - Değer - Eylem Modeli',
            icon: '💎',
            desc: 'Adalet, Saygı, Sorumluluk, Sevgi, Dostluk, Dürüstlük ve Özdenetim Değerleri.',
            filterKey: 'maarif',
            badge: '%30 Maarif Modeli'
          },
          {
            id: 'maarif_ogrenci_profili',
            name: 'Program Bileşenleri & Öğrenci Profili',
            icon: '🎯',
            desc: 'Yetkin ve Erdemli İnsan Profili, Farklılaştırılmış Öğretim ve Disiplinlerarası Yaklaşım.',
            filterKey: 'maarif',
            badge: '%30 Maarif Modeli'
          }
        ]
      },
      'mevzuat': {
        title: '⚖️ Mevzuat Alt Konu Testleri (Soru 65-80)',
        desc: '1982 Anayasası, MEB Temel Kanunları ve İlgili Mevzuattan test seçin:',
        items: [
          {
            id: 'mevzuat_anayasa',
            name: '1982 T.C. Anayasası',
            icon: '📘',
            desc: 'Temel Hak ve Ödevler, Yasama, Yürütme, Yargı ve İdare Esasları.',
            filterKey: 'mevzuat_anayasa',
            badge: '%20 Mevzuat'
          },
          {
            id: 'mevzuat_657',
            name: '657 Sayılı Devlet Memurları Kanunu',
            icon: '📕',
            desc: 'Genel İlkeler, Ödev ve Sorumluluklar, Haklar, Disiplin ve Cezalar.',
            filterKey: 'mevzuat_657',
            badge: '%20 Mevzuat'
          },
          {
            id: 'mevzuat_1739',
            name: '1739 Sayılı Millî Eğitim Temel Kanunu',
            icon: '📙',
            desc: 'Türk Millî Eğitiminin Temel İlkeleri, Okul Kademeleri ve Öğretmenlik Mesleği.',
            filterKey: 'mevzuat_1739',
            badge: '%20 Mevzuat'
          },
          {
            id: 'mevzuat_222',
            name: '222 Sayılı İlköğretim ve Eğitim Kanunu',
            icon: '📗',
            desc: 'İlköğretim Çağı, Kayıt-Kabul, Devam Takibi, Okul Gelirleri ve Cezalar.',
            filterKey: 'mevzuat_222',
            badge: '%20 Mevzuat'
          },
          {
            id: 'mevzuat_5018',
            name: '5018 Sayılı Kamu Mali Yönetimi Kanunu',
            icon: '💰',
            desc: 'Bütçe İlkeleri, Harcama Yetkilisi, Gerçekleştirme Görevlisi ve İç Kontrol.',
            filterKey: 'mevzuat_5018',
            badge: '%20 Mevzuat'
          },
          {
            id: 'mevzuat_4483',
            name: '4483 Sayılı Memurların Yargılanması Kanunu',
            icon: '⚖️',
            desc: 'Ön İnceleme, İzin Vermeye Yetkili Merciler ve Yargılama Usulü.',
            filterKey: 'mevzuat_4483',
            badge: '%20 Mevzuat'
          },
          {
            id: 'mevzuat_4688',
            name: '4688 Sayılı Kamu Görevlileri Sendikaları',
            icon: '🤝',
            desc: 'Sendika Kurulması, Organları, Toplu Sözleşme ve Sendikal Güvenceler.',
            filterKey: 'mevzuat_4688',
            badge: '%20 Mevzuat'
          },
          {
            id: 'mevzuat_5442',
            name: '5442 Sayılı İl İdaresi Kanunu',
            icon: '🏢',
            desc: 'Vali ve Kaymakamın Yetkileri, İl ve İlçe İdare Teşkilatı.',
            filterKey: 'mevzuat_5442',
            badge: '%20 Mevzuat'
          },
          {
            id: 'mevzuat_3071',
            name: '3071 Sayılı Dilekçe Hakkı Kanunu',
            icon: '📄',
            desc: 'Dilekçe Hakkının Kullanımı, Başvuru ve Cevap Verme Süreleri.',
            filterKey: 'mevzuat_3071',
            badge: '%20 Mevzuat'
          },
          {
            id: 'mevzuat_1cbk',
            name: '1 Sayılı CBK (Millî Eğitim Bakanlığı)',
            icon: '🏛️',
            desc: 'MEB Hizmet Birimleri, Görev ve Yetkileri ve Teşkilat Yapısı.',
            filterKey: 'mevzuat_1cbk',
            badge: '%20 Mevzuat'
          },
          {
            id: 'mevzuat_tum',
            name: '🏆 Tüm Mevzuat Karma Testi',
            icon: '🎯',
            desc: 'Tüm kanun ve yönetmeliklerden derlenmiş karma pratik ve sınav.',
            filterKey: 'mevzuat',
            badge: '58+ Soru'
          }
        ]
      },
      'cikmis': {
        title: '📜 MEB EKYS Çıkmış Sınav Soruları (2019 - 2026)',
        desc: 'Geçmiş yıllarda ÖSYM tarafından uygulanan tüm resmî EKYS sınavları. Yıllara göre çözün veya yeni çıkmış sorular ekleyin.',
        items: [
          {
            id: 'ekys_2026',
            name: '2026 EKYS Çıkmış Sınavı',
            icon: '📜',
            desc: '2026 Mart MEB Yönetici Seçme Sınavı soruları ve resmî cevap anahtarı.',
            filterKey: 'ekys_2026',
            badge: '80 Soru Hedef'
          },
          {
            id: 'ekys_2025',
            name: '2025 EKYS Çıkmış Sınavı',
            icon: '📜',
            desc: '2025 MEB Yönetici Seçme Sınavı soruları ve detaylı çözümleri.',
            filterKey: 'ekys_2025',
            badge: '80 Soru Hedef'
          },
          {
            id: 'ekys_2024',
            name: '2024 EKYS Çıkmış Sınavı',
            icon: '📜',
            desc: '2024 MEB Yönetici Seçme Sınavı soruları ve detaylı çözümleri.',
            filterKey: 'ekys_2024',
            badge: '80 Soru Hedef'
          },
          {
            id: 'ekys_2023',
            name: '2023 EKYS Çıkmış Sınavı',
            icon: '📜',
            desc: '2023 MEB Yönetici Seçme Sınavı soruları ve detaylı çözümleri.',
            filterKey: 'ekys_2023',
            badge: '80 Soru Hedef'
          },
          {
            id: 'ekys_2022',
            name: '2022 EKYS Çıkmış Sınavı',
            icon: '📜',
            desc: '2022 MEB Yönetici Seçme Sınavı soruları ve detaylı çözümleri.',
            filterKey: 'ekys_2022',
            badge: '80 Soru Hedef'
          },
          {
            id: 'ekys_2021',
            name: '2021 EKYS Çıkmış Sınavı',
            icon: '📜',
            desc: '2021 MEB Yönetici Seçme Sınavı soruları ve detaylı çözümleri.',
            filterKey: 'ekys_2021',
            badge: '80 Soru Hedef'
          },
          {
            id: 'ekys_2020',
            name: '2020 EKYS Çıkmış Sınavı',
            icon: '📜',
            desc: '2020 MEB Yönetici Seçme Sınavı soruları ve detaylı çözümleri.',
            filterKey: 'ekys_2020',
            badge: '80 Soru Hedef'
          },
          {
            id: 'ekys_2019',
            name: '2019 EKYS Çıkmış Sınavı',
            icon: '📜',
            desc: 'İlk uygulanan 2019 MEB Yönetici Seçme Sınavı soruları ve çözümleri.',
            filterKey: 'ekys_2019',
            badge: '80 Soru Hedef'
          }
        ]
      }
    };
  }

  getQuestionsForFilter(filterKey) {
    const allQuestions = window.storageService.getQuestions();
    
    return allQuestions.filter(q => {
      const tId = (q.topicId || q.testId || '').toLowerCase();
      const tName = (q.topicName || q.testTitle || '').toLowerCase();
      const qNum = parseInt(q.questionNumber, 10) || 0;
      const qText = (q.questionText || '').toLowerCase();
      const isCikmis = tName.includes('sınav') || tName.includes('sinav') || tId.includes('ekys');

      if (filterKey.startsWith('ekys_')) {
        const year = filterKey.replace('ekys_', '');
        return tName.includes(year) || tId.includes(year) || (q.testId && q.testId.includes(year));
      }

      if (filterKey === 'cografya') {
        if (tId.includes('cogr') || tName.includes('coğrafya')) return true;
        if (isCikmis && qNum >= 7 && qNum <= 12) return true;
        if (qText.includes('coğrafya') || qText.includes('iklim') || qText.includes('harita') || qText.includes('erozyon') || qText.includes('jeomorfoloji')) return true;
        return false;
      }

      if (filterKey === 'tarih') {
        if (tId.includes('tarih') && !tId.includes('inkilap')) return true;
        if (isCikmis && qNum >= 1 && qNum <= 6) return true;
        if (qText.includes('osmanlı') || qText.includes('selçuklu') || qText.includes('göktürk') || qText.includes('türk-islam')) return true;
        return false;
      }

      if (filterKey === 'yurttaslik') {
        if (isCikmis && qNum >= 13 && qNum <= 14) return true;
        if (qText.includes('yurttaşlık') || qText.includes('normlar') || qText.includes('fiil ehliyeti')) return true;
        return false;
      }

      if (filterKey === 'guncel') {
        if (isCikmis && qNum >= 15 && qNum <= 16) return true;
        if (qText.includes('unesco') || qText.includes('nobel') || qText.includes('güncel')) return true;
        return false;
      }

      if (filterKey === 'inkilap') {
        if (isCikmis && qNum >= 17 && qNum <= 28) return true;
        if (qText.includes('atatürk') || qText.includes('nutuk') || qText.includes('lozan') || qText.includes('amasya') || qText.includes('erzurum') || qText.includes('sivas') || qText.includes('cumhuriyetçilik') || qText.includes('laiklik')) return true;
        return false;
      }

      if (filterKey === 'egitim') {
        if (isCikmis && qNum >= 29 && qNum <= 40) return true;
        if (qText.includes('eğitim') || qText.includes('denetim') || qText.includes('liderlik') || qText.includes('ölçme') || qText.includes('öğrenme')) return true;
        return false;
      }

      if (filterKey === 'maarif') {
        if (isCikmis && qNum >= 41 && qNum <= 64) return true;
        if (qText.includes('maarif') || qText.includes('erdem') || qText.includes('beceri') || qText.includes('eylem')) return true;
        return false;
      }

      if (filterKey === 'mevzuat_anayasa') {
        return (isCikmis && (qNum === 65 || qNum === 66)) || qText.includes('anayasa') || qText.includes('1982');
      }
      if (filterKey === 'mevzuat_657') {
        return (isCikmis && (qNum === 67 || qNum === 68)) || qText.includes('657');
      }
      if (filterKey === 'mevzuat_1739') {
        return (isCikmis && (qNum === 69 || qNum === 70)) || qText.includes('1739');
      }
      if (filterKey === 'mevzuat_222') {
        return (isCikmis && (qNum === 71 || qNum === 72)) || qText.includes('222');
      }
      if (filterKey === 'mevzuat_5018') {
        return (isCikmis && qNum === 73) || qText.includes('5018');
      }
      if (filterKey === 'mevzuat_4483') {
        return (isCikmis && qNum === 74) || qText.includes('4483');
      }
      if (filterKey === 'mevzuat_4688') {
        return (isCikmis && qNum === 75) || qText.includes('4688');
      }
      if (filterKey === 'mevzuat_5442') {
        return (isCikmis && qNum === 76) || qText.includes('5442');
      }
      if (filterKey === 'mevzuat_3071') {
        return (isCikmis && qNum === 77) || qText.includes('3071');
      }
      if (filterKey === 'mevzuat_1cbk') {
        return (isCikmis && (qNum === 78 || qNum === 79 || qNum === 80)) || qText.includes('kararname') || qText.includes('cbk');
      }
      if (filterKey === 'mevzuat') {
        if (isCikmis && qNum >= 65 && qNum <= 80) return true;
        if (qText.includes('kanun') || qText.includes('mevzuat') || qText.includes('yönetmelik')) return true;
        return false;
      }

      return true;
    });
  }

  openSubTopicModal(categoryKey) {
    const dataMap = this.getSubTopicData();
    const data = dataMap[categoryKey];
    if (!data) return;

    const modalTitleEl = document.getElementById('subtopic-modal-title');
    const modalDescEl = document.getElementById('subtopic-modal-desc');
    const modalGridEl = document.getElementById('subtopic-modal-cards-grid');

    if (modalTitleEl) modalTitleEl.innerHTML = `<span>📚</span> ${data.title}`;
    if (modalDescEl) modalDescEl.textContent = data.desc;

    if (modalGridEl) {
      modalGridEl.innerHTML = data.items.map(item => {
        const questions = this.getQuestionsForFilter(item.filterKey);
        const qCount = questions.length;

        return `
          <div class="card" style="border: 1px solid var(--border-active); background: rgba(30, 41, 59, 0.85); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <span style="font-size: 30px;">${item.icon}</span>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <span class="badge badge-info" style="font-size: 0.72rem; font-weight: 700;">
                    ${qCount > 0 ? qCount + ' Soru Mevcut' : 'Test Hazır'}
                  </span>
                  <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc; font-size: 0.72rem;">
                    ${item.badge}
                  </span>
                </div>
              </div>
              <h3 style="font-size: 1.08rem; font-weight: 700; margin-bottom: 6px; color: #ffffff;">${item.name}</h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 16px;">
                ${item.desc}
              </p>
            </div>
            <div style="display: flex; gap: 6px; margin-top: auto; flex-wrap: wrap;">
              <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="app.startSubTopicQuiz('${item.filterKey}', '${item.name}', 'practice')">
                🎯 Pratik
              </button>
              <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="app.startSubTopicQuiz('${item.filterKey}', '${item.name}', 'exam')">
                ⏱️ Sınav
              </button>
              <button class="btn btn-sm" style="background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); color: #c7d2fe;" onclick="app.openAddQuestionModal('${item.filterKey}', '${item.name}')" title="Bu Sınava / Konuya Yeni Soru Ekle">
                ➕ Soru Ekle
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    const modal = document.getElementById('subtopic-modal');
    if (modal) modal.style.display = 'flex';
  }

  closeSubTopicModal(event) {
    if (event && event.target && event.target.id !== 'subtopic-modal' && !event.target.classList.contains('modal-close')) {
      return;
    }
    const modal = document.getElementById('subtopic-modal');
    if (modal) modal.style.display = 'none';
  }

  // --- HIZLI SORU EKLEME YÖNETİCİSİ ---
  openAddQuestionModal(filterKey = 'ekys_2026', targetName = '2026 EKYS Çıkmış Sınavı') {
    const modal = document.getElementById('modal-add-single-question');
    if (!modal) return;

    document.getElementById('add-q-filter-key').value = filterKey || 'ekys_2026';
    document.getElementById('add-q-target-name').value = targetName || '2026 EKYS Çıkmış Sınavı';
    document.getElementById('add-q-header-title').value = targetName || '2026 EKYS Çıkmış Sınavı';
    document.getElementById('add-q-target-title').textContent = `${targetName || 'Sınava'} Yeni Soru Ekle`;
    
    // Soru numarasını hesapla
    const questions = this.getQuestionsForFilter(filterKey);
    document.getElementById('add-q-num').value = questions.length + 1;
    document.getElementById('add-q-text').value = '';
    document.getElementById('add-q-opt-a').value = '';
    document.getElementById('add-q-opt-b').value = '';
    document.getElementById('add-q-opt-c').value = '';
    document.getElementById('add-q-opt-d').value = '';
    document.getElementById('add-q-opt-e').value = '';
    document.getElementById('add-q-correct').value = 'A';
    document.getElementById('add-q-explanation').value = '';
    document.getElementById('add-q-image-file').value = '';
    document.getElementById('add-q-image-base64').value = '';
    document.getElementById('add-q-img-preview-box').style.display = 'none';

    modal.style.display = 'flex';
  }

  closeAddQuestionModal(event) {
    if (event && event.target && event.target.id !== 'modal-add-single-question' && !event.target.classList.contains('modal-close')) {
      return;
    }
    const modal = document.getElementById('modal-add-single-question');
    if (modal) modal.style.display = 'none';
  }

  handleQuestionImagePreview(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('add-q-image-base64').value = e.target.result;
      document.getElementById('add-q-img-preview').src = e.target.result;
      document.getElementById('add-q-img-preview-box').style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  handleSaveCustomQuestion(event) {
    event.preventDefault();

    const filterKey = document.getElementById('add-q-filter-key').value;
    const title = document.getElementById('add-q-header-title').value.trim();
    const qNum = parseInt(document.getElementById('add-q-num').value, 10) || 1;
    const qText = document.getElementById('add-q-text').value.trim();
    const optA = document.getElementById('add-q-opt-a').value.trim();
    const optB = document.getElementById('add-q-opt-b').value.trim();
    const optC = document.getElementById('add-q-opt-c').value.trim();
    const optD = document.getElementById('add-q-opt-d').value.trim();
    const optE = document.getElementById('add-q-opt-e').value.trim();
    const correct = document.getElementById('add-q-correct').value;
    const explanation = document.getElementById('add-q-explanation').value.trim();
    const imageBase64 = document.getElementById('add-q-image-base64').value;

    if (!qText || !optA || !optB || !optC || !optD || !optE) {
      this.showToast('Lütfen soru metnini ve tüm şıkları doldurunuz.', 'error');
      return;
    }

    const newQuestion = {
      id: `${filterKey}_q${Date.now()}`,
      testId: filterKey,
      testTitle: title,
      topicId: filterKey,
      topicName: title,
      category: 'Çıkmış Sınavlar',
      questionNumber: qNum,
      questionText: qText,
      hasImage: !!imageBase64,
      image: imageBase64 || null,
      options: [
        { key: 'A', text: optA },
        { key: 'B', text: optB },
        { key: 'C', text: optC },
        { key: 'D', text: optD },
        { key: 'E', text: optE }
      ],
      correctAnswer: correct,
      explanation: explanation || `Doğru Cevap: ${correct}`
    };

    window.storageService.addQuestion(newQuestion);

    // Eğer Firebase bağlıysa senkronize et
    if (window.firebaseService && firebaseService.isLoggedIn && firebaseService.currentUser) {
      firebaseService.addQuestion(newQuestion).catch(err => console.log('Firestore sync:', err));
    }

    this.showToast(`✅ Soru #${qNum} başarıyla "${title}" sınavına eklendi!`, 'success');
    this.closeAddQuestionModal();

    // Alt konu modalı açıksa sayıları güncelle
    const subtopicModal = document.getElementById('subtopic-modal');
    if (subtopicModal && subtopicModal.style.display !== 'none') {
      const activeCat = filterKey.startsWith('ekys_') ? 'cikmis' : 'genel-kultur';
      this.openSubTopicModal(activeCat);
    }
  }

  startSubTopicQuiz(filterKey, title, mode = 'practice') {
    const modal = document.getElementById('subtopic-modal');
    if (modal) modal.style.display = 'none';

    let questions = this.getQuestionsForFilter(filterKey);
    if (questions.length === 0) {
      // Eğer spesifik filtrede az soru varsa ana kategoriyi al
      const allQuestions = window.storageService.getQuestions();
      questions = allQuestions.slice(0, 20);
    }

    this.activeQuiz = {
      title: `${title} (${mode === 'exam' ? 'Süreli Sınav' : 'Öğrenme Modu'})`,
      topicId: `subtopic_${filterKey}`,
      mode: mode,
      questions: this.shuffleArray([...questions]),
      currentIndex: 0,
      userAnswers: {},
      struckOptions: {},
      starred: {},
      isFinished: false,
      startTime: Date.now(),
      durationSeconds: mode === 'exam' ? questions.length * 90 : 0,
      elapsedSeconds: 0
    };

    this.navigateTo('quiz-active');
    this.startQuizTimer();
    this.renderCurrentQuestion();
    this.showToast(`${title} başlatıldı (${questions.length} Soru)`, 'success');
  }

  renderTestHub() {
    const grid = document.getElementById('topics-grid');
    if (!grid) return;

    const topics = window.storageService.getTopics();
    const allQuestions = window.storageService.getQuestions();

    let filtered = topics;
    if (this.currentCategoryFilter !== 'all') {
      filtered = topics.filter(t => t.category && t.category.toLowerCase().includes(this.currentCategoryFilter.toLowerCase()));
    }

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="card" style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">Bu kategoride henüz test bulunmuyor.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(t => {
      const qCount = allQuestions.filter(q => q.topicId === t.id).length;
      return `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
            <span style="font-size: 28px;">${t.icon || '📚'}</span>
            <span class="badge" style="background: rgba(99, 102, 241, 0.18); color: #a5b4fc; padding: 3px 8px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">
              ${qCount} Soru
            </span>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 4px;">${t.name}</h3>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 16px;">${t.category || 'Mevzuat'}</p>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-primary btn-sm btn-block" onclick="app.startTopicQuiz('${t.id}', 'practice')">
              🎯 Pratik Çöz
            </button>
            <button class="btn btn-secondary btn-sm btn-block" onclick="app.startTopicQuiz('${t.id}', 'exam')">
              ⏱️ Süreli Sınav
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- QUIZ MOTORU (SORU ÇÖZÜCÜ) ---
  startTopicQuiz(topicId, mode = 'practice') {
    const allQuestions = window.storageService.getQuestions();
    const topicQuestions = allQuestions.filter(q => q.topicId === topicId);

    if (topicQuestions.length === 0) {
      this.showToast('Bu konuda henüz soru bulunmuyor.', 'error');
      return;
    }

    const topics = window.storageService.getTopics();
    const topic = topics.find(t => t.id === topicId) || { name: 'Test' };

    this.activeQuiz = {
      title: `${topic.name} (${mode === 'exam' ? 'Süreli Sınav' : 'Öğrenme Modu'})`,
      topicId: topicId,
      mode: mode, // 'practice' (anında doğru/yanlış) veya 'exam' (sonuç sonda)
      questions: this.shuffleArray([...topicQuestions]),
      currentIndex: 0,
      userAnswers: {},
      struckOptions: {}, // Şık eleme durumları: { qIndex: { 'A': true } }
      starred: {},
      isFinished: false,
      startTime: Date.now(),
      elapsedSeconds: 0
    };

    this.navigateTo('quiz-active');
    this.startQuizTimer();
    this.renderCurrentQuestion();
  }

  startFullExamMock(count = 80, durationMins = 150) {
    const allQuestions = window.storageService.getQuestions();
    if (allQuestions.length === 0) {
      this.showToast('Soru havuzu boş.', 'error');
      return;
    }

    const selected = this.shuffleArray([...allQuestions]).slice(0, count);

    this.activeQuiz = {
      title: `🏆 EKYS Genel Deneme Sınavı (${selected.length} Soru)`,
      topicId: 'all-mock',
      mode: 'exam',
      questions: selected,
      currentIndex: 0,
      userAnswers: {},
      struckOptions: {},
      starred: {},
      isFinished: false,
      startTime: Date.now(),
      durationSeconds: durationMins * 60,
      elapsedSeconds: 0
    };

    this.navigateTo('quiz-active');
    this.startQuizTimer();
    this.renderCurrentQuestion();
  }

  startQuickQuiz(count = 10) {
    const allQuestions = window.storageService.getQuestions();
    if (allQuestions.length === 0) {
      this.showToast('Soru havuzu boş.', 'error');
      return;
    }

    const selected = this.shuffleArray([...allQuestions]).slice(0, count);

    this.activeQuiz = {
      title: `⚡ Hızlı ${selected.length} Soru Pratiği`,
      topicId: 'quick',
      mode: 'practice',
      questions: selected,
      currentIndex: 0,
      userAnswers: {},
      struckOptions: {},
      starred: {},
      isFinished: false,
      startTime: Date.now(),
      elapsedSeconds: 0
    };

    this.navigateTo('quiz-active');
    this.startQuizTimer();
    this.renderCurrentQuestion();
  }

  startWrongPoolQuiz() {
    const wrongPool = window.storageService.getWrongPool();
    if (wrongPool.length === 0) {
      this.showToast('Yanlış defterinizde soru bulunmuyor! Harika gidiyorsunuz! 🎉', 'success');
      return;
    }

    this.activeQuiz = {
      title: `🔁 Yanlış Defteri Tekrarı (${wrongPool.length} Soru)`,
      topicId: 'wrong-pool',
      mode: 'practice',
      questions: this.shuffleArray([...wrongPool]),
      currentIndex: 0,
      userAnswers: {},
      struckOptions: {},
      starred: {},
      isFinished: false,
      startTime: Date.now(),
      elapsedSeconds: 0
    };

    this.navigateTo('quiz-active');
    this.startQuizTimer();
    this.renderCurrentQuestion();
  }

  startFavoritesQuiz() {
    const favs = window.storageService.getFavorites();
    if (favs.length === 0) {
      this.showToast('Yıldızlı soru bulunmuyor. Soru çözerken ⭐ simgesine basarak ekleyebilirsiniz.', 'info');
      return;
    }

    this.activeQuiz = {
      title: `⭐ Yıldızlı Sorular Testi (${favs.length} Soru)`,
      topicId: 'favorites',
      mode: 'practice',
      questions: [...favs],
      currentIndex: 0,
      userAnswers: {},
      struckOptions: {},
      starred: {},
      isFinished: false,
      startTime: Date.now(),
      elapsedSeconds: 0
    };

    this.navigateTo('quiz-active');
    this.startQuizTimer();
    this.renderCurrentQuestion();
  }

  startQuizTimer() {
    this.stopQuizTimer();
    const timerEl = document.getElementById('quiz-timer-display');
    this.timerInterval = setInterval(() => {
      if (!this.activeQuiz || this.activeQuiz.isFinished) {
        this.stopQuizTimer();
        return;
      }
      this.activeQuiz.elapsedSeconds++;
      const mins = Math.floor(this.activeQuiz.elapsedSeconds / 60);
      const secs = this.activeQuiz.elapsedSeconds % 60;
      if (timerEl) {
        timerEl.textContent = `⏱️ ${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
      }
    }, 1000);
  }

  stopQuizTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  renderCurrentQuestion() {
    if (!this.activeQuiz) return;

    const q = this.activeQuiz.questions[this.activeQuiz.currentIndex];
    const totalQ = this.activeQuiz.questions.length;
    const curIdx = this.activeQuiz.currentIndex;

    // Başlıklar
    const titleEl = document.getElementById('quiz-active-title');
    const progressEl = document.getElementById('quiz-progress-text');
    const topicEl = document.getElementById('quiz-q-topic');
    const modeEl = document.getElementById('quiz-q-mode');
    const starBtn = document.getElementById('btn-quiz-star');

    if (titleEl) titleEl.textContent = this.activeQuiz.title;
    if (progressEl) progressEl.textContent = `Soru ${curIdx + 1} / ${totalQ}`;
    if (topicEl) topicEl.textContent = q.topicName || q.category || 'Mevzuat';
    if (modeEl) modeEl.textContent = this.activeQuiz.mode === 'exam' ? '⏱️ Sınav Modu' : '🎯 Öğrenme Modu';

    // Yıldız durumu
    const isFav = window.storageService.isFavorite(q.id);
    if (starBtn) {
      starBtn.textContent = isFav ? '⭐' : '☆';
      starBtn.style.opacity = isFav ? '1' : '0.6';
    }

    // Görsel
    const imgBox = document.getElementById('quiz-image-box');
    const imgEl = document.getElementById('quiz-q-image');
    if (q.hasImage && q.image) {
      imgEl.src = q.image;
      imgBox.style.display = 'block';
    } else {
      imgBox.style.display = 'none';
    }

    // Soru Metni
    const textEl = document.getElementById('quiz-q-text');
    if (textEl) {
      textEl.innerHTML = (q.questionText || q.question || '').replace(/\n/g, '<br>');
    }

    // Şıklar
    const optionsList = document.getElementById('quiz-options-list');
    const userAnswer = this.activeQuiz.userAnswers[curIdx];
    const isAnswered = userAnswer !== undefined;
    const struck = (this.activeQuiz.struckOptions[curIdx]) || {};

    const options = q.options || [
      { key: 'A', text: 'A' },
      { key: 'B', text: 'B' },
      { key: 'C', text: 'C' },
      { key: 'D', text: 'D' },
      { key: 'E', text: 'E' }
    ];

    optionsList.innerHTML = options.map(opt => {
      const isSelected = userAnswer === opt.key;
      let statusClass = '';
      const isStruck = !!struck[opt.key];

      if (this.activeQuiz.mode === 'practice' && isAnswered) {
        if (opt.key === q.correctAnswer) {
          statusClass = 'correct';
        } else if (isSelected) {
          statusClass = 'wrong';
        }
      } else if (isSelected) {
        statusClass = 'selected';
      }

      if (isStruck) statusClass += ' struck-through';

      return `
        <div class="option-item ${statusClass}" onclick="app.handleOptionClick('${opt.key}')">
          <div class="option-key">${opt.key}</div>
          <div class="option-text">${opt.text}</div>
          <button class="option-strike-btn" onclick="event.stopPropagation(); app.toggleStrikeOption('${opt.key}')" title="Bu şıkkı ele (üstünü çiz)">
            ✏️
          </button>
        </div>
      `;
    }).join('');

    // Çözüm / Açıklama Kutusu
    const expBox = document.getElementById('quiz-explanation-box');
    const expText = document.getElementById('quiz-explanation-text');
    if (this.activeQuiz.mode === 'practice' && isAnswered) {
      expBox.style.display = 'block';
      expText.innerHTML = (q.explanation || `Doğru Cevap: <strong>${q.correctAnswer}</strong>`).replace(/\n/g, '<br>');
    } else {
      expBox.style.display = 'none';
    }

    // Gezinti Çizelgesi (Matrix)
    this.renderQuestionMatrix();

    // Buton durumları
    const prevBtn = document.getElementById('btn-quiz-prev');
    const nextBtn = document.getElementById('btn-quiz-next');
    if (prevBtn) prevBtn.disabled = (curIdx === 0);
    if (nextBtn) nextBtn.textContent = (curIdx === totalQ - 1) ? '🏁 Sınavı Bitir' : 'Sonraki Soru ➡️';
  }

  handleOptionClick(key) {
    if (!this.activeQuiz) return;
    const curIdx = this.activeQuiz.currentIndex;

    if (this.strikeMode) {
      this.toggleStrikeOption(key);
      return;
    }

    // Öğrenme modunda cevap verildikten sonra değiştirtme
    if (this.activeQuiz.mode === 'practice' && this.activeQuiz.userAnswers[curIdx] !== undefined) {
      return;
    }

    this.activeQuiz.userAnswers[curIdx] = key;
    const q = this.activeQuiz.questions[curIdx];

    // Yanlış havuza otomatik ekle/çıkar
    if (key !== q.correctAnswer) {
      window.storageService.addToWrongPool(q, key);
    } else {
      // Eğer doğru bildiyse yanlış havuzundan kaldırılabilir
      if (this.activeQuiz.topicId === 'wrong-pool') {
        window.storageService.removeFromWrongPool(q.id);
      }
    }

    this.renderCurrentQuestion();
  }

  toggleStrikeOption(key) {
    if (!this.activeQuiz) return;
    const curIdx = this.activeQuiz.currentIndex;
    if (!this.activeQuiz.struckOptions[curIdx]) {
      this.activeQuiz.struckOptions[curIdx] = {};
    }
    this.activeQuiz.struckOptions[curIdx][key] = !this.activeQuiz.struckOptions[curIdx][key];
    this.renderCurrentQuestion();
  }

  toggleStrikeMode() {
    this.strikeMode = !this.strikeMode;
    const txt = document.getElementById('strike-status-text');
    if (txt) txt.textContent = this.strikeMode ? 'Açık (Tıkla Ele)' : 'Kapalı';
  }

  toggleCurrentQuestionStar() {
    if (!this.activeQuiz) return;
    const q = this.activeQuiz.questions[this.activeQuiz.currentIndex];
    const isFav = window.storageService.toggleFavorite(q);
    const starBtn = document.getElementById('btn-quiz-star');
    if (starBtn) {
      starBtn.textContent = isFav ? '⭐' : '☆';
      starBtn.style.opacity = isFav ? '1' : '0.6';
    }
    this.showToast(isFav ? 'Soru yıldızlılara eklendi ⭐' : 'Yıldızlılardan çıkarıldı', 'info');
  }

  renderQuestionMatrix() {
    const grid = document.getElementById('quiz-matrix-grid');
    if (!grid || !this.activeQuiz) return;

    grid.innerHTML = this.activeQuiz.questions.map((q, idx) => {
      const isCurrent = (idx === this.activeQuiz.currentIndex);
      const isAns = (this.activeQuiz.userAnswers[idx] !== undefined);
      let cls = 'matrix-btn';

      if (isCurrent) cls += ' current';
      if (isAns) {
        if (this.activeQuiz.mode === 'practice') {
          cls += (this.activeQuiz.userAnswers[idx] === q.correctAnswer) ? ' correct-ans' : ' wrong-ans';
        } else {
          cls += ' answered';
        }
      }

      return `<button class="${cls}" onclick="app.jumpToQuestion(${idx})">${idx + 1}</button>`;
    }).join('');
  }

  jumpToQuestion(idx) {
    if (!this.activeQuiz) return;
    this.activeQuiz.currentIndex = idx;
    this.renderCurrentQuestion();
  }

  prevQuestion() {
    if (!this.activeQuiz || this.activeQuiz.currentIndex <= 0) return;
    this.activeQuiz.currentIndex--;
    this.renderCurrentQuestion();
  }

  nextQuestion() {
    if (!this.activeQuiz) return;
    if (this.activeQuiz.currentIndex >= this.activeQuiz.questions.length - 1) {
      this.finishQuiz();
      return;
    }
    this.activeQuiz.currentIndex++;
    this.renderCurrentQuestion();
  }

  exitQuiz() {
    if (confirm('Sınavdan çıkmak istediğinize emin misiniz?')) {
      this.stopQuizTimer();
      this.activeQuiz = null;
      this.navigateTo('test-hub');
    }
  }

  finishQuiz() {
    if (!this.activeQuiz) return;
    this.stopQuizTimer();
    this.activeQuiz.isFinished = true;

    let correct = 0;
    let wrong = 0;
    let empty = 0;

    this.activeQuiz.questions.forEach((q, idx) => {
      const ans = this.activeQuiz.userAnswers[idx];
      if (ans === undefined) {
        empty++;
      } else if (ans === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const net = Math.max(0, correct - (wrong * 0.25));
    const total = this.activeQuiz.questions.length;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Kaydet
    window.storageService.saveQuizResult({
      title: this.activeQuiz.title,
      totalQuestions: total,
      correctCount: correct,
      wrongCount: wrong,
      emptyCount: empty,
      netScore: net,
      durationSeconds: this.activeQuiz.elapsedSeconds,
      topicId: this.activeQuiz.topicId
    });

    // Sonuç Ekranını Doldur
    const elCorrect = document.getElementById('res-correct');
    const elWrong = document.getElementById('res-wrong');
    const elEmpty = document.getElementById('res-empty');
    const elNet = document.getElementById('res-net');
    const elPercent = document.getElementById('res-percent');
    const elWrongBtn = document.getElementById('btn-result-wrong-pool');

    if (elCorrect) elCorrect.textContent = correct;
    if (elWrong) elWrong.textContent = wrong;
    if (elEmpty) elEmpty.textContent = empty;
    if (elNet) elNet.textContent = net.toFixed(2);
    if (elPercent) elPercent.textContent = `%${percent}`;

    if (elWrongBtn) {
      elWrongBtn.style.display = wrong > 0 ? 'inline-flex' : 'none';
    }

    this.navigateTo('quiz-result');
  }

  retryCurrentQuiz() {
    if (this.activeQuiz) {
      this.startTopicQuiz(this.activeQuiz.topicId, this.activeQuiz.mode);
    } else {
      this.navigateTo('test-hub');
    }
  }

  // --- GÖRSEL BÜYÜTEÇ (ZOOM LIGHTBOX) ---
  openImageZoom() {
    if (!this.activeQuiz) return;
    const q = this.activeQuiz.questions[this.activeQuiz.currentIndex];
    if (!q || !q.image) return;

    const modal = document.getElementById('image-zoom-modal');
    const img = document.getElementById('zoom-modal-img');
    if (modal && img) {
      img.src = q.image;
      modal.classList.add('active');
    }
  }

  closeImageZoom() {
    const modal = document.getElementById('image-zoom-modal');
    if (modal) modal.classList.remove('active');
  }

  // --- YANLIŞ DEFTERİ (WRONG POOL) ---
  renderWrongPoolList() {
    const listEl = document.getElementById('wrong-pool-list');
    if (!listEl) return;

    const pool = window.storageService.getWrongPool();
    if (pool.length === 0) {
      listEl.innerHTML = `
        <div class="card" style="text-align: center; color: var(--text-secondary); padding: 30px;">
          🎉 Harika! Yanlış havuzunuzda hiç soru yok.
        </div>
      `;
      return;
    }

    listEl.innerHTML = `
      <div class="grid-cards">
        ${pool.map(q => `
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">❌ ${q.wrongCount || 1} Kez Yanlış</span>
              <button class="btn btn-secondary btn-sm" onclick="app.removeWrongItem('${q.id}')">Sil</button>
            </div>
            ${q.hasImage ? `<img src="${q.image}" style="max-width: 100%; max-height: 120px; object-fit: contain; margin-bottom: 8px; border-radius: 6px;">` : ''}
            <div style="font-size: 0.9rem; font-weight: 600; margin-bottom: 8px;">${q.questionText || q.question}</div>
            <div style="font-size: 0.8rem; color: #34d399;">Doğru Cevap: ${q.correctAnswer}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  removeWrongItem(id) {
    window.storageService.removeFromWrongPool(id);
    this.renderWrongPoolList();
    this.renderDashboard();
    this.showToast('Soru yanlış havuzundan kaldırıldı.', 'info');
  }

  clearWrongPool() {
    if (confirm('Tüm yanlış havuzunu sıfırlamak istediğinize emin misiniz?')) {
      localStorage.setItem(window.storageService.KEYS.WRONG_POOL, JSON.stringify([]));
      this.renderWrongPoolList();
      this.renderDashboard();
      this.showToast('Yanlış havuzu temizlendi.', 'success');
    }
  }

  // --- YILDIZLI SORULAR (FAVORITES) ---
  renderFavoritesList() {
    const listEl = document.getElementById('favorites-list');
    if (!listEl) return;

    const favs = window.storageService.getFavorites();
    if (favs.length === 0) {
      listEl.innerHTML = `
        <div class="card" style="text-align: center; color: var(--text-secondary); padding: 30px;">
          Henüz yıldızlı soru eklemediniz. Soru çözerken ⭐ simgesine basarak ekleyebilirsiniz.
        </div>
      `;
      return;
    }

    listEl.innerHTML = `
      <div class="grid-cards">
        ${favs.map(q => `
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">⭐ Yıldızlı</span>
              <button class="btn btn-secondary btn-sm" onclick="app.removeFavoriteItem('${q.id}')">Kaldır</button>
            </div>
            ${q.hasImage ? `<img src="${q.image}" style="max-width: 100%; max-height: 120px; object-fit: contain; margin-bottom: 8px; border-radius: 6px;">` : ''}
            <div style="font-size: 0.9rem; font-weight: 600; margin-bottom: 8px;">${q.questionText || q.question}</div>
            <div style="font-size: 0.8rem; color: #34d399;">Doğru Cevap: ${q.correctAnswer}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  removeFavoriteItem(id) {
    const q = { id: id };
    window.storageService.toggleFavorite(q);
    this.renderFavoritesList();
    this.renderDashboard();
  }

  // --- BAŞARI ANALİZİ (STATS) ---
  renderStatsView() {
    const history = window.storageService.getQuizHistory();
    const topics = window.storageService.getTopics();

    // Konu bazlı netler
    const topicStats = {};
    history.forEach(h => {
      if (!topicStats[h.topicId]) {
        topicStats[h.topicId] = { correct: 0, wrong: 0, total: 0, name: h.title };
      }
      topicStats[h.topicId].correct += h.correctCount;
      topicStats[h.topicId].wrong += h.wrongCount;
      topicStats[h.topicId].total += h.totalQuestions;
    });

    const barsEl = document.getElementById('stats-topic-bars');
    if (barsEl) {
      if (Object.keys(topicStats).length === 0) {
        barsEl.innerHTML = '<div style="color: var(--text-secondary); font-size: 0.88rem;">Henüz çözülen test verisi yok.</div>';
      } else {
        barsEl.innerHTML = Object.values(topicStats).slice(0, 6).map(s => {
          const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
          return `
            <div style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">
                <span>${s.name}</span>
                <span>%${pct} (${s.correct}/${s.total})</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${pct}%;"></div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Geçmiş tablosu
    const tableEl = document.getElementById('stats-history-table');
    if (tableEl) {
      if (history.length === 0) {
        tableEl.innerHTML = '<div style="color: var(--text-secondary); font-size: 0.88rem;">Henüz test kaydı yok.</div>';
      } else {
        tableEl.innerHTML = `
          <table class="admin-table">
            <thead>
              <tr>
                <th>Test Adı</th>
                <th>Tarih</th>
                <th>Doğru</th>
                <th>Yanlış</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              ${history.slice(0, 10).map(h => `
                <tr>
                  <td><strong>${h.title}</strong></td>
                  <td>${new Date(h.date).toLocaleDateString('tr-TR')}</td>
                  <td style="color: #34d399; font-weight: 700;">${h.correctCount}</td>
                  <td style="color: #f87171; font-weight: 700;">${h.wrongCount}</td>
                  <td style="color: #818cf8; font-weight: 800;">${parseFloat(h.netScore).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }
    }
  }

  // --- KARŞILAMA GİRİŞ EKRANI (AUTH GATE) METODLARI ---
  switchGateTab(tab) {
    const loginForm = document.getElementById('gate-form-login');
    const regForm = document.getElementById('gate-form-register');
    const tabLogin = document.getElementById('gate-tab-login');
    const tabReg = document.getElementById('gate-tab-register');

    if (tab === 'login') {
      if (loginForm) loginForm.style.display = 'block';
      if (regForm) regForm.style.display = 'none';
      if (tabLogin) { tabLogin.classList.remove('btn-secondary'); tabLogin.classList.add('btn-primary'); }
      if (tabReg) { tabReg.classList.remove('btn-primary'); tabReg.classList.add('btn-secondary'); }
    } else {
      if (loginForm) loginForm.style.display = 'none';
      if (regForm) regForm.style.display = 'block';
      if (tabReg) { tabReg.classList.remove('btn-secondary'); tabReg.classList.add('btn-primary'); }
      if (tabLogin) { tabLogin.classList.remove('btn-primary'); tabLogin.classList.add('btn-secondary'); }
    }
  }

  async handleGateLogin(e) {
    if (e) e.preventDefault();
    const usernameInput = document.getElementById('gate-login-username') || document.getElementById('gate-login-email');
    const username = usernameInput ? usernameInput.value.trim() : '';
    const passInput = document.getElementById('gate-login-password');
    const pass = passInput ? passInput.value : '';

    try {
      if (window.firebaseService) {
        await window.firebaseService.loginWithEmail(username, pass);
      }

      // Giriş ekranını gizle ve ana paneli aç
      const authGateEl = document.getElementById('auth-gate-container');
      const mainAppEl = document.getElementById('main-app-container');
      if (authGateEl) authGateEl.style.display = 'none';
      if (mainAppEl) mainAppEl.style.display = 'flex';

      this.showToast(`Giriş başarılı! Hoş geldiniz.`, 'success');
      this.renderDashboard();
    } catch (err) {
      this.showToast(`Giriş başarısız: ${err.message}`, 'error');
    }
  }

  showAuthGate() {
    const authGateEl = document.getElementById('auth-gate-container');
    const mainAppEl = document.getElementById('main-app-container');
    if (authGateEl) authGateEl.style.display = 'flex';
    if (mainAppEl) mainAppEl.style.display = 'none';
  }

  async handleGateRegister(e) {
    e.preventDefault();
    const name = document.getElementById('gate-reg-name').value.trim();
    const email = document.getElementById('gate-reg-email').value.trim();
    const pass = document.getElementById('gate-reg-password').value;

    try {
      await window.firebaseService.registerWithEmail(email, pass, name, 'student');
      this.showToast(`Hesabınız oluşturuldu! Hoş geldiniz ${name}!`, 'success');
      this.renderDashboard();
    } catch (err) {
      this.showToast(`Kayıt hatası: ${err.message}`, 'error');
    }
  }

  // --- KULLANICI GİRİŞ & YÖNETİCİ PANELİ ---
  openAuthModal(tab = 'login') {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('active');
    this.switchAuthTab(tab);
  }

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
  }

  switchAuthTab(tab) {
    const loginForm = document.getElementById('form-login');
    const regForm = document.getElementById('form-register');
    const tabLogin = document.getElementById('tab-auth-login');
    const tabReg = document.getElementById('tab-auth-register');
    const title = document.getElementById('auth-modal-title');

    if (tab === 'login') {
      loginForm.style.display = 'block';
      regForm.style.display = 'none';
      tabLogin.classList.remove('btn-secondary');
      tabLogin.classList.add('btn-primary');
      tabReg.classList.remove('btn-primary');
      tabReg.classList.add('btn-secondary');
      title.textContent = '🔑 Giriş Yap';
    } else {
      loginForm.style.display = 'none';
      regForm.style.display = 'block';
      tabReg.classList.remove('btn-secondary');
      tabReg.classList.add('btn-primary');
      tabLogin.classList.remove('btn-primary');
      tabLogin.classList.add('btn-secondary');
      title.textContent = '➕ Yeni Hesap Oluştur';
    }
  }

  async handleEmailLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;

    try {
      await window.firebaseService.loginWithEmail(email, pass);
      this.closeAuthModal();
      this.showToast(`Hoş geldiniz, ${email}!`, 'success');
      this.renderDashboard();
    } catch (err) {
      this.showToast(`Giriş başarısız: ${err.message}`, 'error');
    }
  }

  async handleEmailRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-password').value;

    try {
      await window.firebaseService.registerWithEmail(email, pass, name, 'student');
      this.closeAuthModal();
      this.showToast(`Hesabınız oluşturuldu! Hoş geldiniz ${name}!`, 'success');
      this.renderDashboard();
    } catch (err) {
      this.showToast(`Kayıt hatası: ${err.message}`, 'error');
    }
  }

  async handleGoogleLogin() {
    try {
      await window.firebaseService.loginWithGoogle();
      this.closeAuthModal();
      this.showToast('Google ile giriş başarılı!', 'success');
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  async loadAdminUsersList() {
    const container = document.getElementById('admin-users-table-container');
    if (!container) return;

    container.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-secondary);">Kullanıcılar getiriliyor...</div>';

    try {
      // Hem Firestore'dan hem Yerel Tanımlı Kullanıcılardan birleştir
      const fbUsers = (window.firebaseService && typeof window.firebaseService.getAllUsers === 'function') 
        ? await window.firebaseService.getAllUsers() 
        : [];
      const customUsers = (window.storageService && typeof window.storageService.getCustomUsers === 'function') 
        ? window.storageService.getCustomUsers() 
        : [];

      const userMap = new Map();

      // 1. Master Admin (Ana Hesap)
      userMap.set('admin', {
        id: 'admin',
        username: 'admin',
        displayName: 'Gökhan Eker (Ana Yönetici)',
        role: 'admin',
        password: '•••••••• (Özel)',
        createdAt: new Date().toISOString()
      });

      // 2. Yerel Eklenen Kullanıcılar
      if (Array.isArray(customUsers)) {
        customUsers.forEach(u => {
          if (!u) return;
          const raw = u.username || u.email || u.name || '';
          const key = String(raw).trim().toLowerCase();
          if (key && key !== 'admin') {
            userMap.set(key, { ...u, id: key, username: key, password: u.password || '••••••' });
          }
        });
      }

      // 3. Buluttaki Kullanıcılar
      if (Array.isArray(fbUsers)) {
        fbUsers.forEach(u => {
          if (!u) return;
          const raw = u.username || u.email || u.name || '';
          const key = String(raw).trim().toLowerCase();
          if (key && key !== 'admin') {
            const existing = userMap.get(key) || {};
            userMap.set(key, { ...existing, ...u, id: key, username: key, password: u.password || existing.password || '••••••' });
          }
        });
      }

      const allUsers = Array.from(userMap.values());

      container.innerHTML = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Kullanıcı Adı</th>
              <th>Giriş Şifresi</th>
              <th>Yetki Rolü</th>
              <th>Kayıt Tarihi</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            ${allUsers.map(u => `
              <tr>
                <td><strong style="color: #a5b4fc; font-size: 0.95rem;">👤 ${u.username || u.name}</strong></td>
                <td><code style="font-family: monospace; font-size: 0.9rem; color: #34d399; background: rgba(52, 211, 153, 0.1); padding: 3px 8px; border-radius: 4px;">${u.password || '••••••'}</code></td>
                <td>
                  <span class="badge ${u.role === 'admin' ? 'badge-warning' : 'badge-info'}" style="padding: 2px 8px; font-size: 0.75rem;">
                    ${u.role === 'admin' ? '👑 Yönetici' : '🎓 Öğrenci'}
                  </span>
                </td>
                <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString('tr-TR') : 'Aktif'}</td>
                <td>
                  ${(u.username === 'admin' || u.username === 'gokhan') ? '<span style="color: var(--text-secondary); font-size: 0.8rem;">(Ana Yönetici)</span>' : `
                    <button class="btn btn-danger btn-sm" onclick="app.handleAdminDeleteUser('${u.username || u.id}', '${u.username || u.displayName || u.id}')">
                      🗑️ Çıkar / Sil
                    </button>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (err) {
      container.innerHTML = `<div style="color: #ef4444;">Kullanıcı listesi alınamadı: ${err.message}</div>`;
    }
  }

  async handleAdminCreateUser(e) {
    e.preventDefault();
    const usernameInput = document.getElementById('admin-user-username');
    const username = usernameInput ? usernameInput.value.trim().toLowerCase() : '';
    const passInput = document.getElementById('admin-user-password');
    const pass = passInput ? passInput.value : '';

    if (!username || !pass) {
      this.showToast('Lütfen kullanıcı adı ve şifre giriniz.', 'error');
      return;
    }

    try {
      // 1. Yerel veritabanına yetkili kullanıcı adı ve şifreyle kaydet
      if (window.storageService) {
        window.storageService.saveCustomUser({
          name: username,
          username: username,
          password: pass,
          role: 'student'
        });
      }

      // 2. Firebase Bulut veritabanına kaydet
      if (window.firebaseService) {
        try {
          const fakeEmail = username.includes('@') ? username : `${username}@ekysrota.local`;
          await window.firebaseService.registerWithEmail(fakeEmail, pass, username, 'student');
        } catch (fbErr) {
          console.warn('Firebase bulut kayıt:', fbErr);
        }
      }

      this.showToast(`✅ "${username}" kullanıcısı başarıyla eklendi! (Şifre: ${pass})`, 'success');
      document.getElementById('admin-add-user-form').reset();
      this.loadAdminUsersList();
    } catch (err) {
      this.showToast(`Kullanıcı oluşturma hatası: ${err.message}`, 'error');
    }
  }

  async handleAdminDeleteUser(username, name) {
    if (confirm(`"${username}" kullanıcısını sistemden tamamen çıkarmak istediğinize emin misiniz? Artık sisteme giriş yapamayacak.`)) {
      try {
        if (window.storageService) {
          window.storageService.removeCustomUser(username);
        }
        if (window.firebaseService) {
          try {
            await window.firebaseService.removeUser(username);
          } catch (e) {
            console.warn('Firebase silme:', e);
          }
        }
        this.showToast(`"${username}" sistemden çıkarıldı.`, 'success');
        this.loadAdminUsersList();
      } catch (err) {
        this.showToast(err.message, 'error');
      }
    }
  }

  // --- KONU & PDF YÖNETİCİSİ (MODAL) ---
  openTopicManagerModal() {
    const modal = document.getElementById('topic-manager-modal');
    if (modal) modal.classList.add('active');
    this.switchTopicModalTab('add-topic');
    this.populateTopicSelects();
  }

  closeTopicManagerModal() {
    const modal = document.getElementById('topic-manager-modal');
    if (modal) modal.classList.remove('active');
  }

  switchTopicModalTab(tab) {
    const contentAdd = document.getElementById('tab-content-add-topic');
    const contentPdf = document.getElementById('tab-content-add-pdf');
    const contentList = document.getElementById('tab-content-list-topics');

    const btnAdd = document.getElementById('tab-btn-add-topic');
    const btnPdf = document.getElementById('tab-btn-add-pdf');
    const btnList = document.getElementById('tab-btn-list-topics');

    contentAdd.style.display = (tab === 'add-topic') ? 'block' : 'none';
    contentPdf.style.display = (tab === 'add-pdf') ? 'block' : 'none';
    contentList.style.display = (tab === 'list-topics') ? 'block' : 'none';

    btnAdd.className = (tab === 'add-topic') ? 'btn btn-primary btn-sm btn-block' : 'btn btn-secondary btn-sm btn-block';
    btnPdf.className = (tab === 'add-pdf') ? 'btn btn-primary btn-sm btn-block' : 'btn btn-secondary btn-sm btn-block';
    btnList.className = (tab === 'list-topics') ? 'btn btn-primary btn-sm btn-block' : 'btn btn-secondary btn-sm btn-block';

    if (tab === 'list-topics') {
      this.renderManagerTopicsList();
    }
  }

  populateTopicSelects() {
    const select = document.getElementById('pdf-target-topic-select');
    if (!select) return;

    const topics = window.storageService.getTopics();
    select.innerHTML = topics.map(t => `<option value="${t.id}">${t.name} (${t.category})</option>`).join('');
  }

  handleCreateNewTopic(e) {
    e.preventDefault();
    const cat = document.getElementById('new-topic-category').value;
    const name = document.getElementById('new-topic-name').value.trim();
    const icon = document.getElementById('new-topic-icon').value.trim() || '📚';

    const newTopic = window.storageService.addTopic({
      name: name,
      category: cat,
      icon: icon,
      targetQuestions: 15
    });

    this.showToast(`"${name}" konusu başarıyla oluşturuldu!`, 'success');
    document.getElementById('new-topic-name').value = '';
    this.renderTestHub();
    this.closeTopicManagerModal();
  }

  renderManagerTopicsList() {
    const list = document.getElementById('manager-topics-list');
    if (!list) return;

    const topics = window.storageService.getTopics();
    const questions = window.storageService.getQuestions();

    list.innerHTML = topics.map(t => {
      const qCount = questions.filter(q => q.topicId === t.id).length;
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid var(--border-color);">
          <div>
            <div style="font-weight: 700;">${t.icon || '📚'} ${t.name}</div>
            <div style="font-size: 0.78rem; color: var(--text-secondary);">${t.category} • ${qCount} Soru</div>
          </div>
          <button class="btn btn-danger btn-sm" onclick="app.deleteTopicItem('${t.id}')">Sil</button>
        </div>
      `;
    }).join('');
  }

  deleteTopicItem(id) {
    if (confirm('Bu konuyu silmek istediğinize emin misiniz?')) {
      window.storageService.deleteTopic(id);
      this.renderManagerTopicsList();
      this.renderTestHub();
      this.showToast('Konu silindi.', 'info');
    }
  }

  initDropzones() {
    const dropzone = document.getElementById('topic-pdf-dropzone');
    const input = document.getElementById('topic-pdf-file-input');
    if (!dropzone || !input) return;

    dropzone.addEventListener('click', () => input.click());

    input.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const prog = document.getElementById('topic-pdf-progress');
      prog.textContent = `"${file.name}" taranıyor ve metinler analiz ediliyor...`;

      try {
        if (window.pdfService) {
          const text = await window.pdfService.extractTextFromPDF(file);
          const topicId = document.getElementById('pdf-target-topic-select').value;
          const topics = window.storageService.getTopics();
          const topic = topics.find(t => t.id === topicId) || { name: file.name.replace(/\.pdf$/i, '') };

          window.storageService.addSource({
            title: file.name,
            text: text,
            topicId: topicId,
            topicName: topic.name,
            size: `${Math.round(file.size / 1024)} KB`
          });

          // Otomatik Soru Üretimi (Local AI / Kural Tabanlı)
          if (window.questionGenerator) {
            prog.textContent = `📝 "${file.name}" içeriğinden test soruları türetiliyor...`;
            const generatedQuestions = window.questionGenerator.generateLocalQuestionsFromText(text, topic.name, 10);
            
            if (generatedQuestions && generatedQuestions.length > 0) {
              const allQuestions = window.storageService.getQuestions();
              generatedQuestions.forEach(q => {
                q.topicId = topicId;
                q.topicName = topic.name;
                q.category = topic.category || 'Özel Çalışma';
                allQuestions.push(q);
              });
              window.storageService.saveQuestions(allQuestions);
            }
          }

          prog.textContent = `✅ "${file.name}" başarıyla sisteme aktarıldı ve test havuzuna eklendi!`;
          this.showToast(`"${file.name}" başarıyla aktarıldı!`, 'success');
          this.renderTestHub();
          setTimeout(() => this.closeTopicManagerModal(), 1200);
        }
      } catch (err) {
        prog.textContent = `Hata: ${err.message}`;
      }
    });
  }

  // --- YARDIMCI METOTLAR ---
  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const s = window.storageService.getSettings();
    s.theme = theme;
    window.storageService.saveSettings(s);
  }

  applySavedTheme() {
    const s = window.storageService.getSettings();
    if (s && s.theme) {
      document.documentElement.setAttribute('data-theme', s.theme);
    }
  }

  exportBackupJSON() {
    const data = window.storageService.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ekys_2027_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Yedek dosyanız indirildi!', 'success');
  }

  showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new EKYSApp();
});
