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

    // Restore last active view from URL hash or sessionStorage on reload
    const hashView = window.location.hash ? window.location.hash.replace('#', '') : null;
    const savedView = hashView || sessionStorage.getItem('ekys_last_view') || 'dashboard';

    if (savedView && savedView !== 'quiz-active' && document.getElementById(`view-${savedView}`)) {
      this.navigateTo(savedView, false);
    } else {
      this.navigateTo('dashboard', false);
    }

    // Restore open subtopic modal if it was open before refresh
    const savedSubtopic = sessionStorage.getItem('ekys_last_subtopic');
    if (savedSubtopic && (savedView === 'dashboard' || savedView === 'test-hub')) {
      setTimeout(() => {
        this.openSubTopicModal(savedSubtopic);
      }, 150);
    }

    // Listen to hash changes (browser back/forward)
    window.addEventListener('hashchange', () => {
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash && currentHash !== this.currentView && document.getElementById(`view-${currentHash}`)) {
        this.navigateTo(currentHash, false);
      }
    });

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

  navigateTo(viewId, saveState = true) {
    if (this.activeQuiz && !this.activeQuiz.isFinished && viewId !== 'quiz-active') {
      if (!confirm('Devam eden bir sınavınız var. Çıkmak istediğinize emin misiniz?')) {
        return;
      }
      this.stopQuizTimer();
      this.activeQuiz = null;
    }

    // Yetki Kontrolü: Ayarlar & Yönetici Paneline sadece Yönetici (Admin) erişebilir
    if ((viewId === 'settings' || viewId === 'admin-panel') && window.firebaseService && !window.firebaseService.isAdmin()) {
      viewId = 'dashboard';
    }

    this.currentView = viewId;

    if (saveState && viewId !== 'quiz-active') {
      sessionStorage.setItem('ekys_last_view', viewId);
      try {
        if (window.location.hash.replace('#', '') !== viewId) {
          window.location.hash = viewId;
        }
      } catch (e) {}
    }

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

    // Sayfa değiştikçe verileri tazele ve buluttan en güncel çözülen testleri çek
    if (viewId === 'dashboard' || viewId === 'stats') {
      if (window.firebaseService && typeof window.firebaseService.syncAllDataFromCloud === 'function') {
        window.firebaseService.syncAllDataFromCloud().catch(() => {});
      }
    }
    if (viewId === 'dashboard') this.renderDashboard();
    if (viewId === 'test-hub') this.renderTestHub();
    if (viewId === 'wrong-pool') this.renderWrongPoolList();
    if (viewId === 'favorites') this.renderFavoritesList();
    if (viewId === 'stats') this.renderStatsView();
    if (viewId === 'admin-panel') this.loadAdminUsersList();

    // Mobil yan menüyü otomatik kapat
    this.toggleSidebar(false);

    if (saveState) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleSidebar(open = null) {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (!sidebar) return;
    const shouldOpen = open !== null ? open : !sidebar.classList.contains('open');
    if (shouldOpen) {
      sidebar.classList.add('open');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      sidebar.classList.remove('open');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
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
    if (elSuccessRate) elSuccessRate.innerHTML = `%${successRate} <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-secondary);">(${totalSolved} Soru)</span>`;
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
            ${history.slice(0, 3).map(h => {
              const isScored = this.isScoreApplicable(h);
              const pct = h.totalQuestions > 0 ? Math.round((h.correctCount / h.totalQuestions) * 100) : 0;
              return `
              <div class="card">
                <div style="font-weight: 700; font-size: 1rem; margin-bottom: 6px;">${h.title}</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 12px;">${new Date(h.date).toLocaleDateString('tr-TR')}</div>
                <div style="display: flex; gap: 8px; font-size: 0.85rem; flex-wrap: wrap;">
                  <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">✅ ${h.correctCount} D</span>
                  <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">❌ ${h.wrongCount} Y</span>
                  ${isScored ? `
                    <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc;">🎯 ${parseFloat(h.score !== undefined ? h.score : (h.netScore || 0)).toFixed(2)} Puan</span>
                  ` : `
                    <span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">📊 %${pct} Başarı</span>
                  `}
                </div>
              </div>
            `;}).join('')}
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
            <span style="font-size: 28px;">${t.icon || '📖'}</span>
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

  // --- ALT KONU SEÇİM VE QUIZ MOTORU ---
  getSubTopicData() {
    return {
      'genel-kultur': {
        title: '🌍 Genel Kültür Alt Konu Testleri (Soru 6-16)',
        desc: 'Coğrafya, Temel Yurttaşlık ve Güncel Olaylar arasından test seçin:',
        items: [
          {
            id: 'cografya',
            name: 'Coğrafya Testleri & Konu Havuzu',
            icon: '🗺️',
            desc: 'Konu Konu Ayrılmış Testler (Tarım, Maden, Yer Şekilleri vb.), Video Tarama, Çıkmış Sorular.',
            filterKey: 'cografya',
            targetSubtopic: 'cografya-subtopics',
            badge: '35+ Test & 620+ Soru 🌟'
          },
          {
            id: 'yurttaslik',
            name: 'Temel Yurttaşlık Bilgisi',
            icon: '🏛️',
            desc: 'Temel Hukuk, Anayasa Esasları, Devlet Yapısı ve Çıkmış Yurttaşlık Soruları.',
            filterKey: 'yurttaslik',
            targetSubtopic: 'yurttaslik-subtopics',
            badge: 'Çıkmış + Karma'
          },
          {
            id: 'guncel',
            name: 'Güncel / Kültürel Olaylar',
            icon: '🌐',
            desc: 'Türkiye ve Dünya ile İlgili Kültürel, Bilimsel ve Güncel Sosyoekonomik Gelişmeler.',
            filterKey: 'guncel',
            targetSubtopic: 'guncel-subtopics',
            badge: 'Çıkmış + Karma'
          },
          {
            id: 'genel_kultur_tum',
            name: '🏆 Tüm Genel Kültür Karma Test',
            icon: '🎯',
            desc: 'Tüm Coğrafya, Yurttaşlık ve Güncel sorulardan oluşan karma soru havuzu.',
            filterKey: 'genel_kultur_tum',
            badge: 'Karma Test'
          }
        ]
      },
      'inkilap': {
        title: '🇹🇷 Tarih, Atatürk İlkeleri ve İnkılap Tarihi',
        desc: 'Genel Tarih Video Tarama Testleri, İnkılap Tarihi ve Çıkmış Tarih Soruları:',
        items: [
          {
            id: 'tarih1_direct',
            name: '📜 Genel Tarih Video Tarama Testi 1',
            icon: '📜',
            desc: 'İslamiyet Öncesi Türk Tarihi, İlk Türk Devletleri Kültür ve Medeniyeti (19 Soru).',
            filterKey: 'tarih1',
            badge: '19 Soru Video Test'
          },
          {
            id: 'tarih2_direct',
            name: '📜 Genel Tarih Video Tarama Testi 2',
            icon: '📜',
            desc: 'Türk-İslam Devletleri, Büyük Selçuklu, Anadolu Selçuklu ve Osmanlı Tarihi (20 Soru).',
            filterKey: 'tarih2',
            badge: '20 Soru Video Test'
          },
          {
            id: 'inkilap_konu_cat',
            name: '🇹🇷 Atatürk İlkeleri ve İnkılap Tarihi',
            icon: '🇹🇷',
            desc: 'Milli Mücadele, Genelgeler/Kongreler, Muharebeler, Lozan, Cumhuriyet Dönemi ve İlkeler.',
            filterKey: 'inkilap',
            badge: 'Çıkmış + Konu Testleri'
          },
          {
            id: 'tarih_cikmis_cat',
            name: '📜 2019 - 2026 Çıkmış Tarih & İnkılap Soruları',
            icon: '📜',
            desc: 'Tüm resmî MEB EKYS sınavlarında çıkmış Genel Tarih ve İnkılap Tarihi soruları (Soru 1-6 & 17-28).',
            filterKey: 'tarih_cikmis',
            badge: '100+ Soru Çıkmış'
          },
          {
            id: 'tarih_tum_karma',
            name: '🏆 Tüm Tarih & İnkılap Tarihi (Büyük Karma)',
            icon: '🎯',
            desc: 'Genel Tarih 1-2 ve İnkılap Tarihi tüm soru havuzundan karma test.',
            filterKey: 'tarih_tum',
            badge: 'Tüm Tarih Karma'
          }
        ]
      },
      'tarih-subtopics': {
        parentKey: 'inkilap',
        title: '📜 Genel Tarih Video Tarama & Çıkmış Testleri',
        desc: 'Çözmek istediğiniz Tarih testini seçin (Konu bazlı testler veya çıkmış sorular):',
        items: [
          {
            id: 'tarih1',
            name: 'Genel Tarih Video Tarama Testi 1',
            icon: '📜',
            desc: 'İslamiyet Öncesi Türk Tarihi, İlk Türk Devletleri Kültür ve Medeniyeti.',
            filterKey: 'tarih1',
            badge: '20 Soru'
          },
          {
            id: 'tarih2',
            name: 'Genel Tarih Video Tarama Testi 2',
            icon: '⚔️',
            desc: 'İlk Türk-İslam Devletleri, Türkiye Selçukluları ve Anadolu Beylikleri.',
            filterKey: 'tarih2',
            badge: '20 Soru'
          },
          {
            id: 'ekys_2026_tarih',
            name: '2026 EKYS Tarih Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS sınavında çıkmış resmî Genel Tarih soruları (Soru 1-6).',
            filterKey: 'ekys_2026_tarih',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_tarih',
            name: '2025 EKYS Tarih Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS sınavında çıkmış resmî Genel Tarih soruları (Soru 1-5).',
            filterKey: 'ekys_2025_tarih',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_tarih',
            name: '2024 EKYS Tarih Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS sınavında çıkmış resmî Genel Tarih soruları (Soru 1-6).',
            filterKey: 'ekys_2024_tarih',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_tarih',
            name: '2023 EKYS Tarih Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS sınavında çıkmış resmî Genel Tarih soruları (Soru 1-5).',
            filterKey: 'ekys_2023_tarih',
            badge: '2023 Çıkmış'
          },
          {
            id: 'ekys_2022_tarih',
            name: '2022 EKYS Tarih Çıkmış Soruları',
            icon: '📜',
            desc: '2022 MEB EKYS sınavında çıkmış resmî Genel Tarih soruları (Soru 1-6).',
            filterKey: 'ekys_2022_tarih',
            badge: '2022 Çıkmış'
          },
          {
            id: 'ekys_2021_tarih',
            name: '2021 EKYS Tarih Çıkmış Soruları',
            icon: '📜',
            desc: '2021 MEB EKYS sınavında çıkmış resmî Genel Tarih soruları (Soru 1-5).',
            filterKey: 'ekys_2021_tarih',
            badge: '2021 Çıkmış'
          },
          {
            id: 'ekys_2020_tarih',
            name: '2020 EKYS Tarih Çıkmış Soruları',
            icon: '📜',
            desc: '2020 MEB EKYS sınavında çıkmış Genel Tarih soruları (Soru 1-5).',
            filterKey: 'ekys_2020_tarih',
            badge: '2020 Çıkmış'
          },
          {
            id: 'ekys_2019_tarih',
            name: '2019 EKYS Tarih Çıkmış Soruları',
            icon: '📜',
            desc: '2019 MEB EKYS sınavında çıkmış Genel Tarih soruları (Soru 1-5).',
            filterKey: 'ekys_2019_tarih',
            badge: '2019 Çıkmış'
          },
          {
            id: 'tarih_tum',
            name: '🌟 Tüm Tarih Soruları (Karma Test)',
            icon: '🎯',
            desc: 'Tüm video tarama ve çıkmış tarih sorularından oluşan karma soru havuzu.',
            filterKey: 'tarih',
            badge: 'Karma Test'
          }
        ]
      },
      'cografya-subtopics': {
        parentKey: 'genel-kultur',
        title: '🗺️ Coğrafya Konu Testleri & Çıkmış Sorular',
        desc: 'Çözmek istediğiniz Coğrafya ana konusunu seçin (Her konunun altında bağımsız testler yer alır):',
        items: [
          {
            id: 'cogr_ekonomi_cat',
            name: '🌾 Ekonomik Coğrafya Testleri',
            icon: '🌾',
            desc: 'Tarım, Hayvancılık, Madenler, Enerji Kaynakları, Sanayi, Ulaşım ve Turizm Testleri.',
            filterKey: 'cogr_ekonomi',
            targetSubtopic: 'cogr-ekonomi-subtopics',
            badge: '4 Test (86 Soru)'
          },
          {
            id: 'cogr_yer_cat',
            name: '🏔️ Yer Şekilleri, Akarsular & Dış Kuvvetler',
            icon: '🏔️',
            desc: 'Dağlar, Ovalar, Platolar, Göller, Akarsular ve Dış Kuvvetler Testleri.',
            filterKey: 'cogr_yer',
            targetSubtopic: 'cogr-yer-subtopics',
            badge: '11 Test (198 Soru)'
          },
          {
            id: 'cogr_iklim_cat',
            name: '🌦️ Türkiye\'nin İklimi & Bitki Örtüsü',
            icon: '🌦️',
            desc: 'Sıcaklık, Basınç, Rüzgârlar, Yağış Tipleri ve Doğal Bitki Örtüsü Testleri.',
            filterKey: 'cogr_iklim',
            targetSubtopic: 'cogr-iklim-subtopics',
            badge: '3 Test (54 Soru)'
          },
          {
            id: 'cogr_toprak_afet_cat',
            name: '🌋 Toprak Tipleri & Doğal Afetler',
            icon: '🌋',
            desc: 'Toprak Çeşitleri, Deprem, Heyelan, Erozyon ve Çıkmış Afet Soruları.',
            filterKey: 'cogr_toprak_afet',
            targetSubtopic: 'cogr-toprak-afet-subtopics',
            badge: '3 Test (54 Soru)'
          },
          {
            id: 'cogr_nufus_cat',
            name: '👥 Nüfus, Yerleşme ve Göç',
            icon: '👥',
            desc: 'Nüfus Dağılışı, Piramitler, Kır-Kent Yerleşmeleri ve Göç Hareketleri.',
            filterKey: 'cogr_nufus',
            targetSubtopic: 'cogr-nufus-subtopics',
            badge: '3 Test (54 Soru)'
          },
          {
            id: 'cogr_konum_cat',
            name: '🧭 Coğrafi Konum ve Jeopolitik',
            icon: '🧭',
            desc: 'Matematik Konum, Özel Konum, Sınırlar ve Türkiye\'nin Jeopolitiği.',
            filterKey: 'cogr_konum',
            targetSubtopic: 'cogr-konum-subtopics',
            badge: '2 Test (36 Soru)'
          },
          {
            id: 'cogr_tarama_cat',
            name: '🎥 Coğrafya Video Tarama Testleri',
            icon: '🎥',
            desc: 'Konu Tarama 1, Tarama 2 ve Tarama 3 Video Soru Çözüm Testleri.',
            filterKey: 'cogr_tarama',
            targetSubtopic: 'cogr-tarama-subtopics',
            badge: '3 Test (60 Soru)'
          },
          {
            id: 'cogr_cikmis_cat',
            name: '📜 MEB EKYS Çıkmış Coğrafya Soruları',
            icon: '📜',
            desc: '2019-2026 Resmî MEB EKYS Çıkmış Soruları ve 51 Soruluk Özel Seçki.',
            filterKey: 'cogr_cikmis',
            targetSubtopic: 'cogr-cikmis-subtopics',
            badge: '9 Farklı Test'
          },
          {
            id: 'cografya_tum',
            name: '🌟 Tüm Coğrafya Soruları (Büyük Karma Test)',
            icon: '🎯',
            desc: 'Veritabanındaki tüm 620+ Coğrafya sorusundan oluşan büyük soru havuzu.',
            filterKey: 'cografya',
            badge: '620+ Soru Karma'
          }
        ]
      },
      'cogr-ekonomi-subtopics': {
        parentKey: 'cografya-subtopics',
        title: '🌾 Ekonomik Coğrafya Konu Testleri',
        desc: 'Çözmek istediğiniz Ekonomik Coğrafya testini seçin:',
        items: [
          {
            id: 'cogr_test_22',
            name: '🌾 Test 22: Tarım',
            icon: '🌾',
            desc: 'Türkiye\'de Tarımı Etkileyen Faktörler ve Tarım Ürünlerinin Dağılışı.',
            filterKey: 'cogr_test_22',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_23',
            name: '🐑 Test 23: Hayvancılık',
            icon: '🐑',
            desc: 'Büyükbaş, Küçükbaş, Kümes Hayvancılığı, Arıcılık ve Balıkçılık.',
            filterKey: 'cogr_test_23',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_24',
            name: '⛏️ Test 24: Madenler ve Enerji Kaynakları',
            icon: '⛏️',
            desc: 'Maden Yatakları, Yenilenebilir ve Tükenebilir Enerji Kaynakları.',
            filterKey: 'cogr_test_24',
            badge: '26 Soru'
          },
          {
            id: 'cogr_test_25',
            name: '🏭 Test 25: Sanayi, Ulaşım ve Turizm',
            icon: '🏭',
            desc: 'Sanayi Tesisleri Kuruluşu, Ulaşım Sistemleri ve Turizm Çeşitleri.',
            filterKey: 'cogr_test_25',
            badge: '24 Soru'
          },
          {
            id: 'cogr_ekonomi_tum',
            name: '🌟 Ekonomik Coğrafya Karma Testi',
            icon: '🎯',
            desc: 'Tüm Tarım, Hayvancılık, Maden ve Sanayi sorularından oluşan karma test.',
            filterKey: 'cogr_ekonomi',
            badge: '86 Soru Karma'
          }
        ]
      },
      'cogr-yer-subtopics': {
        parentKey: 'cografya-subtopics',
        title: '🏔️ Yer Şekilleri, Akarsular & Dış Kuvvetler Testleri',
        desc: 'Çözmek istediğiniz Yer Şekilleri testini seçin:',
        items: [
          {
            id: 'cogr_test_2',
            name: '🏔️ Test 2: Coğrafi Konum ve Yer Şekilleri',
            icon: '🏔️',
            desc: 'Jeolojik Yapı, Dağ Kuşakları ve Ana Jeomorfolojik Özellikler.',
            filterKey: 'cogr_test_2',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_3',
            name: '🏔️ Test 3: Yer Şekilleri',
            icon: '🏔️',
            desc: 'Kıvrım, Kırık Dağlar ve Volkanik Oluşumlar.',
            filterKey: 'cogr_test_3',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_5',
            name: '🏔️ Test 5: Yer Şekilleri',
            icon: '🏔️',
            desc: 'Yükselti, Engebe ve Dağların Kıyıya Uzanış Sonuçları.',
            filterKey: 'cogr_test_5',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_6',
            name: '🏔️ Test 6: Yer Şekilleri',
            icon: '🏔️',
            desc: 'Fay Hatları, Deprem Kuşakları ve Jeolojik Devirler.',
            filterKey: 'cogr_test_6',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_7',
            name: '🌊 Test 7: Yer Şekilleri ve Dış Kuvvetler',
            icon: '🌊',
            desc: 'Aşınım ve Birikim Süreçleri, Akarsu ve Rüzgâr Şekilleri.',
            filterKey: 'cogr_test_7',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_8',
            name: '🌊 Test 8: Akarsular',
            icon: '🌊',
            desc: 'Akarsu Havzaları, Rejimleri, Açık/Kapalı Havzalar ve Aşınım Şekilleri.',
            filterKey: 'cogr_test_8',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_9',
            name: '🏞️ Test 9: Platolar',
            icon: '🏞️',
            desc: 'Karstik, Volkanik (Lav), Tabaka Düzlüğü ve Aşınım Platoları.',
            filterKey: 'cogr_test_9',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_10',
            name: '🌾 Test 10: Ovalar',
            icon: '🌾',
            desc: 'Delta Ovaları, Tektonik Ovalar ve Karstik Ovalar (Polye).',
            filterKey: 'cogr_test_10',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_11',
            name: '⛵ Test 11: Göller',
            icon: '⛵',
            desc: 'Tektonik, Volkanik, Karstik, Buzul ve Set Gölleri (Heyelan, Alüvyal, Kıyı set).',
            filterKey: 'cogr_test_11',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_15',
            name: '💨 Test 15: Dış Kuvvetler - 1',
            icon: '💨',
            desc: 'Rüzgâr, Buzul ve Dalga-Akıntı Aşınım ve Birikim Şekilleri.',
            filterKey: 'cogr_test_15',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_16',
            name: '💨 Test 16: Dış Kuvvetler - 2',
            icon: '💨',
            desc: 'Kıyı Tipleri, Karstik Aşınım-Birikim ve Yeraltı Suları.',
            filterKey: 'cogr_test_16',
            badge: '18 Soru'
          },
          {
            id: 'cogr_yer_tum',
            name: '🌟 Yer Şekilleri & Dış Kuvvetler Karma Testi',
            icon: '🎯',
            desc: 'Tüm yer şekilleri, dağ, ova, plato, akarsu ve göl soruları havuzu.',
            filterKey: 'cogr_yer',
            badge: '198 Soru Karma'
          }
        ]
      },
      'cogr-iklim-subtopics': {
        parentKey: 'cografya-subtopics',
        title: '🌦️ Türkiye\'nin İklimi & Bitki Örtüsü Testleri',
        desc: 'Çözmek istediğiniz İklim testini seçin:',
        items: [
          {
            id: 'cogr_test_17',
            name: '☀️ Test 17: İklim - 1 (Sıcaklık ve Basınç)',
            icon: '☀️',
            desc: 'Güneş Işınları Açısı, Sıcaklık Dağılışı, İndirgenmiş Sıcaklık ve Basınç.',
            filterKey: 'cogr_test_17',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_18_1',
            name: '🌧️ Test 18: İklim - 2 (Rüzgârlar ve Yağış)',
            icon: '🌧️',
            desc: 'Yerel Rüzgârlar, Nem Türleri ve Yağış Oluşum Tipleri.',
            filterKey: 'cogr_test_18_1',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_18_2',
            name: '🌲 Test 18(3): İklim - 3 & Bitki Örtüsü',
            icon: '🌲',
            desc: 'Akdeniz, Karadeniz, Karasal İklim Tipleri ve Bitki Formasyonları.',
            filterKey: 'cogr_test_18_2',
            badge: '18 Soru'
          },
          {
            id: 'cogr_iklim_tum',
            name: '🌟 İklim & Bitki Örtüsü Karma Testi',
            icon: '🎯',
            desc: 'Tüm iklim, sıcaklık, rüzgâr, yağış ve bitki örtüsü soruları havuzu.',
            filterKey: 'cogr_iklim',
            badge: '54 Soru Karma'
          }
        ]
      },
      'cogr-toprak-afet-subtopics': {
        parentKey: 'cografya-subtopics',
        title: '🌋 Toprak Tipleri & Doğal Afetler Testleri',
        desc: 'Çözmek istediğiniz Toprak & Doğal Afetler testini seçin:',
        items: [
          {
            id: 'cogr_test_14',
            name: '🌱 Test 14: Topraklar',
            icon: '🌱',
            desc: 'Zonal (Kahverengi, Terra Rossa, Podzol), İntrazonal ve Azonal Topraklar.',
            filterKey: 'cogr_test_14',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_13',
            name: '⚠️ Test 13: Afetler',
            icon: '⚠️',
            desc: 'Deprem, Heyelan, Kütle Hareketleri, Erozyon, Sel, Çığ ve Yangınlar.',
            filterKey: 'cogr_test_13',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_12',
            name: '🌋 Test 12: Çıkmış Yer Şekilleri & Afetler',
            icon: '🌋',
            desc: 'ÖSYM/MEB Sınavlarında Çıkmış Yer Şekilleri ve Doğal Afet Soruları.',
            filterKey: 'cogr_test_12',
            badge: '18 Soru'
          },
          {
            id: 'cogr_toprak_afet_tum',
            name: '🌟 Toprak & Afetler Karma Testi',
            icon: '🎯',
            desc: 'Tüm toprak çeşitleri ve doğal afetler sorularından oluşan karma test.',
            filterKey: 'cogr_toprak_afet',
            badge: '54 Soru Karma'
          }
        ]
      },
      'cogr-nufus-subtopics': {
        parentKey: 'cografya-subtopics',
        title: '👥 Nüfus, Yerleşme ve Göç Testleri',
        desc: 'Çözmek istediğiniz Nüfus & Yerleşme testini seçin:',
        items: [
          {
            id: 'cogr_test_19',
            name: '👥 Test 19: Nüfus - 1',
            icon: '👥',
            desc: 'Nüfusun Değişimi, Yoğunluğu, Aritmetik-Fizyolojik Yoğunluk ve Sayımlar.',
            filterKey: 'cogr_test_19',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_20',
            name: '👥 Test 20: Nüfus - 2',
            icon: '👥',
            desc: 'Nüfus Piramitleri, Yaş Grupları, Cinsiyet Oranı ve Sektörel Dağılım.',
            filterKey: 'cogr_test_20',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_21',
            name: '🏘️ Test 21: Yerleşme ve Göç',
            icon: '🏘️',
            desc: 'Kır/Kent Yerleşmeleri, Geçici/Kalıcı Köy Altı Yerleşmeleri, İç ve Dış Göçler.',
            filterKey: 'cogr_test_21',
            badge: '18 Soru'
          },
          {
            id: 'cogr_nufus_tum',
            name: '🌟 Nüfus & Yerleşme Karma Testi',
            icon: '🎯',
            desc: 'Tüm nüfus, demografi, yerleşme ve göç sorularından oluşan karma test.',
            filterKey: 'cogr_nufus',
            badge: '54 Soru Karma'
          }
        ]
      },
      'cogr-konum-subtopics': {
        parentKey: 'cografya-subtopics',
        title: '🧭 Coğrafi Konum ve Jeopolitik Testleri',
        desc: 'Çözmek istediğiniz Coğrafi Konum testini seçin:',
        items: [
          {
            id: 'cogr_test_1',
            name: '🧭 Test 1: Coğrafi Konum Soruları',
            icon: '🧭',
            desc: 'Türkiye\'nin Matematik Konumu, Paraleller, Meridyenler ve Yerel Saat.',
            filterKey: 'cogr_test_1',
            badge: '18 Soru'
          },
          {
            id: 'cogr_test_4',
            name: '🧭 Test 4: Coğrafi Konum & Jeopolitik',
            icon: '🧭',
            desc: 'Türkiye\'nin Jeopolitik Konumu, Sınır Kapıları, Boğazlar ve Stratejik Önemi.',
            filterKey: 'cogr_test_4',
            badge: '18 Soru'
          },
          {
            id: 'cogr_konum_tum',
            name: '🌟 Coğrafi Konum Karma Testi',
            icon: '🎯',
            desc: 'Tüm coğrafi konum, matematik/özel konum ve jeopolitik soruları havuzu.',
            filterKey: 'cogr_konum',
            badge: '36 Soru Karma'
          }
        ]
      },
      'cogr-tarama-subtopics': {
        parentKey: 'cografya-subtopics',
        title: '🎥 Coğrafya Video Tarama Testleri',
        desc: 'Çözmek istediğiniz Video Tarama Testini seçin:',
        items: [
          {
            id: 'cogr1',
            name: 'Coğrafya Video Tarama Testi 1',
            icon: '🗺️',
            desc: 'Türkiye\'nin Coğrafi Konumu, Sınırları, Enlem-Boylam ve Yerel Saat.',
            filterKey: 'cogr1',
            badge: '20 Soru'
          },
          {
            id: 'cogr2',
            name: 'Coğrafya Video Tarama Testi 2',
            icon: '🏔️',
            desc: 'Türkiye\'nin Yer Şekilleri, Jeolojik Yapı, Dağlar, Ovalar ve Platolar.',
            filterKey: 'cogr2',
            badge: '20 Soru'
          },
          {
            id: 'cogr3',
            name: 'Coğrafya Video Tarama Testi 3',
            icon: '🌍',
            desc: 'Türkiye\'nin İklimi, Bitki Örtüsü, Akarsuları ve Doğal Kaynakları.',
            filterKey: 'cogr3',
            badge: '20 Soru'
          },
          {
            id: 'cogr_tarama_tum',
            name: '🌟 Video Tarama Karma Testi',
            icon: '🎯',
            desc: 'Üç video tarama testinin tüm sorularından oluşan 60 soruluk karma havuz.',
            filterKey: 'cogr_tarama',
            badge: '60 Soru'
          }
        ]
      },
      'cogr-cikmis-subtopics': {
        parentKey: 'cografya-subtopics',
        title: '📜 MEB EKYS Çıkmış Coğrafya Soruları',
        desc: 'Çözmek istediğiniz Çıkmış Coğrafya sınavını seçin:',
        items: [
          {
            id: 'cogr_test_cikmis_secki',
            name: '📜 2022-2023 Çıkmış Coğrafya Özel Seçkisi',
            icon: '⭐',
            desc: 'ÖSYM Coğrafya Çıkmış Sorularından Derlenen Özel 51 Soruluk Seçki.',
            filterKey: 'cogr_test_cikmis_secki',
            badge: '51 Soru'
          },
          {
            id: 'ekys_2026_cogr',
            name: '2026 EKYS Coğrafya Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS sınavında çıkmış resmî Coğrafya soruları (Soru 7-12).',
            filterKey: 'ekys_2026_cogr',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_cogr',
            name: '2025 EKYS Coğrafya Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS sınavında çıkmış resmî Coğrafya soruları ve detaylı çözümleri.',
            filterKey: 'ekys_2025_cogr',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_cogr',
            name: '2024 EKYS Coğrafya Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS sınavında çıkmış resmî Coğrafya soruları ve harita çözümleri (Soru 7-12).',
            filterKey: 'ekys_2024_cogr',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_cogr',
            name: '2023 EKYS Coğrafya Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS sınavında çıkmış resmî Coğrafya soruları ve harita çözümleri (Soru 6-10).',
            filterKey: 'ekys_2023_cogr',
            badge: '2023 Çıkmış'
          },
          {
            id: 'ekys_2022_cogr',
            name: '2022 EKYS Coğrafya Çıkmış Soruları',
            icon: '📜',
            desc: '2022 MEB EKYS sınavında çıkmış resmî Coğrafya soruları ve harita çözümleri (Soru 7-12).',
            filterKey: 'ekys_2022_cogr',
            badge: '2022 Çıkmış'
          },
          {
            id: 'ekys_2021_cogr',
            name: '2021 EKYS Coğrafya Çıkmış Soruları',
            icon: '📜',
            desc: '2021 MEB EKYS sınavında çıkmış resmî Coğrafya soruları ve harita çözümleri (Soru 6-10).',
            filterKey: 'ekys_2021_cogr',
            badge: '2021 Çıkmış'
          },
          {
            id: 'ekys_2020_cogr',
            name: '2020 EKYS Coğrafya Çıkmış Soruları',
            icon: '📜',
            desc: '2020 MEB EKYS sınavında çıkmış Coğrafya soruları ve harita çözümleri (Soru 6-10).',
            filterKey: 'ekys_2020_cogr',
            badge: '2020 Çıkmış'
          },
          {
            id: 'ekys_2019_cogr',
            name: '2019 EKYS Coğrafya Çıkmış Soruları',
            icon: '📜',
            desc: '2019 MEB EKYS sınavında çıkmış Coğrafya soruları, harita ve grafik çözümleri (Soru 6-10).',
            filterKey: 'ekys_2019_cogr',
            badge: '2019 Çıkmış'
          }
        ]
      },
      'yurttaslik-subtopics': {
        parentKey: 'genel-kultur',
        title: '🏛️ Temel Yurttaşlık Çıkmış & Konu Testleri',
        desc: 'Çözmek istediğiniz Yurttaşlık testini seçin:',
        items: [
          {
            id: 'ekys_2026_yurttaslik',
            name: '2026 EKYS Yurttaşlık Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS sınavında çıkmış resmî Temel Yurttaşlık soruları.',
            filterKey: 'ekys_2026_yurttaslik',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_yurttaslik',
            name: '2025 EKYS Yurttaşlık Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS sınavında çıkmış resmî Temel Yurttaşlık soruları.',
            filterKey: 'ekys_2025_yurttaslik',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_yurttaslik',
            name: '2024 EKYS Yurttaşlık Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS sınavında çıkmış resmî Temel Yurttaşlık soruları.',
            filterKey: 'ekys_2024_yurttaslik',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_yurttaslik',
            name: '2023 EKYS Yurttaşlık Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS sınavında çıkmış resmî Temel Yurttaşlık soruları.',
            filterKey: 'ekys_2023_yurttaslik',
            badge: '2023 Çıkmış'
          },
          {
            id: 'ekys_2022_yurttaslik',
            name: '2022 EKYS Yurttaşlık Çıkmış Soruları',
            icon: '📜',
            desc: '2022 MEB EKYS sınavında çıkmış resmî Temel Yurttaşlık soruları.',
            filterKey: 'ekys_2022_yurttaslik',
            badge: '2022 Çıkmış'
          },
          {
            id: 'ekys_2021_yurttaslik',
            name: '2021 EKYS Yurttaşlık Çıkmış Soruları',
            icon: '📜',
            desc: '2021 MEB EKYS sınavında çıkmış resmî Temel Yurttaşlık soruları (Soru 11-14).',
            filterKey: 'ekys_2021_yurttaslik',
            badge: '2021 Çıkmış'
          },
          {
            id: 'ekys_2020_yurttaslik',
            name: '2020 EKYS Yurttaşlık Çıkmış Soruları',
            icon: '📜',
            desc: '2020 MEB EKYS sınavında çıkmış Temel Yurttaşlık soruları (Soru 11-14).',
            filterKey: 'ekys_2020_yurttaslik',
            badge: '2020 Çıkmış'
          },
          {
            id: 'ekys_2019_yurttaslik',
            name: '2019 EKYS Yurttaşlık Çıkmış Soruları',
            icon: '📜',
            desc: '2019 MEB EKYS sınavında çıkmış Temel Yurttaşlık soruları (Soru 11-14).',
            filterKey: 'ekys_2019_yurttaslik',
            badge: '2019 Çıkmış'
          },
          {
            id: 'yurttaslik_tum',
            name: '🌟 Tüm Yurttaşlık Soruları (Karma Test)',
            icon: '🎯',
            desc: 'Tüm yılların çıkmış yurttaşlık sorularından oluşan karma soru havuzu.',
            filterKey: 'yurttaslik',
            badge: 'Karma Test'
          }
        ]
      },
      'guncel-subtopics': {
        parentKey: 'genel-kultur',
        title: '🌐 Güncel Bilgiler & Kültürel Olaylar Testleri',
        desc: 'Çözmek istediğiniz Güncel Bilgiler testini seçin:',
        items: [
          {
            id: 'ekys_2026_guncel',
            name: '2026 EKYS Güncel Bilgiler Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS sınavında çıkmış resmî Güncel Bilgiler soruları.',
            filterKey: 'ekys_2026_guncel',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_guncel',
            name: '2025 EKYS Güncel Bilgiler Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS sınavında çıkmış resmî Güncel Bilgiler soruları.',
            filterKey: 'ekys_2025_guncel',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_guncel',
            name: '2024 EKYS Güncel Bilgiler Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS sınavında çıkmış resmî Güncel Bilgiler soruları.',
            filterKey: 'ekys_2024_guncel',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_guncel',
            name: '2023 EKYS Güncel Bilgiler Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS sınavında çıkmış resmî Güncel Bilgiler soruları.',
            filterKey: 'ekys_2023_guncel',
            badge: '2023 Çıkmış'
          },
          {
            id: 'ekys_2022_guncel',
            name: '2022 EKYS Güncel Bilgiler Çıkmış Soruları',
            icon: '📜',
            desc: '2022 MEB EKYS sınavında çıkmış resmî Güncel Bilgiler soruları.',
            filterKey: 'ekys_2022_guncel',
            badge: '2022 Çıkmış'
          },
          {
            id: 'ekys_2021_guncel',
            name: '2021 EKYS Güncel Bilgiler Çıkmış Soruları',
            icon: '📜',
            desc: '2021 MEB EKYS sınavında çıkmış resmî Güncel Bilgiler soruları (Soru 15-16).',
            filterKey: 'ekys_2021_guncel',
            badge: '2021 Çıkmış'
          },
          {
            id: 'guncel_tum',
            name: '🌟 Tüm Güncel Sorular (Karma Test)',
            icon: '🎯',
            desc: 'Tüm yılların çıkmış güncel ve genel kültür sorularından oluşan karma test.',
            filterKey: 'guncel',
            badge: 'Karma Test'
          }
        ]
      },
      'inkilap': {
        title: '🇹🇷 Tarih, Atatürk İlkeleri ve İnkılap Tarihi',
        desc: 'Genel Tarih Video Tarama Testleri, İnkılap Tarihi ve Çıkmış Tarih Soruları:',
        items: [
          {
            id: 'tarih1_direct',
            name: '📜 Genel Tarih Video Tarama Testi 1',
            icon: '📜',
            desc: 'İslamiyet Öncesi Türk Tarihi, İlk Türk Devletleri Kültür ve Medeniyeti (19 Soru).',
            filterKey: 'tarih1',
            badge: '19 Soru Video Test'
          },
          {
            id: 'tarih2_direct',
            name: '📜 Genel Tarih Video Tarama Testi 2',
            icon: '📜',
            desc: 'Türk-İslam Devletleri, Büyük Selçuklu, Anadolu Selçuklu ve Osmanlı Tarihi (20 Soru).',
            filterKey: 'tarih2',
            badge: '20 Soru Video Test'
          },
          {
            id: 'inkilap_konu_cat',
            name: '🇹🇷 Atatürk İlkeleri ve İnkılap Tarihi',
            icon: '🇹🇷',
            desc: 'Milli Mücadele, Genelgeler/Kongreler, Muharebeler, Lozan, Cumhuriyet Dönemi ve İlkeler.',
            filterKey: 'inkilap',
            badge: 'Çıkmış + Konu Testleri'
          },
          {
            id: 'tarih_cikmis_cat',
            name: '📜 2019 - 2026 Çıkmış Tarih & İnkılap Soruları',
            icon: '📜',
            desc: 'Tüm resmî MEB EKYS sınavlarında çıkmış Genel Tarih ve İnkılap Tarihi soruları (Soru 1-6 & 17-28).',
            filterKey: 'tarih_cikmis',
            badge: '100+ Soru Çıkmış'
          },
          {
            id: 'tarih_tum_karma',
            name: '🏆 Tüm Tarih & İnkılap Tarihi (Büyük Karma)',
            icon: '🎯',
            desc: 'Genel Tarih 1-2 ve İnkılap Tarihi tüm soru havuzundan karma test.',
            filterKey: 'tarih_tum',
            badge: 'Tüm Tarih Karma'
          }
        ]
      },
      'degerler': {
        title: '💎 Değerler Eğitimi ve Etik (Soru 29-32)',
        desc: 'Milli Manevi Değerler, Mesleki ve Kamusal Etik İlkeleri testleri:',
        items: [
          {
            id: 'ekys_2026_degerler',
            name: '2026 EKYS Değerler & Etik Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS sınavında çıkmış resmî Değerler Eğitimi ve Etik soruları.',
            filterKey: 'ekys_2026_degerler',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_degerler',
            name: '2025 EKYS Değerler & Etik Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS sınavında çıkmış resmî Değerler Eğitimi ve Etik soruları.',
            filterKey: 'ekys_2025_degerler',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_degerler',
            name: '2024 EKYS Değerler & Etik Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS sınavında çıkmış resmî Değerler Eğitimi ve Etik soruları.',
            filterKey: 'ekys_2024_degerler',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_degerler',
            name: '2023 EKYS Değerler & Etik Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS sınavında çıkmış resmî Değerler Eğitimi ve Etik soruları.',
            filterKey: 'ekys_2023_degerler',
            badge: '2023 Çıkmış'
          },
          {
            id: 'ekys_2022_degerler',
            name: '2022 EKYS Değerler & Etik Çıkmış Soruları',
            icon: '📜',
            desc: '2022 MEB EKYS sınavında çıkmış resmî Değerler Eğitimi ve Etik soruları.',
            filterKey: 'ekys_2022_degerler',
            badge: '2022 Çıkmış'
          },
          {
            id: 'ekys_2021_degerler',
            name: '2021 EKYS Değerler & Etik Çıkmış Soruları',
            icon: '📜',
            desc: '2021 MEB EKYS sınavında çıkmış resmî Değerler Eğitimi ve Etik soruları (Soru 29-32).',
            filterKey: 'ekys_2021_degerler',
            badge: '2021 Çıkmış'
          },
          {
            id: 'ekys_2020_degerler',
            name: '2020 EKYS Değerler & Etik Çıkmış Soruları',
            icon: '📜',
            desc: '2020 MEB EKYS sınavında çıkmış Değerler Eğitimi ve Etik soruları (Soru 29-32).',
            filterKey: 'ekys_2020_degerler',
            badge: '2020 Çıkmış'
          },
          {
            id: 'ekys_2019_degerler',
            name: '2019 EKYS Değerler & Etik Çıkmış Soruları',
            icon: '📜',
            desc: '2019 MEB EKYS sınavında çıkmış Değerler Eğitimi ve Etik soruları (Soru 29-32).',
            filterKey: 'ekys_2019_degerler',
            badge: '2019 Çıkmış'
          },
          {
            id: 'degerler_tum',
            name: '🌟 Tüm Değerler & Etik Soruları (Karma Test)',
            icon: '🎯',
            desc: 'Tüm çıkmış Değerler Eğitimi ve Kamu Görevlileri Etik ilkeleri sorularından oluşan karma test.',
            filterKey: 'degerler_egitimi',
            badge: 'Karma Test'
          }
        ]
      },
      'egitim_bilimleri': {
        title: '📚 Eğitim Bilimleri & Pedagoji (Soru 33-40)',
        desc: 'Program Geliştirme, Öğretim İlke ve Yöntemleri, Ölçme ve Rehberlik testleri:',
        items: [
          {
            id: 'egitim_prog_gel_1',
            name: '🎯 Program Geliştirme Testi 1',
            icon: '🎯',
            desc: 'Program Okuryazarlığı, Temel Kavramlar, Program Türleri, Felsefeler, İhtiyaç Analizi ve Tasarım Yaklaşımları.',
            filterKey: 'egitim_prog_gel_1',
            badge: '19 Soru • Konu Testi'
          },
          {
            id: 'ekys_2026_egitim',
            name: '2026 EKYS Eğitim Bilimleri Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS sınavında çıkmış resmî Eğitim Bilimleri soruları.',
            filterKey: 'ekys_2026_egitim',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_egitim',
            name: '2025 EKYS Eğitim Bilimleri Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS sınavında çıkmış resmî Eğitim Bilimleri soruları.',
            filterKey: 'ekys_2025_egitim',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_egitim',
            name: '2024 EKYS Eğitim Bilimleri Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS sınavında çıkmış resmî Eğitim Bilimleri soruları.',
            filterKey: 'ekys_2024_egitim',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_egitim',
            name: '2023 EKYS Eğitim Bilimleri Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS sınavında çıkmış resmî Eğitim Bilimleri soruları.',
            filterKey: 'ekys_2023_egitim',
            badge: '2023 Çıkmış'
          },
          {
            id: 'ekys_2022_egitim',
            name: '2022 EKYS Eğitim Bilimleri Çıkmış Soruları',
            icon: '📜',
            desc: '2022 MEB EKYS sınavında çıkmış resmî Eğitim Bilimleri soruları.',
            filterKey: 'ekys_2022_egitim',
            badge: '2022 Çıkmış'
          },
          {
            id: 'ekys_2021_egitim',
            name: '2021 EKYS Eğitim Bilimleri Çıkmış Soruları',
            icon: '📜',
            desc: '2021 MEB EKYS sınavında çıkmış resmî Eğitim Bilimleri soruları (Soru 33-40).',
            filterKey: 'ekys_2021_egitim',
            badge: '2021 Çıkmış'
          },
          {
            id: 'ekys_2020_egitim',
            name: '2020 EKYS Eğitim Bilimleri Çıkmış Soruları',
            icon: '📜',
            desc: '2020 MEB EKYS sınavında çıkmış Eğitim Bilimleri soruları (Soru 33-40).',
            filterKey: 'ekys_2020_egitim',
            badge: '2020 Çıkmış'
          },
          {
            id: 'ekys_2019_egitim',
            name: '2019 EKYS Eğitim Bilimleri Çıkmış Soruları',
            icon: '📜',
            desc: '2019 MEB EKYS sınavında çıkmış Eğitim Bilimleri soruları (Soru 33-40).',
            filterKey: 'ekys_2019_egitim',
            badge: '2019 Çıkmış'
          },
          {
            id: 'egitim_tum',
            name: '🌟 Tüm Eğitim Bilimleri Soruları (Karma Test)',
            icon: '🎯',
            desc: 'Tüm çıkmış Eğitim Bilimleri ve pedagoji sorularından oluşan karma soru havuzu.',
            filterKey: 'egitim_bilimleri',
            badge: 'Karma Test'
          }
        ]
      },
      'egitim_yonetimi': {
        title: '🏫 Eğitim Yönetimi ve Denetimi (Soru 41-64)',
        desc: 'Liderlik Modelleri, Örgütsel Davranış, Okul Denetimi ve Toplam Kalite Yönetimi testleri:',
        items: [
          {
            id: 'ekys_2026_yonetim',
            name: '2026 EKYS Eğitim Yönetimi Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS sınavında çıkmış resmî Eğitim Yönetimi soruları.',
            filterKey: 'ekys_2026_yonetim',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_yonetim',
            name: '2025 EKYS Eğitim Yönetimi Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS sınavında çıkmış resmî Eğitim Yönetimi soruları.',
            filterKey: 'ekys_2025_yonetim',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_yonetim',
            name: '2024 EKYS Eğitim Yönetimi Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS sınavında çıkmış resmî Eğitim Yönetimi soruları.',
            filterKey: 'ekys_2024_yonetim',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_yonetim',
            name: '2023 EKYS Eğitim Yönetimi Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS sınavında çıkmış resmî Eğitim Yönetimi soruları.',
            filterKey: 'ekys_2023_yonetim',
            badge: '2023 Çıkmış'
          },
          {
            id: 'ekys_2022_yonetim',
            name: '2022 EKYS Eğitim Yönetimi Çıkmış Soruları',
            icon: '📜',
            desc: '2022 MEB EKYS sınavında çıkmış resmî Eğitim Yönetimi soruları.',
            filterKey: 'ekys_2022_yonetim',
            badge: '2022 Çıkmış'
          },
          {
            id: 'ekys_2021_yonetim',
            name: '2021 EKYS Eğitim Yönetimi Çıkmış Soruları',
            icon: '📜',
            desc: '2021 MEB EKYS sınavında çıkmış resmî Eğitim Yönetimi soruları (Soru 41-64).',
            filterKey: 'ekys_2021_yonetim',
            badge: '2021 Çıkmış'
          },
          {
            id: 'ekys_2020_yonetim',
            name: '2020 EKYS Eğitim Yönetimi Çıkmış Soruları',
            icon: '📜',
            desc: '2020 MEB EKYS sınavında çıkmış Eğitim Yönetimi soruları (Soru 41-64).',
            filterKey: 'ekys_2020_yonetim',
            badge: '2020 Çıkmış'
          },
          {
            id: 'ekys_2019_yonetim',
            name: '2019 EKYS Eğitim Yönetimi Çıkmış Soruları',
            icon: '📜',
            desc: '2019 MEB EKYS sınavında çıkmış Eğitim Yönetimi soruları (Soru 41-64).',
            filterKey: 'ekys_2019_yonetim',
            badge: '2019 Çıkmış'
          },
          {
            id: 'yonetim_tum',
            name: '🌟 Tüm Eğitim Yönetimi Soruları (Karma Test)',
            icon: '🎯',
            desc: 'Tüm çıkmış Eğitim Yönetimi, Liderlik ve Denetim sorularından oluşan karma test.',
            filterKey: 'egitim_yonetimi',
            badge: 'Karma Test'
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
        desc: '1982 Anayasası, MEB Temel Kanunları ve İlgili Mevzuattan dilediğiniz kanunun çıkmış sorularına ulaşın:',
        items: [
          {
            id: 'mevzuat_anayasa',
            name: '1982 T.C. Anayasası',
            icon: '📘',
            desc: 'Temel Hak ve Ödevler, Yasama, Yürütme, Yargı ve İdare Esasları.',
            filterKey: 'mevzuat_anayasa',
            targetSubtopic: 'mevzuat-anayasa-subtopics',
            badge: 'Çıkmış + Karma'
          },
          {
            id: 'mevzuat_657',
            name: '657 Sayılı Devlet Memurları Kanunu',
            icon: '📕',
            desc: 'Genel İlkeler, Ödev ve Sorumluluklar, Haklar, Disiplin ve Cezalar.',
            filterKey: 'mevzuat_657',
            targetSubtopic: 'mevzuat-657-subtopics',
            badge: 'Çıkmış + Karma'
          },
          {
            id: 'mevzuat_1739',
            name: '1739 Sayılı Millî Eğitim Temel Kanunu',
            icon: '📙',
            desc: 'Türk Millî Eğitiminin Temel İlkeleri, Okul Kademeleri ve Öğretmenlik Mesleği.',
            filterKey: 'mevzuat_1739',
            targetSubtopic: 'mevzuat-1739-subtopics',
            badge: 'Çıkmış + Karma'
          },
          {
            id: 'mevzuat_222',
            name: '222 Sayılı İlköğretim ve Eğitim Kanunu',
            icon: '📗',
            desc: 'İlköğretim Çağı, Kayıt-Kabul, Devam Takibi, Okul Gelirleri ve Cezalar.',
            filterKey: 'mevzuat_222',
            targetSubtopic: 'mevzuat-222-subtopics',
            badge: 'Çıkmış + Karma'
          },
          {
            id: 'mevzuat_5018',
            name: '5018 Sayılı Kamu Mali Yönetimi Kanunu',
            icon: '💰',
            desc: 'Bütçe İlkeleri, Harcama Yetkilisi, Gerçekleştirme Görevlisi ve İç Kontrol.',
            filterKey: 'mevzuat_5018',
            targetSubtopic: 'mevzuat-5018-subtopics',
            badge: 'Çıkmış + Karma'
          },
          {
            id: 'mevzuat_4483',
            name: '4483 Sayılı Memurların Yargılanması Kanunu',
            icon: '⚖️',
            desc: 'Ön İnceleme, İzin Vermeye Yetkili Merciler ve Yargılama Usulü.',
            filterKey: 'mevzuat_4483',
            targetSubtopic: 'mevzuat-4483-subtopics',
            badge: 'Çıkmış + Karma'
          },
          {
            id: 'mevzuat_4688',
            name: '4688 Sayılı Kamu Görevlileri Sendikaları',
            icon: '🤝',
            desc: 'Sendika Kurulması, Organları, Toplu Sözleşme ve Sendikal Güvenceler.',
            filterKey: 'mevzuat_4688',
            targetSubtopic: 'mevzuat-4688-subtopics',
            badge: 'Çıkmış + Karma'
          },
          {
            id: 'mevzuat_5442',
            name: '5442 Sayılı İl İdaresi Kanunu',
            icon: '🏢',
            desc: 'Vali ve Kaymakamın Yetkileri, İl ve İlçe İdare Teşkilatı.',
            filterKey: 'mevzuat_5442',
            targetSubtopic: 'mevzuat-5442-subtopics',
            badge: 'Çıkmış + Karma'
          },
          {
            id: 'mevzuat_3071',
            name: '3071 Sayılı Dilekçe Hakkı Kanunu',
            icon: '📄',
            desc: 'Dilekçe Hakkının Kullanımı, Başvuru ve Cevap Verme Süreleri.',
            filterKey: 'mevzuat_3071',
            targetSubtopic: 'mevzuat-3071-subtopics',
            badge: 'Çıkmış + Karma'
          },
          {
            id: 'mevzuat_1cbk',
            name: '1 Sayılı CBK (Millî Eğitim Bakanlığı)',
            icon: '🏛️',
            desc: 'MEB Hizmet Birimleri, Görev ve Yetkileri ve Teşkilat Yapısı.',
            filterKey: 'mevzuat_1cbk',
            targetSubtopic: 'mevzuat-1cbk-subtopics',
            badge: 'Çıkmış + Karma'
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
      'mevzuat-anayasa-subtopics': {
        parentKey: 'mevzuat',
        title: '📘 1982 T.C. Anayasası Çıkmış & Konu Testleri',
        desc: '1982 Anayasası ile ilgili çıkmış sınav soruları:',
        items: [
          {
            id: 'ekys_2026_mevzuat_anayasa',
            name: '2026 EKYS Anayasa Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS Anayasa Hukuku soruları ve çözümleri.',
            filterKey: 'ekys_2026_mevzuat_anayasa',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_mevzuat_anayasa',
            name: '2025 EKYS Anayasa Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS Anayasa Hukuku soruları ve çözümleri.',
            filterKey: 'ekys_2025_mevzuat_anayasa',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_mevzuat_anayasa',
            name: '2024 EKYS Anayasa Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS Anayasa Hukuku soruları ve çözümleri (Soru 65-66).',
            filterKey: 'ekys_2024_mevzuat_anayasa',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_mevzuat_anayasa',
            name: '2023 EKYS Anayasa Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS Anayasa Hukuku soruları ve çözümleri (Soru 65-66).',
            filterKey: 'ekys_2023_mevzuat_anayasa',
            badge: '2023 Çıkmış'
          },
          {
            id: 'mevzuat_anayasa_tum',
            name: '🌟 Tüm Anayasa Soruları (Karma Test)',
            icon: '🎯',
            desc: 'Tüm yılların çıkmış 1982 Anayasası sorularından oluşan karma test.',
            filterKey: 'mevzuat_anayasa',
            badge: 'Karma Test'
          }
        ]
      },
      'mevzuat-657-subtopics': {
        parentKey: 'mevzuat',
        title: '📕 657 Sayılı DMK Çıkmış & Konu Testleri',
        desc: '657 sayılı Devlet Memurları Kanunu ile ilgili çıkmış sınav soruları:',
        items: [
          {
            id: 'ekys_2026_mevzuat_657',
            name: '2026 EKYS 657 Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS 657 DMK soruları ve çözümleri.',
            filterKey: 'ekys_2026_mevzuat_657',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_mevzuat_657',
            name: '2025 EKYS 657 Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS 657 DMK soruları ve çözümleri.',
            filterKey: 'ekys_2025_mevzuat_657',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_mevzuat_657',
            name: '2024 EKYS 657 Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS 657 DMK soruları ve çözümleri (Soru 67-68).',
            filterKey: 'ekys_2024_mevzuat_657',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_mevzuat_657',
            name: '2023 EKYS 657 Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS 657 DMK soruları ve çözümleri (Soru 67-68, 80).',
            filterKey: 'ekys_2023_mevzuat_657',
            badge: '2023 Çıkmış'
          },
          {
            id: 'ekys_2022_mevzuat_657',
            name: '2022 EKYS 657 Çıkmış Soruları',
            icon: '📜',
            desc: '2022 MEB EKYS 657 DMK soruları ve çözümleri (Soru 67-68, 80).',
            filterKey: 'ekys_2022_mevzuat_657',
            badge: '2022 Çıkmış'
          },
          {
            id: 'mevzuat_657_tum',
            name: '🌟 Tüm 657 Sayılı Kanun Soruları (Karma Test)',
            icon: '🎯',
            desc: 'Tüm yılların çıkmış 657 DMK sorularından oluşan karma test.',
            filterKey: 'mevzuat_657',
            badge: 'Karma Test'
          }
        ]
      },
      'mevzuat-1739-subtopics': {
        parentKey: 'mevzuat',
        title: '📙 1739 Sayılı Millî Eğitim Temel Kanunu Testleri',
        desc: '1739 sayılı Millî Eğitim Temel Kanunu ile ilgili çıkmış sınav soruları:',
        items: [
          {
            id: 'ekys_2026_mevzuat_1739',
            name: '2026 EKYS 1739 Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS 1739 Millî Eğitim Temel Kanunu soruları.',
            filterKey: 'ekys_2026_mevzuat_1739',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_mevzuat_1739',
            name: '2025 EKYS 1739 Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS 1739 Millî Eğitim Temel Kanunu soruları.',
            filterKey: 'ekys_2025_mevzuat_1739',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_mevzuat_1739',
            name: '2024 EKYS 1739 Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS 1739 Millî Eğitim Temel Kanunu soruları (Soru 69-70).',
            filterKey: 'ekys_2024_mevzuat_1739',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_mevzuat_1739',
            name: '2023 EKYS 1739 Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS 1739 Millî Eğitim Temel Kanunu soruları (Soru 69-70).',
            filterKey: 'ekys_2023_mevzuat_1739',
            badge: '2023 Çıkmış'
          },
          {
            id: 'ekys_2022_mevzuat_1739',
            name: '2022 EKYS 1739 Çıkmış Soruları',
            icon: '📜',
            desc: '2022 MEB EKYS 1739 Millî Eğitim Temel Kanunu soruları (Soru 69-70).',
            filterKey: 'ekys_2022_mevzuat_1739',
            badge: '2022 Çıkmış'
          },
          {
            id: 'mevzuat_1739_tum',
            name: '🌟 Tüm 1739 Sayılı Kanun Soruları (Karma Test)',
            icon: '🎯',
            desc: 'Tüm yılların çıkmış 1739 Millî Eğitim Temel Kanunu soruları.',
            filterKey: 'mevzuat_1739',
            badge: 'Karma Test'
          }
        ]
      },
      'mevzuat-222-subtopics': {
        parentKey: 'mevzuat',
        title: '📗 222 Sayılı İlköğretim ve Eğitim Kanunu Testleri',
        desc: '222 sayılı İlköğretim ve Eğitim Kanunu ile ilgili çıkmış sınav soruları:',
        items: [
          {
            id: 'ekys_2026_mevzuat_222',
            name: '2026 EKYS 222 Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS 222 İlköğretim Kanunu soruları.',
            filterKey: 'ekys_2026_mevzuat_222',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_mevzuat_222',
            name: '2025 EKYS 222 Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS 222 İlköğretim Kanunu soruları.',
            filterKey: 'ekys_2025_mevzuat_222',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_mevzuat_222',
            name: '2024 EKYS 222 Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS 222 İlköğretim Kanunu soruları (Soru 71-72).',
            filterKey: 'ekys_2024_mevzuat_222',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_mevzuat_222',
            name: '2023 EKYS 222 Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS 222 İlköğretim Kanunu soruları (Soru 71-72).',
            filterKey: 'ekys_2023_mevzuat_222',
            badge: '2023 Çıkmış'
          },
          {
            id: 'ekys_2022_mevzuat_222',
            name: '2022 EKYS 222 Çıkmış Soruları',
            icon: '📜',
            desc: '2022 MEB EKYS 222 İlköğretim Kanunu soruları (Soru 71-72).',
            filterKey: 'ekys_2022_mevzuat_222',
            badge: '2022 Çıkmış'
          },
          {
            id: 'mevzuat_222_tum',
            name: '🌟 Tüm 222 Sayılı Kanun Soruları (Karma Test)',
            icon: '🎯',
            desc: 'Tüm yılların çıkmış 222 İlköğretim ve Eğitim Kanunu soruları.',
            filterKey: 'mevzuat_222',
            badge: 'Karma Test'
          }
        ]
      },
      'mevzuat-5018-subtopics': {
        parentKey: 'mevzuat',
        title: '💰 5018 Sayılı Kamu Mali Yönetimi Kanunu Testleri',
        desc: '5018 sayılı Kamu Malî Yönetimi ve Kontrol Kanunu ile ilgili çıkmış sınav soruları:',
        items: [
          {
            id: 'ekys_2026_mevzuat_5018',
            name: '2026 EKYS 5018 Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS 5018 Kamu Mali Yönetimi soruları.',
            filterKey: 'ekys_2026_mevzuat_5018',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_mevzuat_5018',
            name: '2025 EKYS 5018 Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS 5018 Kamu Mali Yönetimi soruları.',
            filterKey: 'ekys_2025_mevzuat_5018',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_mevzuat_5018',
            name: '2024 EKYS 5018 Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS 5018 Kamu Mali Yönetimi soruları (Soru 73).',
            filterKey: 'ekys_2024_mevzuat_5018',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_mevzuat_5018',
            name: '2023 EKYS 5018 Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS 5018 Kamu Mali Yönetimi soruları (Soru 73).',
            filterKey: 'ekys_2023_mevzuat_5018',
            badge: '2023 Çıkmış'
          },
          {
            id: 'ekys_2022_mevzuat_5018',
            name: '2022 EKYS 5018 Çıkmış Soruları',
            icon: '📜',
            desc: '2022 MEB EKYS 5018 Kamu Mali Yönetimi soruları (Soru 73).',
            filterKey: 'ekys_2022_mevzuat_5018',
            badge: '2022 Çıkmış'
          },
          {
            id: 'mevzuat_5018_tum',
            name: '🌟 Tüm 5018 Sayılı Kanun Soruları (Karma Test)',
            icon: '🎯',
            desc: 'Tüm yılların çıkmış 5018 Kamu Mali Yönetimi ve Kontrol Kanunu soruları.',
            filterKey: 'mevzuat_5018',
            badge: 'Karma Test'
          }
        ]
      },
      'mevzuat-4483-subtopics': {
        parentKey: 'mevzuat',
        title: '⚖️ 4483 Sayılı Memurların Yargılanması Kanunu Testleri',
        desc: '4483 sayılı Memurlar ve Diğer Kamu Görevlilerinin Yargılanması Hakkında Kanun çıkmış soruları:',
        items: [
          {
            id: 'ekys_2026_mevzuat_4483',
            name: '2026 EKYS 4483 Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS 4483 Memurların Yargılanması soruları.',
            filterKey: 'ekys_2026_mevzuat_4483',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_mevzuat_4483',
            name: '2025 EKYS 4483 Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS 4483 Memurların Yargılanması soruları.',
            filterKey: 'ekys_2025_mevzuat_4483',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_mevzuat_4483',
            name: '2024 EKYS 4483 Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS 4483 Memurların Yargılanması soruları (Soru 74, 80).',
            filterKey: 'ekys_2024_mevzuat_4483',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_mevzuat_4483',
            name: '2023 EKYS 4483 Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS 4483 Memurların Yargılanması soruları (Soru 74).',
            filterKey: 'ekys_2023_mevzuat_4483',
            badge: '2023 Çıkmış'
          },
          {
            id: 'ekys_2022_mevzuat_4483',
            name: '2022 EKYS 4483 Çıkmış Soruları',
            icon: '📜',
            desc: '2022 MEB EKYS 4483 Memurların Yargılanması soruları (Soru 74).',
            filterKey: 'ekys_2022_mevzuat_4483',
            badge: '2022 Çıkmış'
          },
          {
            id: 'mevzuat_4483_tum',
            name: '🌟 Tüm 4483 Sayılı Kanun Soruları (Karma Test)',
            icon: '🎯',
            desc: 'Tüm yılların çıkmış 4483 Memurların Yargılanması Kanunu soruları.',
            filterKey: 'mevzuat_4483',
            badge: 'Karma Test'
          }
        ]
      },
      'mevzuat-4688-subtopics': {
        parentKey: 'mevzuat',
        title: '🤝 4688 Sayılı Kamu Görevlileri Sendikaları Testleri',
        desc: '4688 sayılı Kamu Görevlileri Sendikaları ve Toplu Sözleşme Kanunu çıkmış soruları:',
        items: [
          {
            id: 'ekys_2026_mevzuat_4688',
            name: '2026 EKYS 4688 Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS 4688 Sendikalar Kanunu soruları.',
            filterKey: 'ekys_2026_mevzuat_4688',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_mevzuat_4688',
            name: '2025 EKYS 4688 Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS 4688 Sendikalar Kanunu soruları.',
            filterKey: 'ekys_2025_mevzuat_4688',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_mevzuat_4688',
            name: '2024 EKYS 4688 Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS 4688 Sendikalar Kanunu soruları (Soru 75).',
            filterKey: 'ekys_2024_mevzuat_4688',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_mevzuat_4688',
            name: '2023 EKYS 4688 Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS 4688 Sendikalar Kanunu soruları (Soru 75).',
            filterKey: 'ekys_2023_mevzuat_4688',
            badge: '2023 Çıkmış'
          },
          {
            id: 'ekys_2022_mevzuat_4688',
            name: '2022 EKYS 4688 Çıkmış Soruları',
            icon: '📜',
            desc: '2022 MEB EKYS 4688 Sendikalar Kanunu soruları (Soru 75).',
            filterKey: 'ekys_2022_mevzuat_4688',
            badge: '2022 Çıkmış'
          },
          {
            id: 'mevzuat_4688_tum',
            name: '🌟 Tüm 4688 Sayılı Kanun Soruları (Karma Test)',
            icon: '🎯',
            desc: 'Tüm yılların çıkmış 4688 Sendikalar ve Toplu Sözleşme Kanunu soruları.',
            filterKey: 'mevzuat_4688',
            badge: 'Karma Test'
          }
        ]
      },
      'mevzuat-5442-subtopics': {
        parentKey: 'mevzuat',
        title: '🏢 5442 Sayılı İl İdaresi Kanunu Testleri',
        desc: '5442 sayılı İl İdaresi Kanunu ile ilgili çıkmış sınav soruları:',
        items: [
          {
            id: 'ekys_2026_mevzuat_5442',
            name: '2026 EKYS 5442 Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS 5442 İl İdaresi Kanunu soruları.',
            filterKey: 'ekys_2026_mevzuat_5442',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_mevzuat_5442',
            name: '2025 EKYS 5442 Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS 5442 İl İdaresi Kanunu soruları.',
            filterKey: 'ekys_2025_mevzuat_5442',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_mevzuat_5442',
            name: '2024 EKYS 5442 Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS 5442 İl İdaresi Kanunu soruları (Soru 76).',
            filterKey: 'ekys_2024_mevzuat_5442',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_mevzuat_5442',
            name: '2023 EKYS 5442 Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS 5442 İl İdaresi Kanunu soruları (Soru 76).',
            filterKey: 'ekys_2023_mevzuat_5442',
            badge: '2023 Çıkmış'
          },
          {
            id: 'ekys_2022_mevzuat_5442',
            name: '2022 EKYS 5442 Çıkmış Soruları',
            icon: '📜',
            desc: '2022 MEB EKYS 5442 İl İdaresi Kanunu soruları (Soru 76).',
            filterKey: 'ekys_2022_mevzuat_5442',
            badge: '2022 Çıkmış'
          },
          {
            id: 'mevzuat_5442_tum',
            name: '🌟 Tüm 5442 Sayılı Kanun Soruları (Karma Test)',
            icon: '🎯',
            desc: 'Tüm yılların çıkmış 5442 İl İdaresi Kanunu soruları.',
            filterKey: 'mevzuat_5442',
            badge: 'Karma Test'
          }
        ]
      },
      'mevzuat-3071-subtopics': {
        parentKey: 'mevzuat',
        title: '📄 3071 Sayılı Dilekçe Hakkı Kanunu Testleri',
        desc: '3071 sayılı Dilekçe Hakkının Kullanılmasına Dair Kanun çıkmış soruları:',
        items: [
          {
            id: 'ekys_2026_mevzuat_3071',
            name: '2026 EKYS 3071 Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS 3071 Dilekçe Kanunu soruları.',
            filterKey: 'ekys_2026_mevzuat_3071',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_mevzuat_3071',
            name: '2025 EKYS 3071 Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS 3071 Dilekçe Kanunu soruları.',
            filterKey: 'ekys_2025_mevzuat_3071',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_mevzuat_3071',
            name: '2024 EKYS 3071 Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS 3071 Dilekçe Kanunu soruları (Soru 77).',
            filterKey: 'ekys_2024_mevzuat_3071',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_mevzuat_3071',
            name: '2023 EKYS 3071 Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS 3071 Dilekçe Kanunu soruları (Soru 77).',
            filterKey: 'ekys_2023_mevzuat_3071',
            badge: '2023 Çıkmış'
          },
          {
            id: 'ekys_2022_mevzuat_3071',
            name: '2022 EKYS 3071 Çıkmış Soruları',
            icon: '📜',
            desc: '2022 MEB EKYS 3071 Dilekçe Kanunu soruları (Soru 77).',
            filterKey: 'ekys_2022_mevzuat_3071',
            badge: '2022 Çıkmış'
          },
          {
            id: 'mevzuat_3071_tum',
            name: '🌟 Tüm 3071 Sayılı Kanun Soruları (Karma Test)',
            icon: '🎯',
            desc: 'Tüm yılların çıkmış 3071 Dilekçe Hakkı Kanunu soruları.',
            filterKey: 'mevzuat_3071',
            badge: 'Karma Test'
          }
        ]
      },
      'mevzuat-1cbk-subtopics': {
        parentKey: 'mevzuat',
        title: '🏛️ 1 Sayılı CBK (Millî Eğitim Bakanlığı) Testleri',
        desc: '1 sayılı Cumhurbaşkanlığı Teşkilatı Kararnamesi MEB teşkilat ve birimleri soruları:',
        items: [
          {
            id: 'ekys_2026_mevzuat_1cbk',
            name: '2026 EKYS 1 Nolu CBK Çıkmış Soruları',
            icon: '📜',
            desc: '2026 Mart MEB EKYS 1 Sayılı CBK soruları.',
            filterKey: 'ekys_2026_mevzuat_1cbk',
            badge: '2026 Çıkmış'
          },
          {
            id: 'ekys_2025_mevzuat_1cbk',
            name: '2025 EKYS 1 Nolu CBK Çıkmış Soruları',
            icon: '📜',
            desc: '2025 MEB EKYS 1 Sayılı CBK soruları.',
            filterKey: 'ekys_2025_mevzuat_1cbk',
            badge: '2025 Çıkmış'
          },
          {
            id: 'ekys_2024_mevzuat_1cbk',
            name: '2024 EKYS 1 Nolu CBK Çıkmış Soruları',
            icon: '📜',
            desc: '2024 MEB EKYS 1 Sayılı CBK soruları (Soru 78-79).',
            filterKey: 'ekys_2024_mevzuat_1cbk',
            badge: '2024 Çıkmış'
          },
          {
            id: 'ekys_2023_mevzuat_1cbk',
            name: '2023 EKYS 1 Nolu CBK Çıkmış Soruları',
            icon: '📜',
            desc: '2023 MEB EKYS 1 Sayılı CBK soruları (Soru 78-79).',
            filterKey: 'ekys_2023_mevzuat_1cbk',
            badge: '2023 Çıkmış'
          },
          {
            id: 'mevzuat_1cbk_tum',
            name: '🌟 Tüm 1 Sayılı CBK Soruları (Karma Test)',
            icon: '🎯',
            desc: 'Tüm yılların çıkmış 1 Sayılı Cumhurbaşkanlığı Kararnamesi soruları.',
            filterKey: 'mevzuat_1cbk',
            badge: 'Karma Test'
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
            badge: '80 Soru Hazır 🎯'
          },
          {
            id: 'ekys_2025',
            name: '2025 EKYS Çıkmış Sınavı',
            icon: '📜',
            desc: '2025 MEB Yönetici Seçme Sınavı soruları ve detaylı çözümleri.',
            filterKey: 'ekys_2025',
            badge: '80 Soru Hazır 🎯'
          },
          {
            id: 'ekys_2024',
            name: '2024 EKYS Çıkmış Sınavı',
            icon: '📜',
            desc: '2024 MEB Yönetici Seçme Sınavı soruları ve detaylı çözümleri.',
            filterKey: 'ekys_2024',
            badge: '80 Soru Hazır 🎯'
          },
          {
            id: 'ekys_2023',
            name: '2023 EKYS Çıkmış Sınavı',
            icon: '📜',
            desc: '2023 MEB Yönetici Seçme Sınavı soruları ve detaylı çözümleri.',
            filterKey: 'ekys_2023',
            badge: '80 Soru Hazır 🎯'
          },
          {
            id: 'ekys_2022',
            name: '2022 EKYS Çıkmış Sınavı',
            icon: '📜',
            desc: '2022 MEB Yönetici Seçme Sınavı soruları ve detaylı çözümleri.',
            filterKey: 'ekys_2022',
            badge: '80 Soru Hazır 🎯'
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
            desc: '2019 MEB Yönetici Seçme Sınavı soruları ve detaylı çözümleri.',
            filterKey: 'ekys_2019',
            badge: '80 Soru Hedef'
          }
        ]
      },
      'egitim': {
        title: '🎓 Eğitim Bilimleri ve Yönetimi Testleri',
        desc: 'Eğitim Yönetimi, Liderlik, Denetim, Pedagoji, Ölçme ve Değerler Eğitimi Testleri:',
        items: [
          {
            id: 'egitim_prog_gel_1',
            name: '🎯 Program Geliştirme Testi 1',
            icon: '🎯',
            desc: 'Program Okuryazarlığı, Temel Kavramlar, Program Türleri, Felsefeler, İhtiyaç Analizi ve Tasarım Yaklaşımları.',
            filterKey: 'egitim_prog_gel_1',
            badge: '19 Soru • Konu Testi'
          },
          {
            id: 'egitim_yonetimi_cat',
            name: '🎓 Eğitim Yönetimi, Liderlik & Okul Denetimi',
            icon: '🎓',
            desc: 'Yönetim Süreçleri, Liderlik Kuramları, Örgütsel Davranış, İletişim ve Okul Denetimi.',
            filterKey: 'egitim_yonetimi',
            badge: '190+ Soru'
          },
          {
            id: 'egitim_bilimleri_cat',
            name: '📚 Öğrenme Kuramları, Gelişim & Ölçme-Değerlendirme',
            icon: '📚',
            desc: 'Öğrenme Kuramları, Gelişim Psikolojisi, Program Geliştirme ve Ölçme Araçları.',
            filterKey: 'egitim_bilimleri',
            badge: '140+ Soru'
          },
          {
            id: 'degerler_egitimi_cat',
            name: '💎 Değerler Eğitimi & Meslek Etiği',
            icon: '💎',
            desc: 'Değerler Eğitimi Yaklaşımları, Kohlberg Ahlak Gelişimi ve Kamu Görevlileri Etik İlkeleri.',
            filterKey: 'degerler',
            badge: '45+ Soru'
          },
          {
            id: 'egitim_cikmis_cat',
            name: '📜 2019 - 2025 Çıkmış Eğitim Yönetimi & Bilimleri Soruları',
            icon: '📜',
            desc: 'Tüm resmî EKYS sınavlarında çıkmış 215+ Eğitim Yönetimi ve Eğitim Bilimleri sorusu.',
            filterKey: 'egitim_cikmis',
            badge: '215 Soru Çıkmış'
          },
          {
            id: 'egitim_tum',
            name: '🏆 Tüm Eğitim Bilimleri & Yönetim Karma Test',
            icon: '🎯',
            desc: 'Veritabanındaki tüm 290+ Eğitim Bilimleri ve Yönetimi sorusundan oluşan büyük soru havuzu.',
            filterKey: 'egitim_tum',
            badge: '290+ Soru Karma'
          }
        ]
      },
      'maarif': {
        title: '🌟 Türkiye Yüzyılı Maarif Modeli (2026 EKYS Soru 41-64)',
        desc: 'İlk kez 2026 EKYS sınavında sorulan 24 adet resmî Türkiye Yüzyılı Maarif Modeli sorusu:',
        items: [
          {
            id: 'maarif_2026',
            name: '🌟 2026 EKYS Maarif Modeli Soruları (Soru 41-64)',
            icon: '🌟',
            desc: '2026 Mart MEB EKYS sınavında sorulan 24 resmî Maarif Modeli sorusunun tamamı.',
            filterKey: 'maarif',
            badge: '24 Soru (Tam Liste)'
          },
          {
            id: 'maarif_temel',
            name: '📑 Öğretim Programları Ortak Metni & Beceriler',
            icon: '📑',
            desc: 'Bütüncül Eğitim, Erdem-Değer-Eylem, Kavramsal Beceriler ve Sosyal-Duygusal Öğrenme.',
            filterKey: 'maarif',
            badge: '24 Soru'
          },
          {
            id: 'maarif_tum',
            name: '🏆 Maarif Modeli Deneme Sınavı',
            icon: '🎯',
            desc: '2026 ve 2027 EKYS Maarif Modeli soruları odaklı pratik ve sınav modu.',
            filterKey: 'maarif',
            badge: '24 Soru'
          }
        ]
      },
      'denemeler': {
        title: '🎯 EKYS Deneme Sınavları (100 Tam Puan)',
        desc: 'Gerçek ÖSYM EKYS sınav standartlarında, 100 tam puan üzerinden değerlendirilen genel ve ders bazlı deneme sınavları:',
        items: [
          {
            id: 'deneme_80_genel',
            name: '🏆 80 Soruluk Resmî Format EKYS Genel Deneme Sınavı',
            icon: '🏆',
            desc: 'Tüm sınav konularından dengeli 80 soru, 150 dakika sınav süresi ve 100 tam puan üzerinden genel deneme simülasyonu.',
            filterKey: 'all_mock_80',
            badge: '80 Soru • 150 Dk'
          },
          {
            id: 'deneme_maarif',
            name: '🌟 Türkiye Yüzyılı Maarif Modeli Özel Deneme Sınavı',
            icon: '🌟',
            desc: '2026-2027 EKYS yeni müfredat Maarif Modeli ve Ortak Metin odaklı 24 soruluk özel alan denemesi.',
            filterKey: 'maarif',
            badge: '24 Soru • Maarif'
          },
          {
            id: 'deneme_mevzuat',
            name: '⚖️ Mevzuat & Kanunlar Özel Deneme Sınavı',
            icon: '⚖️',
            desc: 'Anayasa, 657, 1739, 222, 5018, 4483, 4688, 5442, 3071 ve 1 Sayılı CBK kapsamlı mevzuat denemesi.',
            filterKey: 'mevzuat_tum',
            badge: 'Mevzuat Özel'
          },
          {
            id: 'deneme_tarih',
            name: '⚔️ Tarih, İnkılap Tarihi & Atatürkçülük Deneme Sınavı',
            icon: '⚔️',
            desc: 'İlk Türk Devletleri, Türk-İslam, Osmanlı, Milli Mücadele, Atatürk İlkeleri ve İnkılap Tarihi denemesi.',
            filterKey: 'inkilap_tum',
            badge: 'Tarih & İnkılap'
          },
          {
            id: 'deneme_egitim',
            name: '🎓 Eğitim Bilimleri & Yönetimi Özel Deneme Sınavı',
            icon: '🎓',
            desc: 'Eğitim Yönetimi Süreçleri, Liderlik Kuramları, Örgütsel Davranış, Ölçme ve Değerlendirme denemesi.',
            filterKey: 'egitim_tum',
            badge: 'Eğitim Bilimleri'
          },
          {
            id: 'deneme_genel_kultur',
            name: '🌍 Genel Kültür (Coğrafya, Yurttaşlık, Güncel) Deneme Sınavı',
            icon: '🌍',
            desc: 'Türkiye Coğrafyası, Temel Hukuk, Anayasa Esasları ve Güncel Sosyoekonomik Gelişmeler denemesi.',
            filterKey: 'genel_kultur_tum',
            badge: 'Genel Kültür'
          }
        ]
      }
    };
  }

  isScoreApplicable(test) {
    if (!test) return false;
    if (test.isScored !== undefined && typeof test.isScored === 'boolean') return test.isScored;
    if (test.isDeneme || test.isCikmis) return true;
    const title = (test.title || test.name || '').toLowerCase();
    const filterKey = (test.filterKey || test.topicId || '').toLowerCase();
    
    // Çıkmış sorular (Örn: 2026 EKYS Çıkmış Sınavı, ekys_2025, ekys_2024 vb.)
    if (title.includes('çıkmış') || title.includes('ekys') || filterKey.includes('ekys') || filterKey.includes('cikmis')) {
      return true;
    }
    // Deneme testleri (Örn: Genel Deneme, Maarif Deneme Sınavı vb.)
    if (title.includes('deneme') || filterKey.includes('deneme') || (test.totalQuestions && test.totalQuestions >= 80)) {
      return true;
    }
    return false;
  }

  getQuestionsForFilter(filterKey) {
    let allQuestions = [];
    if (typeof window !== 'undefined' && Array.isArray(window.EKYS_EXTRACTED_QUESTIONS) && window.EKYS_EXTRACTED_QUESTIONS.length > 0) {
      allQuestions = [...window.EKYS_EXTRACTED_QUESTIONS];
    } else if (window.storageService && typeof window.storageService.getQuestions === 'function') {
      allQuestions = window.storageService.getQuestions();
    }

    if (!filterKey || filterKey === 'all') {
      return [...allQuestions];
    }

    return allQuestions.filter(q => {
      const qText = (q.questionText || q.question || '').toLowerCase();
      const tName = (q.topicName || q.testTitle || '').toLowerCase();
      const tId = (q.topicId || q.testId || '').toLowerCase();
      const isCikmis = tName.includes('ekys') || tName.includes('çıkmış') || tId.includes('ekys');
      const qNum = q.questionNumber || 0;

      // 1. Özel Video Tarama & Yeni Münferit Coğrafya & Eğitim Bilimleri Testleri
      if (filterKey === 'egitim_prog_gel_1' || filterKey === 'prog_gel_test_1') return (q.testId === 'egitim_prog_gel_1' || tId === 'egitim_prog_gel_1' || (tName.includes('program geliştirme') && tName.includes('1')));
      if (filterKey === 'cogr1') return (q.testId === 'cogr1' || tId === 'cogr_tarama_1' || (tName.includes('tarama 1') && tName.includes('coğrafya')));
      if (filterKey === 'cogr2') return (q.testId === 'cogr2' || tId === 'cogr_tarama_2' || (tName.includes('tarama 2') && tName.includes('coğrafya')));
      if (filterKey === 'cogr3') return (q.testId === 'cogr3' || tId === 'cogr_tarama_3' || (tName.includes('tarama 3') && tName.includes('coğrafya')));
      if (filterKey === 'cogr_tarama') return (q.testId === 'cogr1' || q.testId === 'cogr2' || q.testId === 'cogr3' || tId.startsWith('cogr_tarama'));

      // Münferit Coğrafya Testleri (Örn: cogr_test_22 Tarım, cogr_test_23 Hayvancılık vb.)
      if (filterKey.startsWith('cogr_test_')) {
        return q.testId === filterKey;
      }

      // Konu Bazlı Coğrafya Karma Filtreleri
      if (filterKey === 'cogr_ekonomi') return q.topicId === 'cogr_ekonomi' || (q.testId && ['cogr_test_22', 'cogr_test_23', 'cogr_test_24', 'cogr_test_25'].includes(q.testId));
      if (filterKey === 'cogr_yer') return q.topicId === 'cogr_yer' || (q.testId && ['cogr_test_2', 'cogr_test_3', 'cogr_test_5', 'cogr_test_6', 'cogr_test_7', 'cogr_test_8', 'cogr_test_9', 'cogr_test_10', 'cogr_test_11', 'cogr_test_15', 'cogr_test_16'].includes(q.testId));
      if (filterKey === 'cogr_iklim') return q.topicId === 'cogr_iklim' || (q.testId && ['cogr_test_17', 'cogr_test_18_1', 'cogr_test_18_2'].includes(q.testId));
      if (filterKey === 'cogr_toprak_afet') return q.topicId === 'cogr_toprak_afet' || (q.testId && ['cogr_test_12', 'cogr_test_13', 'cogr_test_14'].includes(q.testId));
      if (filterKey === 'cogr_nufus') return q.topicId === 'cogr_nufus' || (q.testId && ['cogr_test_19', 'cogr_test_20', 'cogr_test_21'].includes(q.testId));
      if (filterKey === 'cogr_konum') return q.topicId === 'cogr_konum' || (q.testId && ['cogr_test_1', 'cogr_test_4'].includes(q.testId));
      if (filterKey === 'cogr_cikmis') return q.testId === 'cogr_test_cikmis_secki' || (isCikmis && ((qNum >= 6 && qNum <= 12) || tName.includes('coğrafya')));
      if (filterKey === 'tarih1') return (q.testId === 'tarih1' || tId === 'tarih_tarama_1' || (tName.includes('tarama 1') && tName.includes('tarih')));
      if (filterKey === 'tarih2') return (q.testId === 'tarih2' || tId === 'tarih_tarama_2' || (tName.includes('tarama 2') && tName.includes('tarih')));

      // 2. Yıl + Konu Bazlı Çıkmış Soru Filtreleri (Örn: ekys_2024_mevzuat_222, ekys_2023_cogr, ekys_2025_tarih)
      const yrMatch = filterKey.match(/^ekys_(\d{4})_(.+)$/);
      if (yrMatch) {
        const year = yrMatch[1];
        const sub = yrMatch[2];
        const isYear = tName.includes(year) || tId.includes(year) || (q.testId && q.testId.includes(year)) || (q.id && q.id.includes(year));
        if (!isYear) return false;

        if (sub === 'tarih') return (qNum >= 1 && qNum <= 6) || (tName.includes('tarih') && !tName.includes('inkılap'));
        if (sub === 'cogr' || sub === 'cografya') return (qNum >= 6 && qNum <= 12) || tName.includes('coğrafya');
        if (sub === 'yurttaslik') return (qNum >= 11 && qNum <= 14) || tName.includes('yurttaşlık') || qText.includes('hukuk') || qText.includes('normlar') || qText.includes('yurttaşlık');
        if (sub === 'guncel') return (qNum >= 15 && qNum <= 16) || tName.includes('güncel') || qText.includes('unesco') || qText.includes('gözlem') || qText.includes('gordion') || qText.includes('mevlânâ') || qText.includes('togg');
        if (sub === 'inkilap') return (qNum >= 17 && qNum <= 28) || tName.includes('inkılap');
        if (sub === 'degerler') return (qNum >= 29 && qNum <= 32) || tName.includes('değerler') || tName.includes('etik');
        if (sub === 'egitim') return (qNum >= 33 && qNum <= 40) || tName.includes('eğitim bilimleri');
        if (sub === 'yonetim') return (qNum >= 41 && qNum <= 64) || tName.includes('yönetim') || tName.includes('denetim');
        if (sub === 'mevzuat_anayasa') return qNum === 65 || qNum === 66 || tId.includes('anayasa') || qText.includes('anayasa') || qText.includes('1982');
        if (sub === 'mevzuat_657') return qNum === 67 || qNum === 68 || qNum === 80 || tId.includes('657') || qText.includes('657');
        if (sub === 'mevzuat_1739') return qNum === 69 || qNum === 70 || tId.includes('1739') || qText.includes('1739');
        if (sub === 'mevzuat_222') return qNum === 71 || qNum === 72 || tId.includes('222') || qText.includes('222');
        if (sub === 'mevzuat_5018') return qNum === 73 || tId.includes('5018') || qText.includes('5018');
        if (sub === 'mevzuat_4483') return qNum === 74 || (qNum === 80 && year !== '2023') || tId.includes('4483') || qText.includes('4483');
        if (sub === 'mevzuat_4688') return qNum === 75 || tId.includes('4688') || qText.includes('4688');
        if (sub === 'mevzuat_5442') return qNum === 76 || tId.includes('5442') || qText.includes('5442');
        if (sub === 'mevzuat_3071') return qNum === 77 || tId.includes('3071') || qText.includes('3071');
        if (sub === 'mevzuat_1cbk') return qNum === 78 || qNum === 79 || (qNum === 80 && year === '2026') || tId.includes('1cbk') || qText.includes('cbk') || qText.includes('kararname');
      }

      // 3. Tam Yıl Çıkmış Sınavlar (Örn: ekys_2026, ekys_2025, ekys_2024, ekys_2023)
      if (filterKey.startsWith('ekys_')) {
        const year = filterKey.replace('ekys_', '');
        return tName.includes(year) || tId.includes(year) || (q.testId && q.testId.includes(year)) || (q.id && q.id.includes(year));
      }

      // 4. Genel Alan Filtreleri (Tüm Yıllar Karma Testler)
      if (filterKey === 'cografya') {
        if (tId.includes('cogr') || tName.includes('coğrafya')) return true;
        if (isCikmis && qNum >= 6 && qNum <= 12) return true;
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
        if (isCikmis && qNum >= 11 && qNum <= 14) return true;
        if (tId.includes('yurttaslik') || qText.includes('yurttaşlık') || qText.includes('normlar') || qText.includes('hukuk') || qText.includes('hsk')) return true;
        return false;
      }

      if (filterKey === 'guncel') {
        if (isCikmis && qNum >= 15 && qNum <= 16) return true;
        if (tId.includes('guncel') || qText.includes('unesco') || qText.includes('nobel') || qText.includes('güncel') || qText.includes('gordion') || qText.includes('mevlânâ') || qText.includes('togg')) return true;
        return false;
      }

      if (filterKey === 'inkilap') {
        if (isCikmis && qNum >= 17 && qNum <= 28) return true;
        if (tId.includes('inkilap') || qText.includes('atatürk') || qText.includes('nutuk') || qText.includes('lozan') || qText.includes('amasya') || qText.includes('erzurum') || qText.includes('sivas') || qText.includes('cumhuriyetçilik') || qText.includes('laiklik')) return true;
        return false;
      }

      if (filterKey === 'inkilap_cikmis' || filterKey === 'tarih_cikmis') {
        return isCikmis && ((qNum >= 1 && qNum <= 6) || (qNum >= 17 && qNum <= 28));
      }

      if (filterKey === 'tarih_tum') {
        return (isCikmis && qNum >= 1 && qNum <= 28) || tId.includes('tarih') || tId.includes('inkilap');
      }

      if (filterKey === 'genel_kultur_tum') {
        return (isCikmis && qNum >= 6 && qNum <= 16) || tId.includes('cogr') || tId.includes('yurttaslik') || tId.includes('guncel');
      }

      if (filterKey === 'degerler' || filterKey === 'degerler_egitimi') {
        if (isCikmis && qNum >= 29 && qNum <= 32) return true;
        if (tId.includes('degerler') || qText.includes('değer') || qText.includes('etik') || qText.includes('kohlberg')) return true;
        return false;
      }

      const is2026 = tName.includes('2026') || tId.includes('2026') || (q.id && q.id.includes('2026'));

      if (filterKey === 'egitim_bilimleri' || filterKey === 'egitim') {
        if (isCikmis && qNum >= 33 && qNum <= 40) return true;
        if (tId.includes('egitim_bilimleri') || qText.includes('öğretim') || qText.includes('rehberlik') || qText.includes('ölçme') || qText.includes('yapılandırmacı')) return true;
        return false;
      }

      if (filterKey === 'egitim_yonetimi' || filterKey === 'yonetim') {
        if (isCikmis && !is2026 && qNum >= 41 && qNum <= 64) return true;
        if (tId.includes('egitim_yonetimi') || tId.includes('yonetim') || qText.includes('yönetim') || qText.includes('liderlik') || qText.includes('denetim') || qText.includes('örgüt') || qText.includes('okul yönetimi')) return true;
        return false;
      }

      if (filterKey === 'maarif') {
        if (is2026 && qNum >= 41 && qNum <= 64) return true;
        if (qText.includes('maarif modeli') || qText.includes('öğretim programları ortak metni')) return true;
        return false;
      }

      if (filterKey === 'egitim_cikmis') {
        return isCikmis && ((qNum >= 29 && qNum <= 40) || (!is2026 && qNum >= 41 && qNum <= 64));
      }

      if (filterKey === 'egitim_tum') {
        return (isCikmis && ((qNum >= 29 && qNum <= 40) || (!is2026 && qNum >= 41 && qNum <= 64))) || tId.includes('egitim') || tId.includes('yonetim') || tId.includes('degerler');
      }

      // 5. Kanun Bazlı Karma Filtreler
      if (filterKey === 'mevzuat_anayasa') {
        return (isCikmis && (qNum === 65 || qNum === 66)) || tId.includes('anayasa') || qText.includes('anayasa') || qText.includes('1982');
      }
      if (filterKey === 'mevzuat_657') {
        return (isCikmis && (qNum === 67 || qNum === 68 || qNum === 80)) || tId.includes('657') || qText.includes('657');
      }
      if (filterKey === 'mevzuat_1739') {
        return (isCikmis && (qNum === 69 || qNum === 70)) || tId.includes('1739') || qText.includes('1739');
      }
      if (filterKey === 'mevzuat_222') {
        return (isCikmis && (qNum === 71 || qNum === 72)) || tId.includes('222') || qText.includes('222');
      }
      if (filterKey === 'mevzuat_5018') {
        return (isCikmis && qNum === 73) || tId.includes('5018') || qText.includes('5018');
      }
      if (filterKey === 'mevzuat_4483') {
        return (isCikmis && (qNum === 74 || qNum === 80)) || tId.includes('4483') || qText.includes('4483');
      }
      if (filterKey === 'mevzuat_4688') {
        return (isCikmis && qNum === 75) || tId.includes('4688') || qText.includes('4688');
      }
      if (filterKey === 'mevzuat_5442') {
        return (isCikmis && qNum === 76) || tId.includes('5442') || qText.includes('5442');
      }
      if (filterKey === 'mevzuat_3071') {
        return (isCikmis && qNum === 77) || tId.includes('3071') || qText.includes('3071');
      }
      if (filterKey === 'mevzuat_1cbk') {
        return (isCikmis && (qNum === 78 || qNum === 79 || qNum === 80)) || tId.includes('1cbk') || qText.includes('kararname') || qText.includes('cbk');
      }
      if (filterKey === 'mevzuat') {
        if (isCikmis && qNum >= 65 && qNum <= 80) return true;
        if (qText.includes('kanun') || qText.includes('mevzuat') || qText.includes('yönetmelik')) return true;
        return false;
      }

      return true;
    });
  }

  getAllTestItemsForCategory(categoryKey) {
    const dataMap = this.getSubTopicData();
    const tests = [];
    const visited = new Set();

    const collect = (key) => {
      if (!key || visited.has(key) || !dataMap[key]) return;
      visited.add(key);
      const group = dataMap[key];
      if (group && Array.isArray(group.items)) {
        group.items.forEach(item => {
          if (item.targetSubtopic) {
            collect(item.targetSubtopic);
          } else {
            tests.push(item);
          }
        });
      }
    };

    collect(categoryKey);
    return tests;
  }

  openSubTopicModal(categoryKey) {
    const dataMap = this.getSubTopicData();
    const data = dataMap[categoryKey];
    if (!data) return;

    const modalTitleEl = document.getElementById('subtopic-modal-title');
    const modalDescEl = document.getElementById('subtopic-modal-desc');
    const modalGridEl = document.getElementById('subtopic-modal-cards-grid') || document.getElementById('subtopic-items-grid');

    let backBtnHtml = '';
    if (data.parentKey) {
      backBtnHtml = `<button class="btn btn-secondary btn-sm" style="padding: 4px 10px; font-size: 0.8rem; margin-right: 8px; border-radius: 6px;" onclick="app.openSubTopicModal('${data.parentKey}')">⬅️ Geri Dön</button>`;
    }

    if (modalTitleEl) modalTitleEl.innerHTML = `${backBtnHtml}<span>📚</span> ${data.title}`;
    if (modalDescEl) modalDescEl.textContent = data.desc;

    const history = window.storageService ? window.storageService.getQuizHistory() : [];

    if (modalGridEl) {
      modalGridEl.innerHTML = data.items.map(item => {
        const questions = this.getQuestionsForFilter(item.filterKey);
        const qCount = questions.length;

        // Bu alt konuya / teste ait çözülen geçmiş
        const cleanItemName = (item.name || '').replace(/^[^\w\s\dçğıöşüÇĞİÖŞÜ]+/, '').trim().toLowerCase();
        const itemHistory = history.filter(h => {
          if (h.topicId && (h.topicId === item.filterKey || h.topicId === item.id || h.topicId.startsWith(item.filterKey))) return true;
          const hTitle = (h.title || '').replace(/^[^\w\s\dçğıöşüÇĞİÖŞÜ]+/, '').trim().toLowerCase();
          if (hTitle && cleanItemName && (hTitle.includes(cleanItemName) || cleanItemName.includes(hTitle))) return true;
          return false;
        });

        let itemSolved = 0;
        let itemCorrect = 0;
        let itemWrong = 0;
        itemHistory.forEach(h => {
          const c = (h.correctCount || 0);
          const w = (h.wrongCount || 0);
          const count = h.totalQuestions || (c + w + (h.emptyCount || 0)) || 0;
          itemSolved += count;
          itemCorrect += c;
          itemWrong += w;
        });

        const itemAccuracy = itemSolved > 0 ? Math.round((itemCorrect / itemSolved) * 100) : 0;

        // Eğer bu bir alt kategori kartı ise (örneğin Coğrafya Testleri, Tarih Testleri vb.)
        if (item.targetSubtopic) {
          const subTests = this.getAllTestItemsForCategory(item.targetSubtopic);
          const subTotalTests = subTests.length;
          let subSolvedCount = 0;
          subTests.forEach(st => {
            const stName = (st.name || '').replace(/^[^\w\s\dçğıöşüÇĞİÖŞÜ]+/, '').trim().toLowerCase();
            const filterKey = (st.filterKey || '').toLowerCase().trim();
            const isSolved = history.some(h => {
              const hTitle = (h.title || '').replace(/^[^\w\s\dçğıöşüÇĞİÖŞÜ]+/, '').trim().toLowerCase();
              const hTopic = (h.topicId || '').toLowerCase().trim();
              return (hTopic && (hTopic === filterKey || hTopic.startsWith(filterKey))) ||
                     (hTitle && stName && (hTitle.includes(stName) || stName.includes(hTitle)));
            });
            if (isSolved) subSolvedCount++;
          });
          const subTestRate = subTotalTests > 0 ? Math.min(100, Math.round((subSolvedCount / subTotalTests) * 100)) : 0;

          return `
            <div class="card" style="border: 1px solid var(--border-active); background: rgba(30, 41, 59, 0.85); display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: all 0.2s;" onclick="app.openSubTopicModal('${item.targetSubtopic}')" onmouseover="this.style.borderColor='#6366f1'; this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--border-active)'; this.style.transform='none'">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                  <span style="font-size: 30px;">${item.icon}</span>
                  <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    <span class="badge badge-info" style="font-size: 0.72rem; font-weight: 700;">
                      ${qCount > 0 ? qCount + ' Soru Mevcut' : 'Testler Hazır'}
                    </span>
                    <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc; font-size: 0.72rem;">
                      ${item.badge}
                    </span>
                  </div>
                </div>
                <h3 style="font-size: 1.08rem; font-weight: 700; margin-bottom: 6px; color: #ffffff;">${item.name}</h3>
                <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 14px;">
                  ${item.desc}
                </p>

                <!-- Sadece Test Çözülme Oranı (Üst Kart) -->
                <div style="margin-bottom: 14px; background: rgba(0,0,0,0.25); padding: 10px 12px; border-radius: 8px;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 5px;">
                    <span style="color: #cbd5e1;">📋 Test Çözülme Oranı:</span>
                    <span style="color: #38bdf8;">%${subTestRate} (${subSolvedCount}/${subTotalTests} Test)</span>
                  </div>
                  <div class="progress-bar" style="height: 6px;">
                    <div class="progress-fill" style="width: ${subTestRate}%; background: linear-gradient(90deg, #0ea5e9, #38bdf8);"></div>
                  </div>
                </div>
              </div>
              <div style="display: flex; gap: 6px; margin-top: auto; flex-wrap: wrap;" onclick="event.stopPropagation()">
                <button class="btn btn-primary btn-sm" style="flex: 2; font-weight: 700; background: linear-gradient(135deg, #6366f1, #8b5cf6);" onclick="app.openSubTopicModal('${item.targetSubtopic}')">
                  📂 Testleri Listele &amp; Seç
                </button>
                <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="app.startSubTopicQuiz('${item.filterKey}', '${item.name} (Karma)', 'practice')" title="Tüm soruları karma çöz">
                  🎯 Karma
                </button>
              </div>
            </div>
          `;
        }

        // Bireysel / Tekil Çözülen Test Kartı (Başarı Oranı burada görünür)
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
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 12px;">
                ${item.desc}
              </p>

              <!-- Çözülen Testin Başarı Oranı -->
              <div style="margin-bottom: 14px; background: rgba(0,0,0,0.25); padding: 10px 12px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 5px;">
                  <span style="color: #cbd5e1;">🎯 Test Başarı Oranı:</span>
                  <span style="color: ${itemSolved > 0 ? (itemAccuracy >= 70 ? '#34d399' : itemAccuracy >= 50 ? '#fbbf24' : '#f87171') : '#94a3b8'};">
                    ${itemSolved > 0 ? `%${itemAccuracy} (${itemCorrect}D / ${itemWrong}Y)` : 'Henüz Çözülmedi'}
                  </span>
                </div>
                <div class="progress-bar" style="height: 6px;">
                  <div class="progress-fill" style="width: ${itemAccuracy}%; background: ${itemAccuracy >= 70 ? 'linear-gradient(90deg, #10b981, #059669)' : itemAccuracy >= 50 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #ef4444, #dc2626)'};"></div>
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 8px; margin-top: auto;">
              <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="app.startSubTopicQuiz('${item.filterKey}', '${item.name}', 'practice')">
                🎯 Pratik Çöz
              </button>
              <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="app.startSubTopicQuiz('${item.filterKey}', '${item.name}', 'exam')">
                ⏱️ Sınav Modu
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    const modal = document.getElementById('subtopic-modal');
    if (modal) {
      modal.style.display = 'flex';
      sessionStorage.setItem('ekys_last_subtopic', categoryKey);
    }
  }

  closeSubTopicModal(event) {
    if (event && event.target && event.target.id !== 'subtopic-modal' && !event.target.classList.contains('modal-close')) {
      return;
    }
    const modal = document.getElementById('subtopic-modal');
    if (modal) {
      modal.style.display = 'none';
      sessionStorage.removeItem('ekys_last_subtopic');
    }
  }

  startSubTopicQuiz(filterKey, title, mode = 'practice') {
    const modal = document.getElementById('subtopic-modal');
    if (modal) modal.style.display = 'none';

    let questions = this.getQuestionsForFilter(filterKey);
    if (questions.length === 0) {
      this.showToast('Bu filtrede henüz soru bulunmuyor.', 'error');
      return;
    }

    const isDeneme = title.toLowerCase().includes('deneme') || questions.length >= 80 || filterKey.includes('deneme') || filterKey === 'all_mock_80';
    const isCikmis = title.toLowerCase().includes('çıkmış') || title.toLowerCase().includes('ekys') || filterKey.includes('ekys') || filterKey.includes('cikmis');
    const isScored = isDeneme || isCikmis;

    if (filterKey === 'all_mock_80') {
      questions = this.shuffleArray([...questions]).slice(0, 80);
    }

    this.activeQuiz = {
      title: title,
      filterKey: filterKey,
      isDeneme: isDeneme,
      isCikmis: isCikmis,
      isScored: isScored,
      mode: mode,
      questions: mode === 'exam' ? [...questions] : this.shuffleArray([...questions]),
      currentIndex: 0,
      userAnswers: {},
      struckOptions: {},
      starred: {},
      isFinished: false,
      startTime: Date.now(),
      durationSeconds: mode === 'exam' ? Math.max(questions.length * 112, 600) : 0,
      elapsedSeconds: 0
    };

    this.navigateTo('quiz-active');
    this.startQuizTimer();
    this.renderCurrentQuestion();
    this.showToast(`${title} başlatıldı (${questions.length} Soru)`, 'success');
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
      title: title,
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
      title: topic.name,
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
      isDeneme: true,
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
    if ((q.hasImage || q.image) && q.image) {
      if (imgEl) imgEl.src = q.image;
      if (imgBox) imgBox.style.display = 'block';
    } else {
      if (imgBox) imgBox.style.display = 'none';
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

    let options = [];
    if (Array.isArray(q.options) && q.options.length > 0) {
      options = q.options.map((opt, idx) => {
        if (typeof opt === 'string') return { key: ['A', 'B', 'C', 'D', 'E'][idx] || `${idx + 1}`, text: opt };
        return { key: opt.key || ['A', 'B', 'C', 'D', 'E'][idx] || `${idx + 1}`, text: opt.text || '' };
      });
    } else if (q.options && typeof q.options === 'object') {
      options = Object.keys(q.options).map(k => ({ key: k, text: q.options[k] }));
    } else {
      options = [
        { key: 'A', text: 'A' },
        { key: 'B', text: 'B' },
        { key: 'C', text: 'C' },
        { key: 'D', text: 'D' },
        { key: 'E', text: 'E' }
      ];
    }

    // Şıkların durumunu ve düzenini belirle
    // Sadece şık metni olmayan (yani soru görselinin kendisinde şıkları barındıran) sorular için tek satır 5'li harf butonu kullanılır.
    const hasOnlyLetterOptions = options.every(opt => {
      const text = (opt.text || '').trim();
      const key = (opt.key || '').trim();
      return !text || text.toUpperCase() === key.toUpperCase() || text.toLowerCase().startsWith('seçenek');
    });
    const isVeryShortOptions = options.every(opt => (opt.text || '').trim().length <= 22);

    if (hasOnlyLetterOptions) {
      optionsList.className = 'options-list options-compact-5';
    } else if (isVeryShortOptions) {
      optionsList.className = 'options-list options-grid-2col';
    } else {
      optionsList.className = 'options-list options-grid-1col';
    }

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

      const hasCustomText = opt.text && opt.text.trim() && opt.text.trim() !== opt.key && !opt.text.trim().toLowerCase().startsWith('seçenek');
      const optLabel = hasCustomText ? opt.text.trim() : `Seçenek (${opt.key})`;

      return `
        <div class="option-item ${statusClass}" onclick="app.handleOptionClick('${opt.key}')" title="Şık ${opt.key}">
          <div class="option-key">${opt.key}</div>
          <div class="option-text">${optLabel}</div>
          <button class="option-strike-btn" onclick="event.stopPropagation(); app.toggleStrikeOption('${opt.key}')" title="Bu şıkkı ele (üstünü çiz)">
            ✏️
          </button>
        </div>
      `;
    }).join('');

    // Çözüm / Açıklama Kutusu
    const expBox = document.getElementById('quiz-explanation-box');
    const expText = document.getElementById('quiz-explanation-text');
    if (expBox) {
      if (isAnswered && q.explanation && q.explanation.trim() && this.activeQuiz.mode === 'practice') {
        if (expText) expText.innerHTML = q.explanation.replace(/\n/g, '<br>');
        expBox.style.display = 'block';
      } else {
        expBox.style.display = 'none';
      }
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
    if (!this.activeQuiz) {
      this.navigateTo('test-hub');
      return;
    }
    const answeredCount = Object.keys(this.activeQuiz.userAnswers || {}).length;
    if (answeredCount > 0 && !this.activeQuiz.isFinished) {
      if (confirm(`Şu ana kadar ${answeredCount} soru çözdünüz. Sınavı tamamlayıp sonuçlarınızı kaydetmek istiyor musunuz?`)) {
        this.finishQuiz();
        return;
      }
    }
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

    const total = this.activeQuiz.questions.length;
    // EKYS Kuralı: Yanlış doğruyu götürmez. Puan 100 tam puan üzerinden hesaplanır.
    // 80 soruluk sınavda her soru 1.25 puandır.
    const calculatedScore = total > 0 ? ((correct / total) * 100) : 0;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

    const isScored = this.isScoreApplicable(this.activeQuiz);

    // Kaydet
    window.storageService.saveQuizResult({
      title: this.activeQuiz.title,
      totalQuestions: total,
      correctCount: correct,
      wrongCount: wrong,
      emptyCount: empty,
      score: calculatedScore,
      netScore: calculatedScore,
      durationSeconds: this.activeQuiz.elapsedSeconds,
      topicId: this.activeQuiz.topicId,
      isDeneme: !!this.activeQuiz.isDeneme,
      isCikmis: !!this.activeQuiz.isCikmis,
      isScored: isScored
    });

    // Sonuç Ekranını Doldur
    const elCorrect = document.getElementById('res-correct');
    const elWrong = document.getElementById('res-wrong');
    const elEmpty = document.getElementById('res-empty');
    const elScoreBox = document.getElementById('res-score-box');
    const elNet = document.getElementById('res-net');
    const elPercent = document.getElementById('res-percent');
    const elWrongBtn = document.getElementById('btn-result-wrong-pool');

    if (elCorrect) elCorrect.textContent = correct;
    if (elWrong) elWrong.textContent = wrong;
    if (elEmpty) elEmpty.textContent = empty;
    if (elNet) elNet.textContent = calculatedScore.toFixed(2);
    if (elPercent) elPercent.textContent = `%${percent}`;

    // Puan kutusunu SADECE Çıkmış Sorular ve Deneme Sınavlarında göster
    if (elScoreBox) {
      elScoreBox.style.display = isScored ? 'block' : 'none';
    }

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

  // --- GÖRSEL BÜYÜTEÇ (INTERACTIVE ZOOM & PAN LIGHTBOX) ---
  openImageZoom(imgSrc = null) {
    let src = imgSrc;
    if (!src && this.activeQuiz) {
      const q = this.activeQuiz.questions[this.activeQuiz.currentIndex];
      if (q && (q.image || q.hasImage)) src = q.image;
    }
    if (!src) return;

    const modal = document.getElementById('modal-zoom-image') || document.getElementById('image-zoom-modal');
    const img = document.getElementById('zoom-modal-img');
    if (modal && img) {
      img.src = src;
      this.resetImageZoom(false);
      modal.classList.add('active');
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      this.initZoomGestures();
    }
  }

  closeImageZoom() {
    const modal = document.getElementById('modal-zoom-image') || document.getElementById('image-zoom-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
      document.body.style.overflow = '';
      this.resetImageZoom(false);
    }
  }

  closeZoomModal() {
    this.closeImageZoom();
  }

  zoomImageIn() {
    this.setZoomScale((this.zoomScale || 1.0) + 0.4);
  }

  zoomImageOut() {
    this.setZoomScale((this.zoomScale || 1.0) - 0.4);
  }

  resetImageZoom(updateUi = true) {
    this.zoomScale = 1.0;
    this.zoomPanX = 0;
    this.zoomPanY = 0;
    this.isPanning = false;
    if (updateUi) {
      this.applyZoomTransform();
      this.updateZoomBadge();
    }
  }

  setZoomScale(newScale) {
    const clamped = Math.max(0.5, Math.min(5.0, Math.round(newScale * 10) / 10));
    this.zoomScale = clamped;
    if (this.zoomScale <= 1.0) {
      this.zoomPanX = 0;
      this.zoomPanY = 0;
    }
    this.applyZoomTransform();
    this.updateZoomBadge();
  }

  applyZoomTransform() {
    const container = document.getElementById('zoom-img-container');
    if (container) {
      container.style.transform = `translate3d(${this.zoomPanX || 0}px, ${this.zoomPanY || 0}px, 0) scale(${this.zoomScale || 1.0})`;
    }
  }

  updateZoomBadge() {
    const badge = document.getElementById('zoom-level-badge');
    if (badge) {
      badge.textContent = `${Math.round((this.zoomScale || 1.0) * 100)}%`;
    }
  }

  initZoomGestures() {
    if (this.zoomGesturesReady) return;
    const viewport = document.getElementById('modal-zoom-viewport');
    if (!viewport) return;

    this.zoomGesturesReady = true;

    // Mouse Drag (Pan)
    viewport.addEventListener('mousedown', (e) => {
      if ((this.zoomScale || 1.0) <= 1.05) return;
      this.isPanning = true;
      this.panStartX = e.clientX - (this.zoomPanX || 0);
      this.panStartY = e.clientY - (this.zoomPanY || 0);
      viewport.style.cursor = 'grabbing';
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPanning) return;
      this.zoomPanX = e.clientX - this.panStartX;
      this.zoomPanY = e.clientY - this.panStartY;
      this.applyZoomTransform();
    });

    window.addEventListener('mouseup', () => {
      if (this.isPanning) {
        this.isPanning = false;
        const vp = document.getElementById('modal-zoom-viewport');
        if (vp) vp.style.cursor = ((this.zoomScale || 1.0) > 1.05 ? 'grab' : 'default');
      }
    });

    // Mouse Wheel Zoom
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const step = e.deltaY < 0 ? 0.25 : -0.25;
      this.setZoomScale((this.zoomScale || 1.0) + step);
    }, { passive: false });

    // Touch Gestures (Pinch-to-zoom + 1-finger Pan + Double Tap)
    viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        this.pinchStartDist = dist;
        this.pinchStartScale = this.zoomScale || 1.0;
      } else if (e.touches.length === 1) {
        const now = Date.now();
        if (now - (this.lastTap || 0) < 320) {
          if ((this.zoomScale || 1.0) > 1.3) {
            this.resetImageZoom();
          } else {
            this.setZoomScale(2.2);
          }
          this.lastTap = 0;
          return;
        }
        this.lastTap = now;

        if ((this.zoomScale || 1.0) > 1.05) {
          this.isPanning = true;
          this.panStartX = e.touches[0].clientX - (this.zoomPanX || 0);
          this.panStartY = e.touches[0].clientY - (this.zoomPanY || 0);
        }
      }
    }, { passive: false });

    viewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && this.pinchStartDist > 0) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = dist / this.pinchStartDist;
        this.setZoomScale(this.pinchStartScale * factor);
      } else if (e.touches.length === 1 && this.isPanning && (this.zoomScale || 1.0) > 1.05) {
        e.preventDefault();
        this.zoomPanX = e.touches[0].clientX - this.panStartX;
        this.zoomPanY = e.touches[0].clientY - this.panStartY;
        this.applyZoomTransform();
      }
    }, { passive: false });

    viewport.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        this.pinchStartDist = 0;
      }
      if (e.touches.length === 0) {
        this.isPanning = false;
      }
    });
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
  getCourseCategoryName(h) {
    const t = ((h.title || '') + ' ' + (h.topicId || '')).toLowerCase();
    if (t.includes('deneme') || (h.totalQuestions >= 80 && !t.includes('ekys_'))) return '🎯 EKYS Deneme Sınavları';
    if (t.includes('maarif')) return '🌟 Türkiye Yüzyılı Maarif Modeli';
    if (t.includes('mevzuat') || t.includes('kanun') || t.includes('anayasa') || t.includes('cbk') || t.includes('657') || t.includes('1739') || t.includes('222') || t.includes('5018') || t.includes('4483') || t.includes('4688') || t.includes('5442') || t.includes('3071')) return '⚖️ Mevzuat (Kanun & CBK)';
    if (t.includes('tarih') || t.includes('inkılap') || t.includes('inkilap') || t.includes('atatürk') || t.includes('nutuk') || t.includes('amasya') || t.includes('erzurum') || t.includes('sivas') || t.includes('lozan')) return '⚔️ Tarih & Atatürkçülük';
    if (t.includes('egitim') || t.includes('eğitim') || t.includes('yönetim') || t.includes('yonetim') || t.includes('denetim') || t.includes('liderlik') || t.includes('değerler') || t.includes('degerler') || t.includes('etik')) return '🎓 Eğitim Bilimleri & Yönetimi';
    if (t.includes('cogr') || t.includes('coğrafya') || t.includes('yurttas') || t.includes('yurttaş') || t.includes('guncel') || t.includes('güncel') || t.includes('kültür') || t.includes('kultur')) return '🌍 Genel Kültür (Coğrafya & Güncel)';
    if (t.includes('çıkmış') || t.includes('cikmis') || t.includes('ekys_')) return '📜 MEB EKYS Çıkmış Sınavlar';
    return h.title || 'Genel Test';
  }

  async manualCloudSync() {
    if (!window.firebaseService) {
      this.showToast('Bulut servisi bağlı değil.', 'error');
      return;
    }
    this.showToast('Buluttan en son veriler çekiliyor...', 'info');
    try {
      const found = await window.firebaseService.syncAllDataFromCloud();
      this.renderStatsView();
      this.renderDashboard();
      this.renderWrongPoolList();
      this.renderFavoritesList();
      if (found) {
        this.showToast('Buluttan en son çözülen testleriniz başarıyla çekildi ve işlendi! ✅', 'success');
      } else {
        this.showToast('Bulut senkronizasyonu tamamlandı. Eğer mobil veriniz henüz gelmediyse "📲 Cihazlar Arası Hızlı Aktar" butonu ile anında aktarabilirsiniz.', 'info');
      }
    } catch (err) {
      this.showToast('Senkronizasyon tamamlandı. Dilerseniz "📲 Cihazlar Arası Hızlı Aktar" ile kodu doğrudan yapıştırabilirsiniz.', 'info');
    }
  }

  openDataSyncModal() {
    const modal = document.getElementById('modal-data-sync');
    if (modal) modal.style.display = 'flex';
  }

  closeDataSyncModal(e = null) {
    if (e && e.target && e.target.classList && !e.target.classList.contains('modal') && !e.target.classList.contains('modal-close')) {
      return;
    }
    const modal = document.getElementById('modal-data-sync');
    if (modal) modal.style.display = 'none';
  }

  copySyncCode() {
    const data = window.storageService.exportAllData();
    const str = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(str).then(() => {
        this.showToast('Veri aktarım kodu panoya kopyalandı! Diğer cihazda yapıştırabilirsiniz. 📋', 'success');
      }).catch(() => {
        prompt('Veri aktarım kodunuzu kopyalayın:', str);
      });
    } else {
      prompt('Veri aktarım kodunuzu kopyalayın:', str);
    }
  }

  importSyncCode() {
    const input = document.getElementById('sync-code-input');
    if (!input || !input.value.trim()) {
      this.showToast('Lütfen geçerli bir veri kodu yapıştırın.', 'error');
      return;
    }
    try {
      const decoded = decodeURIComponent(escape(atob(input.value.trim())));
      const data = JSON.parse(decoded);
      window.storageService.importAllData(data);
      this.renderStatsView();
      this.renderDashboard();
      this.renderWrongPoolList();
      this.renderFavoritesList();
      this.closeDataSyncModal();
      this.showToast('Veriler başarıyla aktarıldı! Başarı analizi güncellendi. 🎉', 'success');
      if (window.firebaseService) {
        window.firebaseService.syncAllDataToCloud();
      }
    } catch (e) {
      this.showToast('Geçersiz veri kodu! Lütfen kontrol edin.', 'error');
    }
  }

  isScoreApplicable(item) {
    if (!item) return false;
    if (item.isDeneme || item.isCikmis || item.isScored) return true;
    const title = ((item.title || item.name || '') + ' ' + (item.topicId || '')).toLowerCase();
    return title.includes('deneme') || title.includes('çıkmış') || title.includes('cikmis') || title.includes('ekys_') || (item.totalQuestions >= 80);
  }

  renderStatsView() {
    const history = window.storageService.getQuizHistory();
    const allQuestions = window.storageService.getQuestions();

    // 1. Genel İstatistikler
    let totalQuestionsAnswered = 0;
    let totalCorrectAnswers = 0;
    let totalWrongAnswers = 0;
    const todayStr = new Date().toDateString();
    let todaySolved = 0;

    history.forEach(h => {
      const qCount = h.totalQuestions || (h.correctCount + h.wrongCount + (h.emptyCount || 0)) || 0;
      totalQuestionsAnswered += qCount;
      totalCorrectAnswers += (h.correctCount || 0);
      totalWrongAnswers += (h.wrongCount || 0);

      if (h.date && new Date(h.date).toDateString() === todayStr) {
        todaySolved += qCount;
      }
    });

    // 2. Üst Sayaçları Güncelle
    const dailyTarget = window.storageService.getDailyTarget();
    const dailyPct = Math.min(100, Math.round((todaySolved / dailyTarget) * 100));
    const dailyCountEl = document.getElementById('stats-daily-count');
    const dailyBarEl = document.getElementById('stats-daily-bar');
    if (dailyCountEl) dailyCountEl.textContent = `${todaySolved} / ${dailyTarget} Soru`;
    if (dailyBarEl) dailyBarEl.style.width = `${dailyPct}%`;

    const settingInput = document.getElementById('setting-daily-target-input');
    if (settingInput && document.activeElement !== settingInput) settingInput.value = dailyTarget;

    const totalPoolCount = allQuestions.length || 1200;
    const totalSolvedPct = totalPoolCount > 0 ? Math.min(100, Math.round((totalQuestionsAnswered / totalPoolCount) * 100)) : 0;
    const totalSolvedCountEl = document.getElementById('stats-total-solved-count');
    const totalSolvedBarEl = document.getElementById('stats-total-solved-bar');
    const totalPoolBadgeEl = document.getElementById('stats-total-pool-badge');
    if (totalSolvedCountEl) totalSolvedCountEl.textContent = `${totalQuestionsAnswered} / ${totalPoolCount} Soru`;
    if (totalSolvedBarEl) totalSolvedBarEl.style.width = `${totalSolvedPct}%`;
    if (totalPoolBadgeEl) totalPoolBadgeEl.textContent = `%${totalSolvedPct} Tamamlandı`;

    const overallAccuracy = totalQuestionsAnswered > 0 ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100) : 0;
    const overallAccEl = document.getElementById('stats-overall-accuracy');
    const accBarEl = document.getElementById('stats-accuracy-bar');
    const accBadgeEl = document.getElementById('stats-accuracy-badge');
    if (overallAccEl) overallAccEl.textContent = `%${overallAccuracy}`;
    if (accBarEl) accBarEl.style.width = `${overallAccuracy}%`;
    if (accBadgeEl) accBadgeEl.textContent = `${totalQuestionsAnswered} Soru / ${totalCorrectAnswers} D / ${totalWrongAnswers} Y`;

    // 3. Testler Menüsündeki Tüm Sınav Kartlarının Tanımları
    const testHubCards = this.getTestHubCardsDefinition();

    // 4. Her Test Hub Kartı İçin İstatistik Hesapla & HTML Üret
    const cardsGridEl = document.getElementById('stats-cards-grid');
    if (cardsGridEl) {
      cardsGridEl.innerHTML = testHubCards.map(card => {
        // Bu karta ait soru havuzu sayısı
        const poolQuestions = allQuestions.filter(q => card.match(q));
        const totalPool = poolQuestions.length > 0 ? poolQuestions.length : (card.id === 'cikmis' ? 640 : card.id === 'denemeler' ? 160 : 100);

        // Bu karta ait çözülen testler
        const matchingHistory = history.filter(h => card.match(h));
        let solvedCount = 0;
        let correctCount = 0;
        let wrongCount = 0;

        matchingHistory.forEach(h => {
          const qCount = h.totalQuestions || (h.correctCount + h.wrongCount + (h.emptyCount || 0)) || 0;
          solvedCount += qCount;
          correctCount += (h.correctCount || 0);
          wrongCount += (h.wrongCount || 0);
        });

        // Bu kategorideki toplam testler ve çözülen test sayısı hesabı
        const catTests = this.getAllTestItemsForCategory(card.id);
        const totalTests = catTests.length > 0 ? catTests.length : (card.id === 'cikmis' ? 8 : card.id === 'denemeler' ? 8 : 10);

        let distinctSolvedTests = 0;
        if (catTests.length > 0) {
          catTests.forEach(testItem => {
            const name = (testItem.name || '').toLowerCase().trim();
            const filterKey = (testItem.filterKey || '').toLowerCase().trim();
            const isSolved = history.some(h => {
              const hTitle = (h.title || '').toLowerCase().trim();
              const hTopic = (h.topicId || '').toLowerCase().trim();
              return (hTopic && (hTopic === filterKey || hTopic.startsWith(filterKey))) ||
                     (hTitle && (hTitle.includes(name) || name.includes(hTitle)));
            });
            if (isSolved) distinctSolvedTests++;
          });
        } else {
          distinctSolvedTests = Math.min(matchingHistory.length, totalTests);
        }
        const testSolveRate = totalTests > 0 ? Math.min(100, Math.round((distinctSolvedTests / totalTests) * 100)) : 0;
        const solveRate = totalPool > 0 ? Math.min(100, Math.round((solvedCount / totalPool) * 100)) : 0;

        const theme = card.theme || {
          color: '#6366f1',
          gradStart: '#818cf8',
          gradEnd: '#4f46e5',
          bg: 'linear-gradient(145deg, rgba(99, 102, 241, 0.1) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: 'rgba(99, 102, 241, 0.35)',
          badgeBg: 'rgba(99, 102, 241, 0.2)',
          badgeColor: '#a5b4fc',
          glow: 'rgba(99, 102, 241, 0.4)'
        };

        const radius = 30;
        const circumference = 2 * Math.PI * radius; // ~188.5
        const dashoffset = (circumference * (1 - solveRate / 100)).toFixed(1);

        return `
          <div class="card" style="border: 1px solid ${theme.border}; background: ${theme.bg}; display: flex; flex-direction: column; justify-content: space-between; border-radius: 14px; transition: all 0.25s ease; box-shadow: 0 4px 18px rgba(0,0,0,0.25);" onmouseover="this.style.transform='translateY(-3px)'; this.style.borderColor='${theme.color}'; this.style.boxShadow='0 8px 25px ${theme.glow}'" onmouseout="this.style.transform='none'; this.style.borderColor='${theme.border}'; this.style.boxShadow='0 4px 18px rgba(0,0,0,0.25)'">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div style="font-size: 30px; filter: drop-shadow(0 2px 6px ${theme.glow});">${card.icon}</div>
                <span class="badge" style="background: ${theme.badgeBg}; color: ${theme.badgeColor}; border: 1px solid ${theme.border}; font-size: 0.72rem; font-weight: 700; padding: 4px 8px; border-radius: 6px;">${card.badge}</span>
              </div>
              <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 4px; color: #ffffff;">${card.title}</h3>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.4;">${card.subTitle}</p>

              <!-- Soru Çözülme Oranı (Çember Grafik) & Test Çözülme Oranı -->
              <div style="background: rgba(15, 23, 42, 0.65); padding: 12px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 14px; display: flex; align-items: center; gap: 14px;">
                
                <!-- Çember Grafik (SVG Circular Progress Ring) -->
                <div style="position: relative; width: 76px; height: 76px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                  <svg width="76" height="76" viewBox="0 0 76 76" style="transform: rotate(-90deg); filter: drop-shadow(0 0 4px ${theme.glow});">
                    <defs>
                      <linearGradient id="grad-ring-${card.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="${theme.gradStart}" />
                        <stop offset="100%" stop-color="${theme.gradEnd}" />
                      </linearGradient>
                    </defs>
                    <!-- Arka Plan Halkası -->
                    <circle cx="38" cy="38" r="${radius}" stroke="rgba(255,255,255,0.09)" stroke-width="6" fill="none" />
                    <!-- İlerleme Halkası -->
                    <circle cx="38" cy="38" r="${radius}" 
                      stroke="url(#grad-ring-${card.id})" 
                      stroke-width="6" 
                      stroke-linecap="round" 
                      fill="none" 
                      stroke-dasharray="${circumference.toFixed(1)}" 
                      stroke-dashoffset="${dashoffset}" 
                      style="transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);"
                    />
                  </svg>
                  <!-- Merkez Yüzde & Bilgi -->
                  <div style="position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; text-align: center;">
                    <span style="font-size: 1.05rem; font-weight: 800; color: #ffffff; line-height: 1;">%${solveRate}</span>
                    <span style="font-size: 0.62rem; font-weight: 700; color: ${theme.badgeColor}; margin-top: 2px; letter-spacing: 0.3px;">Soru</span>
                  </div>
                </div>

                <!-- Sağ Detay Bilgileri -->
                <div style="flex: 1; min-width: 0;">
                  <div style="margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; font-weight: 700; color: #e2e8f0; margin-bottom: 2px;">
                      <span>📌 Soru Çözümü</span>
                      <span style="color: ${theme.badgeColor}; font-weight: 800;">${solvedCount} / ${totalPool}</span>
                    </div>
                    <div style="font-size: 0.72rem; color: #94a3b8;">
                      ${totalPool > solvedCount ? `${totalPool - solvedCount} soru kaldı` : '🎉 Tamamı çözüldü!'}
                    </div>
                  </div>

                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; font-weight: 600; color: #94a3b8; margin-bottom: 3px;">
                      <span>📋 Test Çözümü</span>
                      <span style="color: #38bdf8; font-weight: 700;">%${testSolveRate} (${distinctSolvedTests}/${totalTests})</span>
                    </div>
                    <div class="progress-bar" style="height: 5px; background: rgba(255,255,255,0.08); border-radius: 4px;">
                      <div class="progress-fill" style="width: ${testSolveRate}%; background: linear-gradient(90deg, #0ea5e9, #38bdf8);"></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <button class="btn btn-block btn-sm" onclick="app.openSubTopicModal('${card.id}')" style="margin-top: 4px; font-weight: 700; font-size: 0.82rem; border: 1px solid ${theme.border}; background: rgba(255, 255, 255, 0.05); color: #ffffff; border-radius: 8px; padding: 7px 12px; transition: all 0.2s;" onmouseover="this.style.background='${theme.gradStart}'; this.style.color='#0f172a'; this.style.borderColor='transparent'" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.color='#ffffff'; this.style.borderColor='${theme.border}'">
              <span>📝</span> Bu Dersin Testlerini Çöz
            </button>
          </div>
        `;
      }).join('');
    }

    // 5. Çözülen Tüm Sınavlar Geçmiş Tablosu
    const tableEl = document.getElementById('stats-history-table');
    if (tableEl) {
      if (history.length === 0) {
        tableEl.innerHTML = '<div style="color: var(--text-secondary); font-size: 0.88rem; padding: 24px 0; text-align: center;">Henüz kayıtlı sınav geçmişiniz yok. Test Merkezinden hemen bir teste başlayabilirsiniz!</div>';
      } else {
        tableEl.innerHTML = `
          <table class="admin-table">
            <thead>
              <tr>
                <th>Test / Deneme Adı</th>
                <th>Tarih</th>
                <th style="text-align: center;">Toplam Soru</th>
                <th style="text-align: center;">Doğru</th>
                <th style="text-align: center;">Yanlış</th>
                <th style="text-align: center;">Boş</th>
                <th style="text-align: center;">Başarı Oranı</th>
                <th style="text-align: center;">İşlem</th>
              </tr>
            </thead>
            <tbody>
              ${history.map(h => {
                const correct = h.correctCount || 0;
                const wrong = h.wrongCount || 0;
                const empty = h.emptyCount || 0;
                const total = h.totalQuestions || (correct + wrong + empty);
                const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
                const isScored = this.isScoreApplicable(h);
                const recordId = h.id || h.date;
                const pctColor = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
                
                return `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: var(--text-primary);">${h.title}</div>
                  </td>
                  <td style="white-space: nowrap; color: var(--text-secondary); font-size: 0.82rem;">
                    ${new Date(h.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style="text-align: center;">
                    <span class="badge badge-info" style="font-size: 0.82rem; font-weight: 700; padding: 4px 8px;">${total} Soru</span>
                  </td>
                  <td style="text-align: center;">
                    <span style="color: #10b981; font-weight: 800; font-size: 0.9rem;">${correct} D</span>
                  </td>
                  <td style="text-align: center;">
                    <span style="color: #ef4444; font-weight: 800; font-size: 0.9rem;">${wrong} Y</span>
                  </td>
                  <td style="text-align: center;">
                    <span style="color: #94a3b8; font-weight: 700; font-size: 0.9rem;">${empty} B</span>
                  </td>
                  <td style="text-align: center;">
                    <div style="display: inline-flex; flex-direction: column; align-items: center;">
                      <span style="color: ${pctColor}; font-weight: 800; font-size: 0.92rem;">%${pct} Başarı</span>
                      ${isScored ? `<span style="font-size: 0.75rem; color: #818cf8; font-weight: 600;">(${parseFloat(h.score !== undefined ? h.score : (h.netScore || 0)).toFixed(2)} Puan)</span>` : ''}
                    </div>
                  </td>
                  <td style="text-align: center; white-space: nowrap;">
                    <div style="display: flex; gap: 6px; justify-content: center; align-items: center;">
                      <button class="btn btn-secondary btn-sm" onclick="app.openEditQuizModal('${recordId}')" style="padding: 5px 9px; font-size: 0.78rem; border-radius: 6px; font-weight: 600;" title="Test sonucunu düzenle">
                        ✏️ Düzenle
                      </button>
                      <button class="btn btn-danger btn-sm" onclick="app.deleteQuizHistoryItem('${recordId}')" style="padding: 5px 9px; font-size: 0.78rem; border-radius: 6px; font-weight: 600;" title="Bu test sonucunu sil">
                        🗑️ Sil
                      </button>
                    </div>
                  </td>
                </tr>
              `;}).join('')}
            </tbody>
          </table>
        `;
      }
    }

    // 6. Grafikleri Çiz (Çubuk, Pasta, Çizgi)
    try {
      this.renderStatsCharts(history, allQuestions, dailyTarget, testHubCards, totalQuestionsAnswered, totalPoolCount);
    } catch (err) {
      console.warn('Grafik oluşturma hatası:', err);
    }
  }

  getTestHubCardsDefinition() {
    return [
      {
        id: 'genel-kultur',
        title: 'Genel Kültür',
        subTitle: 'Coğrafya, Yurttaşlık & Güncel Bilgiler',
        icon: '🌍',
        badge: '%20 (16 Soru)',
        theme: {
          color: '#06b6d4',
          gradStart: '#22d3ee',
          gradEnd: '#0284c7',
          bg: 'linear-gradient(145deg, rgba(6, 182, 212, 0.1) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: 'rgba(6, 182, 212, 0.35)',
          badgeBg: 'rgba(6, 182, 212, 0.2)',
          badgeColor: '#67e8f9',
          glow: 'rgba(6, 182, 212, 0.4)'
        },
        match: (item) => {
          const t = ((item.category || '') + ' ' + (item.title || '') + ' ' + (item.topicName || '') + ' ' + (item.topicId || '')).toLowerCase();
          return t.includes('cogr') || t.includes('coğrafya') || t.includes('yurttas') || t.includes('yurttaş') || t.includes('guncel') || t.includes('güncel') || t.includes('genel kültür') || t.includes('genel kultur');
        }
      },
      {
        id: 'inkilap',
        title: 'Tarih, İnkılâp Tarihi & Atatürkçülük',
        subTitle: 'İlk Türk Dev., Selçuklu, Osmanlı, İnkılap',
        icon: '⚔️',
        badge: '%20 (16 Soru)',
        theme: {
          color: '#f43f5e',
          gradStart: '#fb7185',
          gradEnd: '#e11d48',
          bg: 'linear-gradient(145deg, rgba(244, 63, 94, 0.1) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: 'rgba(244, 63, 94, 0.35)',
          badgeBg: 'rgba(244, 63, 94, 0.2)',
          badgeColor: '#fda4af',
          glow: 'rgba(244, 63, 94, 0.4)'
        },
        match: (item) => {
          const t = ((item.category || '') + ' ' + (item.title || '') + ' ' + (item.topicName || '') + ' ' + (item.topicId || '')).toLowerCase();
          return t.includes('tarih') || t.includes('inkılap') || t.includes('inkilap') || t.includes('atatürk') || t.includes('ataturk') || t.includes('nutuk') || t.includes('amasya') || t.includes('erzurum') || t.includes('sivas') || t.includes('lozan');
        }
      },
      {
        id: 'egitim',
        title: 'Eğitim Bilimleri & Yönetimi',
        subTitle: 'Yönetim, Liderlik, Denetim, Değerler, Etik',
        icon: '🎓',
        badge: '%15 (12 Soru)',
        theme: {
          color: '#10b981',
          gradStart: '#34d399',
          gradEnd: '#059669',
          bg: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: 'rgba(16, 185, 129, 0.35)',
          badgeBg: 'rgba(16, 185, 129, 0.2)',
          badgeColor: '#6ee7b7',
          glow: 'rgba(16, 185, 129, 0.4)'
        },
        match: (item) => {
          const t = ((item.category || '') + ' ' + (item.title || '') + ' ' + (item.topicName || '') + ' ' + (item.topicId || '')).toLowerCase();
          return t.includes('egitim') || t.includes('eğitim') || t.includes('yönetim') || t.includes('yonetim') || t.includes('denetim') || t.includes('liderlik') || t.includes('değerler') || t.includes('degerler') || t.includes('etik') || t.includes('ölçme') || t.includes('olcme');
        }
      },
      {
        id: 'maarif',
        title: 'Türkiye Yüzyılı Maarif Modeli',
        subTitle: 'Ortak Metin, Beceriler, Erdem-Değer-Eylem',
        icon: '🌟',
        badge: '%30 (24 Soru)',
        theme: {
          color: '#f59e0b',
          gradStart: '#fbbf24',
          gradEnd: '#d97706',
          bg: 'linear-gradient(145deg, rgba(245, 158, 11, 0.12) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: 'rgba(245, 158, 11, 0.4)',
          badgeBg: 'rgba(245, 158, 11, 0.25)',
          badgeColor: '#fde047',
          glow: 'rgba(245, 158, 11, 0.4)'
        },
        match: (item) => {
          const t = ((item.category || '') + ' ' + (item.title || '') + ' ' + (item.topicName || '') + ' ' + (item.topicId || '')).toLowerCase();
          return t.includes('maarif');
        }
      },
      {
        id: 'mevzuat',
        title: 'Mevzuat',
        subTitle: '1982 Anayasası, 657, 1739, 222, 5018...',
        icon: '⚖️',
        badge: '%20 (16 Soru)',
        theme: {
          color: '#6366f1',
          gradStart: '#818cf8',
          gradEnd: '#4f46e5',
          bg: 'linear-gradient(145deg, rgba(99, 102, 241, 0.1) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: 'rgba(99, 102, 241, 0.35)',
          badgeBg: 'rgba(99, 102, 241, 0.2)',
          badgeColor: '#a5b4fc',
          glow: 'rgba(99, 102, 241, 0.4)'
        },
        match: (item) => {
          const t = ((item.category || '') + ' ' + (item.title || '') + ' ' + (item.topicName || '') + ' ' + (item.topicId || '')).toLowerCase();
          return t.includes('mevzuat') || t.includes('kanun') || t.includes('anayasa') || t.includes('cbk') || t.includes('657') || t.includes('1739') || t.includes('222') || t.includes('5018') || t.includes('4483') || t.includes('4688') || t.includes('5442') || t.includes('3071');
        }
      },
      {
        id: 'cikmis',
        title: 'Çıkmış Sınav Soruları',
        subTitle: '2019 – 2026 Resmî MEB EKYS Arşivi',
        icon: '📜',
        badge: '8 Yıllık Arşiv',
        theme: {
          color: '#a855f7',
          gradStart: '#c084fc',
          gradEnd: '#9333ea',
          bg: 'linear-gradient(145deg, rgba(168, 85, 247, 0.12) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: 'rgba(168, 85, 247, 0.4)',
          badgeBg: 'rgba(168, 85, 247, 0.25)',
          badgeColor: '#e9d5ff',
          glow: 'rgba(168, 85, 247, 0.4)'
        },
        match: (item) => {
          const t = ((item.category || '') + ' ' + (item.title || '') + ' ' + (item.topicName || '') + ' ' + (item.topicId || '')).toLowerCase();
          return t.includes('çıkmış') || t.includes('cikmis') || t.includes('ekys_') || t.includes('2019') || t.includes('2020') || t.includes('2021') || t.includes('2022') || t.includes('2023') || t.includes('2024') || t.includes('2025') || t.includes('2026');
        }
      },
      {
        id: 'denemeler',
        title: 'EKYS Deneme Testleri',
        subTitle: '80 Soruluk Resmî Format Genel Denemeler',
        icon: '🎯',
        badge: '100 Tam Puan',
        theme: {
          color: '#f97316',
          gradStart: '#fb923c',
          gradEnd: '#ea580c',
          bg: 'linear-gradient(145deg, rgba(249, 115, 22, 0.12) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: 'rgba(249, 115, 22, 0.4)',
          badgeBg: 'rgba(249, 115, 22, 0.25)',
          badgeColor: '#fed7aa',
          glow: 'rgba(249, 115, 22, 0.4)'
        },
        match: (item) => {
          const t = ((item.category || '') + ' ' + (item.title || '') + ' ' + (item.topicName || '') + ' ' + (item.topicId || '')).toLowerCase();
          return t.includes('deneme');
        }
      }
    ];
  }

  changeStatsTrendSubject(subject) {
    this.statsTrendSubjectFilter = subject || 'all';
    
    const history = window.storageService.getQuizHistory();
    const allQuestions = window.storageService.getQuestions();
    const dailyTarget = window.storageService.getDailyTarget();
    
    let totalQuestionsAnswered = 0;
    history.forEach(h => {
      totalQuestionsAnswered += (h.totalQuestions || (h.correctCount + h.wrongCount + (h.emptyCount || 0)) || 0);
    });
    const totalPoolCount = allQuestions.length || 1272;

    this.renderStatsCharts(history, allQuestions, dailyTarget, this.getTestHubCardsDefinition(), totalQuestionsAnswered, totalPoolCount);
  }

  changeStatsTrendOffset(delta) {
    this.statsTrendOffset = (this.statsTrendOffset || 0) + delta;
    if (this.statsTrendOffset > 0) this.statsTrendOffset = 0;
    
    const history = window.storageService.getQuizHistory();
    const allQuestions = window.storageService.getQuestions();
    const dailyTarget = window.storageService.getDailyTarget();
    
    let totalQuestionsAnswered = 0;
    history.forEach(h => {
      totalQuestionsAnswered += (h.totalQuestions || (h.correctCount + h.wrongCount + (h.emptyCount || 0)) || 0);
    });
    const totalPoolCount = allQuestions.length || 1272;

    this.renderStatsCharts(history, allQuestions, dailyTarget, this.getTestHubCardsDefinition(), totalQuestionsAnswered, totalPoolCount);
  }

  renderStatsCharts(history, allQuestions, dailyTarget, testHubCards, totalQuestionsAnswered = 0, totalPoolCount = 1272) {
    if (typeof Chart === 'undefined') return;

    // --- 1. ÇUBUK GRAFİK (BAR CHART): Son 7 Günlük Çözülen Soru vs Günlük Hedef ---
    const dailyCanvas = document.getElementById('chart-daily-target');
    if (dailyCanvas) {
      if (this.dailyChartInstance) {
        this.dailyChartInstance.destroy();
      }

      const dayLabels = [];
      const dayData = [];
      const targetData = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toDateString();
        const label = i === 0 ? 'Bugün' : d.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' });
        
        let count = 0;
        history.forEach(h => {
          if (h.date && new Date(h.date).toDateString() === dateStr) {
            count += (h.totalQuestions || (h.correctCount + h.wrongCount + (h.emptyCount || 0)) || 0);
          }
        });

        dayLabels.push(label);
        dayData.push(count);
        targetData.push(dailyTarget);
      }

      const ctx = dailyCanvas.getContext('2d');
      this.dailyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dayLabels,
          datasets: [
            {
              label: 'Çözülen Soru',
              data: dayData,
              backgroundColor: dayData.map(v => v >= dailyTarget ? 'rgba(16, 185, 129, 0.85)' : 'rgba(99, 102, 241, 0.85)'),
              borderRadius: 6,
              borderSkipped: false,
              barPercentage: 0.6
            },
            {
              label: 'Günlük Hedef',
              data: targetData,
              type: 'line',
              borderColor: '#f59e0b',
              borderDash: [5, 5],
              borderWidth: 2,
              pointRadius: 0,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: { color: '#94a3b8', font: { size: 11 } }
            },
            tooltip: {
              backgroundColor: '#1e293b',
              titleColor: '#ffffff',
              bodyColor: '#cbd5e1',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8', font: { size: 10 } }
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.06)' },
              ticks: { color: '#94a3b8', font: { size: 10 }, precision: 0 }
            }
          }
        }
      });
    }

    // --- 2. PASTA/DONUT GRAFİK: Toplam Soru Çözülme Durumu (Çözülen vs Kalan) ---
    const distCanvas = document.getElementById('chart-total-distribution');
    if (distCanvas) {
      if (this.distChartInstance) {
        this.distChartInstance.destroy();
      }

      const solved = totalQuestionsAnswered || 0;
      const totalPool = totalPoolCount || 1272;
      const remaining = Math.max(0, totalPool - solved);
      const solvedPct = totalPool > 0 ? Math.round((solved / totalPool) * 100) : 0;
      const remainingPct = 100 - solvedPct;

      const ctx2 = distCanvas.getContext('2d');
      this.distChartInstance = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Çözülen Soru', 'Kalan Soru'],
          datasets: [{
            data: [solved, remaining],
            backgroundColor: ['#10b981', '#334155'],
            borderColor: '#1e293b',
            borderWidth: 3,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '66%',
          plugins: {
            legend: {
              position: 'right',
              labels: { color: '#cbd5e1', font: { size: 11 }, boxWidth: 14, padding: 12 }
            },
            tooltip: {
              backgroundColor: '#1e293b',
              titleColor: '#ffffff',
              bodyColor: '#cbd5e1',
              callbacks: {
                label: (context) => {
                  const val = context.raw || 0;
                  const pct = context.dataIndex === 0 ? solvedPct : remainingPct;
                  return ` ${context.label}: ${val} Soru (%${pct})`;
                }
              }
            }
          }
        }
      });
    }

    // --- 3. ÇİZGİ GRAFİK (LINE CHART): Toplam Soru, Doğru, Yanlış Günlük Trendi (Ders Filtreli) ---
    const accCanvas = document.getElementById('chart-accuracy-trend');
    if (accCanvas) {
      if (this.accChartInstance) {
        this.accChartInstance.destroy();
      }

      const offset = this.statsTrendOffset || 0;
      const currentSubject = this.statsTrendSubjectFilter || 'all';

      // Dropdown seçili değerini senkronize et
      const filterSelect = document.getElementById('stats-trend-subject-filter');
      if (filterSelect && filterSelect.value !== currentSubject) {
        filterSelect.value = currentSubject;
      }

      // Seçilen derse göre test geçmişini filtrele
      const allCards = testHubCards || this.getTestHubCardsDefinition();
      let filteredHistory = history;
      if (currentSubject !== 'all') {
        const targetCard = allCards.find(c => c.id === currentSubject);
        if (targetCard && targetCard.match) {
          filteredHistory = history.filter(h => targetCard.match(h));
        } else {
          filteredHistory = history.filter(h => {
            const t = ((h.category || '') + ' ' + (h.title || '') + ' ' + (h.topicName || '') + ' ' + (h.topicId || '')).toLowerCase();
            return t.includes(currentSubject);
          });
        }
      }

      const dayLabels = [];
      const dayTotalArr = [];
      const dayCorrectArr = [];
      const dayWrongArr = [];

      let startDateObj = null;
      let endDateObj = null;

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() + offset - i);
        if (i === 6) startDateObj = new Date(d);
        if (i === 0) endDateObj = new Date(d);

        const dateStr = d.toDateString();
        const label = (offset === 0 && i === 0) 
          ? 'Bugün' 
          : d.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' });
        
        let dayTotal = 0;
        let dayCorrect = 0;
        let dayWrong = 0;

        filteredHistory.forEach(h => {
          if (h.date && new Date(h.date).toDateString() === dateStr) {
            const count = (h.totalQuestions || (h.correctCount + h.wrongCount + (h.emptyCount || 0)) || 0);
            dayTotal += count;
            dayCorrect += (h.correctCount || 0);
            dayWrong += (h.wrongCount || 0);
          }
        });

        dayLabels.push(label);
        dayTotalArr.push(dayTotal);
        dayCorrectArr.push(dayCorrect);
        dayWrongArr.push(dayWrong);
      }

      // Tarih Aralığı Etiketini Güncelle
      const rangeLabelEl = document.getElementById('stats-trend-range-label');
      const nextBtnEl = document.getElementById('btn-stats-trend-next');
      if (rangeLabelEl && startDateObj && endDateObj) {
        const sStr = startDateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
        const eStr = endDateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
        rangeLabelEl.textContent = offset === 0 ? `Son 7 Gün (${sStr} - ${eStr})` : `${sStr} - ${eStr}`;
      }
      if (nextBtnEl) {
        nextBtnEl.style.opacity = offset >= 0 ? '0.4' : '1';
        nextBtnEl.style.cursor = offset >= 0 ? 'not-allowed' : 'pointer';
      }

      const ctx3 = accCanvas.getContext('2d');
      this.accChartInstance = new Chart(ctx3, {
        type: 'line',
        data: {
          labels: dayLabels,
          datasets: [
            {
              label: 'Toplam Soru',
              data: dayTotalArr,
              borderColor: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              borderWidth: 2.5,
              tension: 0.35,
              pointBackgroundColor: '#38bdf8',
              pointBorderColor: '#ffffff',
              pointRadius: 4,
              fill: true
            },
            {
              label: 'Doğru (D)',
              data: dayCorrectArr,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 2.5,
              tension: 0.35,
              pointBackgroundColor: '#10b981',
              pointBorderColor: '#ffffff',
              pointRadius: 4,
              fill: true
            },
            {
              label: 'Yanlış (Y)',
              data: dayWrongArr,
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderWidth: 2.5,
              tension: 0.35,
              pointBackgroundColor: '#ef4444',
              pointBorderColor: '#ffffff',
              pointRadius: 4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: { color: '#cbd5e1', font: { size: 10 }, boxWidth: 12, padding: 8 }
            },
            tooltip: {
              backgroundColor: '#1e293b',
              titleColor: '#ffffff',
              bodyColor: '#cbd5e1',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8', font: { size: 10 } }
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.06)' },
              ticks: {
                color: '#94a3b8',
                font: { size: 10 },
                precision: 0
              }
            }
          }
        }
      });
    }
  }

  openEditQuizModal(id) {
    const history = window.storageService.getQuizHistory();
    const item = history.find(h => h.id === id || h.date === id);
    if (!item) {
      this.showToast('Test kaydı bulunamadı.', 'error');
      return;
    }

    const total = item.totalQuestions || ((item.correctCount || 0) + (item.wrongCount || 0) + (item.emptyCount || 0));
    
    const idEl = document.getElementById('edit-quiz-id');
    const titleEl = document.getElementById('edit-quiz-title');
    const totalEl = document.getElementById('edit-quiz-total');
    const correctEl = document.getElementById('edit-quiz-correct');
    const wrongEl = document.getElementById('edit-quiz-wrong');
    const emptyEl = document.getElementById('edit-quiz-empty');

    if (idEl) idEl.value = item.id || item.date;
    if (titleEl) titleEl.value = item.title || '';
    if (totalEl) totalEl.value = total;
    if (correctEl) correctEl.value = item.correctCount || 0;
    if (wrongEl) wrongEl.value = item.wrongCount || 0;
    if (emptyEl) emptyEl.value = item.emptyCount || 0;

    const modal = document.getElementById('modal-edit-quiz-history');
    if (modal) {
      modal.classList.add('active');
    }
  }

  closeEditQuizModal(event) {
    if (event && event.target && !event.target.classList.contains('modal') && !event.target.classList.contains('modal-close')) {
      return;
    }
    const modal = document.getElementById('modal-edit-quiz-history');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  saveQuizHistoryEdit(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('edit-quiz-id').value;
    const title = document.getElementById('edit-quiz-title').value.trim();
    const totalQuestions = parseInt(document.getElementById('edit-quiz-total').value) || 0;
    const correctCount = parseInt(document.getElementById('edit-quiz-correct').value) || 0;
    const wrongCount = parseInt(document.getElementById('edit-quiz-wrong').value) || 0;
    const emptyCount = parseInt(document.getElementById('edit-quiz-empty').value) || 0;

    if (!title) {
      this.showToast('Lütfen geçerli bir test adı giriniz.', 'warning');
      return;
    }

    if (correctCount + wrongCount + emptyCount > totalQuestions && totalQuestions > 0) {
      this.showToast('Doğru, Yanlış ve Boş toplamı toplam soru sayısından fazla olamaz.', 'warning');
      return;
    }

    const success = window.storageService.updateQuizHistory({
      id,
      title,
      totalQuestions: totalQuestions || (correctCount + wrongCount + emptyCount),
      correctCount,
      wrongCount,
      emptyCount
    });

    if (success) {
      this.closeEditQuizModal();
      this.renderStatsView();
      this.renderDashboard();
      this.showToast('Test kaydı başarıyla güncellendi.', 'success');
    } else {
      this.showToast('Güncelleme sırasında bir hata oluştu.', 'error');
    }
  }

  deleteQuizHistoryItem(id) {
    if (!id) return;
    if (!confirm('Bu test sonucunu geçmişten silmek istediğinize emin misiniz?')) {
      return;
    }
    window.storageService.deleteQuizHistory(id);
    this.renderStatsView();
    this.renderDashboard();
    this.showToast('Test kaydı başarıyla silindi.', 'success');
  }

  clearAllQuizHistoryPrompt() {
    const history = window.storageService.getQuizHistory();
    if (!history || history.length === 0) {
      this.showToast('Silinecek test geçmişi bulunmuyor.', 'info');
      return;
    }
    if (!confirm('Tüm çözülen sınav ve deneme geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }
    window.storageService.clearQuizHistory();
    this.renderStatsView();
    this.renderDashboard();
    this.showToast('Tüm test geçmişi başarıyla temizlendi.', 'success');
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
      } else {
        localStorage.setItem('ekys_active_session_v3', JSON.stringify({
          uid: 'uid_admin',
          email: 'admin@ekysrota.com',
          displayName: 'Gökhan Eker (Yönetici)',
          role: 'admin'
        }));
      }

      // Giriş ekranını gizle ve ana paneli aç
      const authGateEl = document.getElementById('auth-gate-container');
      const mainAppEl = document.getElementById('main-app-container');
      if (authGateEl) authGateEl.style.display = 'none';
      if (mainAppEl) mainAppEl.style.display = 'flex';

      this.showToast(`Giriş başarılı! Hoş geldiniz.`, 'success');
      this.renderDashboard();
      this.renderTestHub();
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

  promptChangeDailyTarget() {
    const current = window.storageService ? window.storageService.getDailyTarget() : 30;
    const input = prompt('🎯 Günlük çözmek istediğiniz hedef soru sayısını giriniz (Örn: 20, 30, 50, 100):', current);
    if (input !== null) {
      const parsed = parseInt(input.trim(), 10);
      if (!isNaN(parsed) && parsed >= 5) {
        window.storageService.setDailyTarget(parsed);
        this.renderStatsView();
        this.renderDashboard();
        this.showToast(`Günlük hedefiniz ${parsed} soru olarak güncellendi! 🎯`, 'success');
      } else {
        this.showToast('Lütfen en az 5 olacak şekilde geçerli bir sayı giriniz.', 'error');
      }
    }
  }

  saveDailyTargetFromSettings() {
    const el = document.getElementById('setting-daily-target-input');
    if (!el) return;
    const val = parseInt(el.value, 10);
    if (!isNaN(val) && val >= 5) {
      window.storageService.setDailyTarget(val);
      this.renderStatsView();
      this.renderDashboard();
      this.showToast(`Günlük soru hedefiniz ${val} soru olarak kaydedildi! 🎯`, 'success');
    } else {
      this.showToast('Lütfen en az 5 olacak şekilde geçerli bir hedef soru sayısı giriniz.', 'error');
    }
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
