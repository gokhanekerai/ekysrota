// EKYS 2027 Pro - Ana Uygulama Kontrolcüsü (SPA Controller)

class EKYSApp {
  constructor() {
    this.currentView = 'dashboard';
    this.activeQuiz = null;
    this.timerInterval = null;
    this.countdownInterval = null;

    this.init();
  }

  init() {
    this.bindNavigation();
    this.startExamCountdown();
    this.renderDashboard();
    this.renderTopicsList();
    this.renderSourcesList();
    this.renderWrongPoolList();
    this.renderStatsView();
    this.loadSettingsForm();
    this.applySavedTheme();
    this.registerDropzones();
    this.checkForIncomingTranscript();

    // Sayfa kapatılırken veya yenilenirken onay (eğer aktif sınavdaysa)
    window.addEventListener('beforeunload', (e) => {
      if (this.activeQuiz && !this.activeQuiz.isFinished) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    // Oturumlar arası tek tıkla aktarım dinleyicisi
    window.addEventListener('storage', (e) => {
      if (e.key === 'ekys_auto_incoming') {
        this.checkForIncomingTranscript();
      }
    });
  }

  checkForIncomingTranscript() {
    try {
      const incomingRaw = localStorage.getItem('ekys_auto_incoming');
      if (!incomingRaw) return;

      const data = JSON.parse(incomingRaw);
      localStorage.removeItem('ekys_auto_incoming'); // Tek kullanımlık

      if (data && data.text && data.text.length > 30) {
        const topicId = this.detectMatchingTopicId(data.title) || 'genel-kultur';
        const topics = window.storageService.getTopics();
        const matchedTopic = topics.find(t => t.id === topicId);
        const topicName = matchedTopic ? matchedTopic.name : 'Genel Kaynak';

        // Kaynaklara kaydet
        const saved = window.storageService.addSource({
          type: 'video',
          title: data.title || 'YouTube Dersi',
          url: data.url || '',
          text: `${data.title}\n\nKonuşma Dökümü:\n${data.text}`,
          size: 'YouTube Transkripti',
          topicId: topicId,
          topicName: topicName
        });

        this.renderSourcesList();
        this.renderTopicsList();
        this.showToast(`🎯 YouTube'dan 1 tıkla aktarıldı: "${data.title}"`, 'success');

        // Otomatik soru üretim ekranına aktar
        setTimeout(() => {
          this.openGenerateWithText(saved.text, saved.title, topicId);
        }, 500);
      }
    } catch (err) {
      console.warn('Otomatik aktarım okunamadı:', err);
    }
  }

  // --- NAVİGASYON VE GÖRÜNÜM YÖNETİMİ ---
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

    // Aktif görünümü güncelle
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    const targetSection = document.getElementById(`view-${viewId}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Nav bar aktif durumlarını güncelle
    document.querySelectorAll('[data-view-target]').forEach(btn => {
      if (btn.getAttribute('data-view-target') === viewId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.currentView = viewId;
    window.scrollTo(0, 0);

    // Görünüm yenileme tetikleyicileri
    if (viewId === 'dashboard') this.renderDashboard();
    if (viewId === 'test-hub') this.renderTopicsList();
    if (viewId === 'sources') this.renderSourcesList();
    if (viewId === 'wrong-pool') this.renderWrongPoolList();
    if (viewId === 'stats') this.renderStatsView();
    if (viewId === 'settings') this.loadSettingsForm();
  }

  // --- 2027 MART EKYS GERİ SAYIM SAYACI ---
  startExamCountdown() {
    const updateCountdown = () => {
      const settings = window.storageService.getSettings();
      const targetTime = new Date(settings.targetDate || '2027-03-15T09:30:00').getTime();
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        document.getElementById('countdown-display').innerHTML = '<span>Sınav Günü Geldi!</span>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const daysEl = document.getElementById('cd-days');
      const hoursEl = document.getElementById('cd-hours');
      const minsEl = document.getElementById('cd-mins');
      const secsEl = document.getElementById('cd-secs');

      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
      if (minsEl) minsEl.textContent = minutes.toString().padStart(2, '0');
      if (secsEl) secsEl.textContent = seconds.toString().padStart(2, '0');
    };

    updateCountdown();
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(updateCountdown, 1000);
  }

  // --- DASHBOARD GÖRÜNÜMÜ ---
  renderDashboard() {
    const questions = window.storageService.getQuestions();
    const history = window.storageService.getQuizHistory();
    const wrongPool = window.storageService.getWrongPool();
    const sources = window.storageService.getSources();

    let totalSolved = 0;
    let totalCorrect = 0;
    history.forEach(h => {
      totalSolved += (h.totalQuestions || 0);
      totalCorrect += (h.correctCount || 0);
    });

    const successRate = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

    // Stat elementlerini doldur
    const elTotalQ = document.getElementById('stat-total-questions');
    const elSolved = document.getElementById('stat-total-solved');
    const elSuccess = document.getElementById('stat-success-rate');
    const elWrong = document.getElementById('stat-wrong-count');
    const elWrongBadge = document.getElementById('badge-wrong-count');

    if (elTotalQ) elTotalQ.textContent = questions.length;
    if (elSolved) elSolved.textContent = totalSolved;
    if (elSuccess) elSuccess.textContent = `%${successRate}`;
    if (elWrong) elWrong.textContent = wrongPool.length;
    if (elWrongBadge) {
      elWrongBadge.textContent = wrongPool.length;
      elWrongBadge.style.display = wrongPool.length > 0 ? 'inline-block' : 'none';
    }

    // Son Çözülen Testler Listesi
    const recentListEl = document.getElementById('dashboard-recent-quizzes');
    if (recentListEl) {
      if (history.length === 0) {
        recentListEl.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 30px;">Henüz çözülmüş bir test bulunmuyor. Hemen bir test başlatın!</div>`;
      } else {
        recentListEl.innerHTML = history.slice(0, 4).map(item => `
          <div class="card" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; margin-bottom: 10px;">
            <div>
              <div style="font-weight: 700; font-size: 0.95rem;">${item.title}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${new Date(item.date).toLocaleDateString('tr-TR')} • ${item.durationFormatted || 'Süresiz'}</div>
            </div>
            <div style="text-align: right;">
              <span style="font-weight: 800; color: var(--accent-success); font-size: 1.1rem;">${item.correctCount} D</span> / 
              <span style="font-weight: 800; color: var(--accent-danger); font-size: 1.1rem;">${item.wrongCount} Y</span>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Net: ${item.netScore}</div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // --- TEST MERKEZİ & KONU LİSTESİ ---
  renderTopicsList() {
    const container = document.getElementById('topics-grid');
    if (!container) return;

    const questions = window.storageService.getQuestions();
    const sources = window.storageService.getSources();
    const topics = window.storageService.getTopics();

    container.innerHTML = topics.map(topic => {
      const topicQuestions = questions.filter(q => q.topicId === topic.id);
      const topicSources = sources.filter(s => s.topicId === topic.id);

      return `
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; border-top: 3px solid var(--accent-primary);">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <span style="font-size: 28px;">${topic.icon || '📚'}</span>
              <span class="badge" style="background: rgba(99, 102, 241, 0.15); color: #818cf8; padding: 3px 10px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">
                ${topic.category || 'Mevzuat'}
              </span>
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 8px;">${topic.name}</h3>
            
            <div style="display: flex; gap: 12px; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 18px;">
              <span>📝 <strong>${topicQuestions.length}</strong> Soru</span>
              <span>📂 <strong>${topicSources.length}</strong> Kaynak</span>
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn btn-primary btn-sm" style="flex: 1.2;" onclick="app.startTopicQuiz('${topic.id}', '${topic.name}')">
              ⚡ Test Çöz
            </button>
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="app.openQuickSourceModal('${topic.id}')" title="Bu konuya PDF veya Video ekle">
              📥 Kaynak Ekle
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- HIZLI KONUYA KAYNAK YÜKLEME MODALI ---
  openQuickSourceModal(topicId) {
    const topics = window.storageService.getTopics();
    const topic = topics.find(t => t.id === topicId) || topics[0];
    if (!topic) return;

    this.activeQuickTopic = topic;

    const modal = document.getElementById('quick-source-modal');
    const titleEl = document.getElementById('quick-modal-title');
    const iconEl = document.getElementById('quick-modal-icon');
    const catEl = document.getElementById('quick-modal-category');

    if (titleEl) titleEl.textContent = `${topic.name}`;
    if (iconEl) iconEl.textContent = topic.icon || '📚';
    if (catEl) catEl.textContent = topic.category || 'Mevzuat';

    // Dropzone'u bağla
    this.registerQuickDropzone();

    if (modal) modal.classList.add('active');
  }

  closeQuickSourceModal() {
    const modal = document.getElementById('quick-source-modal');
    if (modal) modal.classList.remove('active');
    this.renderTopicsList();
  }

  switchQuickSourceTab(tab) {
    const pdfTab = document.getElementById('quick-tab-pdf');
    const videoTab = document.getElementById('quick-tab-video');
    const btnPdf = document.getElementById('tab-btn-pdf');
    const btnVideo = document.getElementById('tab-btn-video');

    if (tab === 'pdf') {
      if (pdfTab) pdfTab.style.display = 'block';
      if (videoTab) videoTab.style.display = 'none';
      if (btnPdf) { btnPdf.className = 'btn btn-primary btn-sm'; }
      if (btnVideo) { btnVideo.className = 'btn btn-secondary btn-sm'; }
    } else {
      if (pdfTab) pdfTab.style.display = 'none';
      if (videoTab) videoTab.style.display = 'block';
      if (btnPdf) { btnPdf.className = 'btn btn-secondary btn-sm'; }
      if (btnVideo) { btnVideo.className = 'btn btn-primary btn-sm'; }
    }
  }

  registerQuickDropzone() {
    const dropzone = document.getElementById('quick-pdf-dropzone');
    const fileInput = document.getElementById('quick-pdf-file-input');

    if (dropzone && fileInput) {
      dropzone.onclick = () => fileInput.click();

      dropzone.ondragover = (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      };

      dropzone.ondragleave = () => {
        dropzone.classList.remove('dragover');
      };

      dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
          this.handleQuickFileUpload(e.dataTransfer.files[0]);
        }
      };

      fileInput.onchange = (e) => {
        if (e.target.files.length > 0) {
          this.handleQuickFileUpload(e.target.files[0]);
        }
      };
    }
  }

  async handleQuickFileUpload(file) {
    if (!file || !this.activeQuickTopic) return;

    const topic = this.activeQuickTopic;
    const progEl = document.getElementById('quick-pdf-progress');
    if (progEl) progEl.textContent = `"${file.name}" ayrıştırılıyor...`;

    try {
      let result;
      if (file.name.toLowerCase().endsWith('.pdf')) {
        result = await window.pdfService.extractTextFromPdfFile(file, (prog) => {
          if (progEl) progEl.textContent = `Ayrıştırılıyor: %${prog.percent}`;
        });
      } else {
        result = await window.pdfService.extractTextFromTxtFile(file);
      }

      const saved = window.storageService.addSource({
        type: 'pdf',
        title: result.title,
        fileName: result.fileName,
        size: result.fileSize,
        text: result.text,
        totalPages: result.totalPages,
        topicId: topic.id,
        topicName: topic.name
      });

      this.showToast(`Kaynak "${topic.name}" konusuna başarıyla eklendi!`, 'success');
      this.closeQuickSourceModal();
      this.renderTopicsList();

      // Soru üretmeye yönlendir
      this.openGenerateWithText(saved.text, saved.title, topic.id);

    } catch (err) {
      console.error(err);
      this.showToast(`Hata: ${err.message}`, 'error');
    }
  }

  handleQuickVideoSave() {
    if (!this.activeQuickTopic) return;

    const topic = this.activeQuickTopic;
    const title = document.getElementById('quick-video-title').value.trim();
    const url = document.getElementById('quick-video-url').value.trim();
    const notes = document.getElementById('quick-video-notes').value.trim();

    if (!title || (!url && !notes)) {
      this.showToast('Lütfen başlık ve not/link girin.', 'error');
      return;
    }

    const saved = window.storageService.addSource({
      type: 'video',
      title: title,
      url: url,
      text: `${title}\nKonu: ${topic.name}\nVideo Linki: ${url}\n\nKonu Notları & Transkript:\n${notes}`,
      size: 'Video Notu',
      topicId: topic.id,
      topicName: topic.name
    });

    document.getElementById('quick-video-title').value = '';
    document.getElementById('quick-video-url').value = '';
    document.getElementById('quick-video-notes').value = '';

    this.showToast(`Video kaynağı "${topic.name}" konusuna eklendi!`, 'success');
    this.closeQuickSourceModal();
    this.renderTopicsList();
    this.openGenerateWithText(saved.text, saved.title, topic.id);
  }

  // --- KONU & MÜFREDAT YÖNETİMİ MODALI ---
  openTopicManagerModal() {
    const modal = document.getElementById('topic-manager-modal');
    if (modal) {
      modal.classList.add('active');
      this.renderModalTopicsList();
    }
  }

  closeTopicManagerModal() {
    const modal = document.getElementById('topic-manager-modal');
    if (modal) modal.classList.remove('active');
    this.renderTopicsList();
  }

  renderModalTopicsList() {
    const container = document.getElementById('modal-topics-list');
    if (!container) return;

    const topics = window.storageService.getTopics();
    const questions = window.storageService.getQuestions();

    if (topics.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 14px;">Kayıtlı konu bulunmuyor.</div>`;
      return;
    }

    container.innerHTML = topics.map(t => {
      const qCount = questions.filter(q => q.topicId === t.id).length;
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">${t.icon || '📚'}</span>
            <div>
              <div style="font-weight: 700; font-size: 0.95rem;">${t.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${t.category} • ${qCount} Soru</div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" style="color: var(--accent-danger); padding: 4px 8px;" onclick="app.handleDeleteTopic('${t.id}')">
            🗑️ Sil
          </button>
        </div>
      `;
    }).join('');
  }

  handleAddNewTopic() {
    const name = document.getElementById('new-topic-name').value.trim();
    const category = document.getElementById('new-topic-category').value;
    const icon = document.getElementById('new-topic-icon').value.trim() || '📚';

    if (!name) {
      this.showToast('Lütfen konu adını girin.', 'error');
      return;
    }

    window.storageService.addTopic({ name, category, icon });
    document.getElementById('new-topic-name').value = '';
    this.showToast(`"${name}" konusu başarıyla eklendi!`, 'success');
    this.renderModalTopicsList();
  }

  handleDeleteTopic(topicId) {
    if (confirm('Bu konuyu silmek istediğinize emin misiniz?')) {
      window.storageService.deleteTopic(topicId);
      this.showToast('Konu silindi.', 'info');
      this.renderModalTopicsList();
    }
  }

  handleResetTopics() {
    if (confirm('Tüm konuları ÖSYM resmî varsayılan listesine sıfırlamak istediğinize emin misiniz?')) {
      window.storageService.resetTopicsToDefault();
      this.showToast('Konular varsayılan listeye sıfırlandı.', 'success');
      this.renderModalTopicsList();
    }
  }

  // --- SINAV BAŞLATMA METODLARI ---
  startTopicQuiz(topicId, topicName) {
    const allQuestions = window.storageService.getQuestions();
    const filtered = allQuestions.filter(q => q.topicId === topicId);

    if (filtered.length === 0) {
      this.showToast('Bu konuda henüz kayıtlı soru yok. Kaynaklardan soru üretebilirsiniz.', 'info');
      return;
    }

    this.startQuizSession({
      title: `${topicName} - Pekiştirme Testi`,
      questions: this.shuffleArray(filtered).slice(0, 15),
      mode: 'practice' // Anında çözümü göster
    });
  }

  startQuickQuiz(count = 10) {
    const allQuestions = window.storageService.getQuestions();
    if (allQuestions.length === 0) {
      this.showToast('Soru havuzu boş.', 'error');
      return;
    }

    this.startQuizSession({
      title: `Hızlı Karma Test (${count} Soru)`,
      questions: this.shuffleArray(allQuestions).slice(0, count),
      mode: 'practice'
    });
  }

  startFullExamMock(count = 80, timeLimitMinutes = 150) {
    const allQuestions = window.storageService.getQuestions();
    if (allQuestions.length === 0) {
      this.showToast('Soru havuzu boş. Lütfen önce soru ekleyin veya üretin.', 'error');
      return;
    }

    const examQuestions = this.shuffleArray(allQuestions).slice(0, count);
    const duration = timeLimitMinutes || Math.round(examQuestions.length * 1.8);

    this.startQuizSession({
      title: `2027 EKYS Genel Deneme Sınavı (${examQuestions.length} Soru)`,
      questions: examQuestions,
      mode: 'exam', // Sınav modu: süre sayar, cevapları bitince açıklar
      timeLimitMinutes: duration
    });
  }

  startWrongPoolQuiz() {
    const wrongPool = window.storageService.getWrongPool();
    if (wrongPool.length === 0) {
      this.showToast('Tebrikler! Yanlış defterinizde soru bulunmuyor.', 'success');
      return;
    }

    const allQuestions = window.storageService.getQuestions();
    const wrongQuestions = [];
    wrongPool.forEach(item => {
      const q = allQuestions.find(q => q.id === item.questionId);
      if (q) wrongQuestions.push(q);
    });

    if (wrongQuestions.length === 0) {
      this.showToast('Kayıtlı yanlış soru bulunamadı.', 'info');
      return;
    }

    this.startQuizSession({
      title: `Yanlış Defteri Tekrar Testi (${wrongQuestions.length} Soru)`,
      questions: this.shuffleArray(wrongQuestions),
      mode: 'practice',
      isWrongReview: true
    });
  }

  // --- AKTİF SINAV ÇALIŞTIRICI ---
  startQuizSession(config) {
    this.activeQuiz = {
      title: config.title,
      questions: config.questions,
      mode: config.mode || 'practice',
      isWrongReview: !!config.isWrongReview,
      currentIndex: 0,
      userAnswers: {}, // { [questionId]: selectedKey }
      startTime: Date.now(),
      timeRemaining: config.timeLimitMinutes ? config.timeLimitMinutes * 60 : null,
      isFinished: false
    };

    this.navigateTo('quiz-active');
    this.renderCurrentQuestion();
    this.renderQuestionMap();
    this.startQuizTimer();
  }

  startQuizTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const timerEl = document.getElementById('quiz-timer-display');

    this.timerInterval = setInterval(() => {
      if (!this.activeQuiz || this.activeQuiz.isFinished) {
        clearInterval(this.timerInterval);
        return;
      }

      if (this.activeQuiz.timeRemaining !== null) {
        this.activeQuiz.timeRemaining--;
        if (this.activeQuiz.timeRemaining <= 0) {
          clearInterval(this.timerInterval);
          this.showToast('Süreniz doldu! Sınav otomatik sonlandırılıyor.', 'info');
          this.finishQuiz();
          return;
        }

        const m = Math.floor(this.activeQuiz.timeRemaining / 60);
        const s = this.activeQuiz.timeRemaining % 60;
        if (timerEl) timerEl.textContent = `⏱️ ${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      } else {
        // İleriye doğru süre say
        const elapsed = Math.floor((Date.now() - this.activeQuiz.startTime) / 1000);
        const m = Math.floor(elapsed / 60);
        const s = elapsed % 60;
        if (timerEl) timerEl.textContent = `⏱️ ${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  stopQuizTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  renderCurrentQuestion() {
    if (!this.activeQuiz) return;

    const q = this.activeQuiz.questions[this.activeQuiz.currentIndex];
    const total = this.activeQuiz.questions.length;
    const currentNum = this.activeQuiz.currentIndex + 1;

    // Başlık ve İlerleme
    const titleEl = document.getElementById('quiz-active-title');
    const progressEl = document.getElementById('quiz-progress-text');
    if (titleEl) titleEl.textContent = this.activeQuiz.title;
    if (progressEl) progressEl.textContent = `Soru ${currentNum} / ${total}`;

    // Soru Metni ve Konu
    const topicTagEl = document.getElementById('quiz-q-topic');
    const textEl = document.getElementById('quiz-q-text');
    if (topicTagEl) topicTagEl.textContent = q.topicName || 'EKYS Sorusu';
    if (textEl) textEl.textContent = q.question;

    // Şıklar
    const optionsContainer = document.getElementById('quiz-options-list');
    const selectedKey = this.activeQuiz.userAnswers[q.id];
    const isAnswered = selectedKey !== undefined;

    optionsContainer.innerHTML = q.options.map(opt => {
      let optClass = 'option-item';
      if (selectedKey === opt.key) optClass += ' selected';

      // Practice modundaysa anında doğru/yanlış göster
      if (this.activeQuiz.mode === 'practice' && isAnswered) {
        if (opt.key === q.correctAnswer) {
          optClass += ' correct';
        } else if (selectedKey === opt.key) {
          optClass += ' wrong';
        }
      }

      return `
        <div class="${optClass}" onclick="app.selectOption('${opt.key}')">
          <div class="option-key">${opt.key}</div>
          <div class="option-text">${opt.text}</div>
        </div>
      `;
    }).join('');

    // Çözüm Açıklaması Kutusu
    const expBox = document.getElementById('quiz-explanation-box');
    const expText = document.getElementById('quiz-explanation-text');
    if (expBox && expText) {
      if (this.activeQuiz.mode === 'practice' && isAnswered) {
        expBox.classList.add('show');
        expText.textContent = q.explanation || 'Açıklama bulunmuyor.';
      } else {
        expBox.classList.remove('show');
      }
    }

    // Buton durumları
    const btnPrev = document.getElementById('btn-quiz-prev');
    const btnNext = document.getElementById('btn-quiz-next');
    if (btnPrev) btnPrev.disabled = (this.activeQuiz.currentIndex === 0);
    if (btnNext) {
      if (currentNum === total) {
        btnNext.textContent = '🏁 Testi Bitir';
        btnNext.classList.remove('btn-primary');
        btnNext.classList.add('btn-success');
      } else {
        btnNext.textContent = 'Sonraki Soru ➔';
        btnNext.classList.remove('btn-success');
        btnNext.classList.add('btn-primary');
      }
    }

    this.renderQuestionMap();
  }

  selectOption(optKey) {
    if (!this.activeQuiz || this.activeQuiz.isFinished) return;

    const q = this.activeQuiz.questions[this.activeQuiz.currentIndex];
    
    // Eğer practice modunda ve daha önce cevaplanmışsa değiştirmeye izin verme
    if (this.activeQuiz.mode === 'practice' && this.activeQuiz.userAnswers[q.id] !== undefined) {
      return;
    }

    this.activeQuiz.userAnswers[q.id] = optKey;

    // Yanlış havuzuna ekle / güncelle
    const isCorrect = (optKey === q.correctAnswer);
    if (!isCorrect) {
      window.storageService.addToWrongPool(q.id, optKey, q.correctAnswer);
    } else if (this.activeQuiz.isWrongReview) {
      window.storageService.markWrongPoolReviewed(q.id, true);
    }

    this.renderCurrentQuestion();
  }

  nextQuestion() {
    if (!this.activeQuiz) return;
    if (this.activeQuiz.currentIndex < this.activeQuiz.questions.length - 1) {
      this.activeQuiz.currentIndex++;
      this.renderCurrentQuestion();
    } else {
      this.finishQuiz();
    }
  }

  prevQuestion() {
    if (!this.activeQuiz) return;
    if (this.activeQuiz.currentIndex > 0) {
      this.activeQuiz.currentIndex--;
      this.renderCurrentQuestion();
    }
  }

  renderQuestionMap() {
    const mapContainer = document.getElementById('quiz-question-map');
    if (!mapContainer || !this.activeQuiz) return;

    mapContainer.innerHTML = this.activeQuiz.questions.map((q, idx) => {
      let bubbleClass = 'map-bubble';
      if (idx === this.activeQuiz.currentIndex) bubbleClass += ' current';

      const ans = this.activeQuiz.userAnswers[q.id];
      if (ans !== undefined) {
        if (this.activeQuiz.mode === 'practice') {
          bubbleClass += (ans === q.correctAnswer) ? ' correct' : ' wrong';
        } else {
          bubbleClass += ' answered';
        }
      }

      return `<div class="${bubbleClass}" onclick="app.jumpToQuestion(${idx})">${idx + 1}</div>`;
    }).join('');
  }

  jumpToQuestion(index) {
    if (!this.activeQuiz) return;
    this.activeQuiz.currentIndex = index;
    this.renderCurrentQuestion();
  }

  // --- TEST SONUÇLANDIRMA ---
  finishQuiz() {
    if (!this.activeQuiz) return;
    this.stopQuizTimer();
    this.activeQuiz.isFinished = true;

    let correctCount = 0;
    let wrongCount = 0;
    let emptyCount = 0;

    this.activeQuiz.questions.forEach(q => {
      const userAns = this.activeQuiz.userAnswers[q.id];
      if (userAns === undefined) {
        emptyCount++;
      } else if (userAns === q.correctAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const total = this.activeQuiz.questions.length;
    const elapsedSecs = Math.floor((Date.now() - this.activeQuiz.startTime) / 1000);
    const m = Math.floor(elapsedSecs / 60);
    const s = elapsedSecs % 60;
    const durationFormatted = `${m} dk ${s} sn`;

    // Net Hesaplama (EKYS'de 4 yanlış 1 doğruyu götürmez, ÖSYM EKYS puanı doğrudan doğru sayısıyla veya standart sapmayla hesaplanır)
    const netScore = correctCount; 

    // Sonucu Kaydet
    window.storageService.saveQuizResult({
      title: this.activeQuiz.title,
      totalQuestions: total,
      correctCount,
      wrongCount,
      emptyCount,
      netScore,
      durationFormatted,
      mode: this.activeQuiz.mode
    });

    // Sonuç Modalını Göster
    this.showResultModal({
      title: this.activeQuiz.title,
      total,
      correctCount,
      wrongCount,
      emptyCount,
      netScore,
      durationFormatted,
      scorePercent: Math.round((correctCount / total) * 100)
    });
  }

  showResultModal(res) {
    const modalEl = document.getElementById('result-modal');
    if (!modalEl) return;

    document.getElementById('res-modal-title').textContent = res.title;
    document.getElementById('res-correct').textContent = res.correctCount;
    document.getElementById('res-wrong').textContent = res.wrongCount;
    document.getElementById('res-empty').textContent = res.emptyCount;
    document.getElementById('res-duration').textContent = res.durationFormatted;
    document.getElementById('res-percent').textContent = `%${res.scorePercent}`;

    modalEl.classList.add('active');
  }

  closeResultModal() {
    const modalEl = document.getElementById('result-modal');
    if (modalEl) modalEl.classList.remove('active');
    this.navigateTo('dashboard');
  }

  // --- KONU AÇILIR LİSTELERİNİ DOLDURMA ---
  populateTopicDropdowns() {
    const topics = window.storageService.getTopics();
    const dropdownIds = ['pdf-topic-select', 'video-topic-select', 'gen-topic-select'];

    dropdownIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = topics.map(t => `
          <option value="${t.id}">${t.icon || '📚'} ${t.name} (${t.category || 'Mevzuat'})</option>
        `).join('');
      }
    });
  }

  // --- KAYNAKLAR YÖNETİMİ & PDF/VİDEO YÜKLEME ---
  renderSourcesList() {
    const container = document.getElementById('sources-list-container');
    if (!container) return;

    this.populateTopicDropdowns();

    const sources = window.storageService.getSources();
    if (sources.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 40px; border: 1px dashed var(--border-color); border-radius: var(--radius-lg);">
          <div style="font-size: 40px; margin-bottom: 10px;">📂</div>
          <p>Henüz yüklenmiş bir PDF veya video kaynağınız yok.</p>
          <p style="font-size: 0.85rem;">Yukarıdaki alandan bir konu seçip PDF yükleyebilir veya ders video notlarınızı ekleyebilirsiniz.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = sources.map(src => `
      <div class="card" style="margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; border-left: 4px solid var(--accent-primary);">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="font-size: 32px;">${src.type === 'pdf' ? '📄' : '🎥'}</div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc; padding: 2px 8px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">
                ${src.topicName || 'Genel Mevzuat'}
              </span>
            </div>
            <h4 style="font-size: 1rem; font-weight: 700;">${src.title}</h4>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">
              ${src.type.toUpperCase()} • ${src.size || 'Metin'} • ${new Date(src.createdAt).toLocaleDateString('tr-TR')}
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-primary btn-sm" onclick="app.generateFromSavedSource('${src.id}')">
            ⚡ Bu Kaynaktan Soru Üret
          </button>
          <button class="btn btn-secondary btn-sm" style="color: var(--accent-danger);" onclick="app.deleteSource('${src.id}')">
            🗑️
          </button>
        </div>
      </div>
    `).join('');
  }

  registerDropzones() {
    const dropzone = document.getElementById('pdf-dropzone');
    const fileInput = document.getElementById('pdf-file-input');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
          this.handleFileUpload(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this.handleFileUpload(e.target.files[0]);
        }
      });
    }
  }

  async handleFileUpload(file) {
    if (!file) return;

    const topicSelect = document.getElementById('pdf-topic-select');
    const topicId = topicSelect ? topicSelect.value : 'mevzuat-657';
    const topicName = topicSelect ? topicSelect.options[topicSelect.selectedIndex].text : 'Genel Mevzuat';

    this.showToast(`"${file.name}" ayrıştırılıyor (${topicName}), lütfen bekleyin...`, 'info');

    try {
      let result;
      if (file.name.toLowerCase().endsWith('.pdf')) {
        result = await window.pdfService.extractTextFromPdfFile(file, (prog) => {
          const progressEl = document.getElementById('pdf-upload-progress');
          if (progressEl) progressEl.textContent = `Ayrıştırılıyor: %${prog.percent}`;
        });
      } else {
        result = await window.pdfService.extractTextFromTxtFile(file);
      }

      // Kaynağı seçilen konuya ata
      const saved = window.storageService.addSource({
        type: 'pdf',
        title: result.title,
        fileName: result.fileName,
        size: result.fileSize,
        text: result.text,
        totalPages: result.totalPages,
        topicId: topicId,
        topicName: topicName
      });

      this.showToast(`Kaynak "${topicName}" başlığı altına kaydedildi!`, 'success');
      this.renderSourcesList();

      // Otomatik soru üretim ekranına yönlendir
      this.openGenerateWithText(saved.text, saved.title, topicId);

    } catch (err) {
      console.error(err);
      this.showToast(`Dosya okuma hatası: ${err.message}`, 'error');
    }
  }

  // --- AKILLI KONU TESPİT MOTORU (DERS BAŞLIĞINDAN KONU EŞLEME) ---
  detectMatchingTopicId(titleOrText) {
    if (!titleOrText) return null;
    const clean = titleOrText.toLocaleLowerCase('tr-TR');

    // 1. Kural Bazlı Doğrudan Anahtar Kelimeler
    if (clean.includes('kültür') || clean.includes('uygarlık') || clean.includes('tarih') || clean.includes('coğrafya') || clean.includes('inkılap') || clean.includes('genel kültür')) {
      return 'genel-kultur';
    }
    if (clean.includes('657') || clean.includes('devlet memur') || clean.includes('dmk') || clean.includes('disiplin') || clean.includes('kademe ilerleme')) {
      return 'mevzuat-657';
    }
    if (clean.includes('1739') || clean.includes('milli eğitim temel') || clean.includes('millî eğitim temel') || clean.includes('temel ilkeler')) {
      return 'mevzuat-1739';
    }
    if (clean.includes('222') || clean.includes('ilköğretim ve eğitim') || clean.includes('mecburi ilköğretim')) {
      return 'mevzuat-222';
    }
    if (clean.includes('cbk') || clean.includes('cumhurbaşkanlığı kararnam') || clean.includes('1 nolu') || clean.includes('1 sayılı cbk') || clean.includes('meb teşkilat')) {
      return 'mevzuat-cbk1';
    }
    if (clean.includes('4483') || clean.includes('memurların yargılanma') || clean.includes('soruşturma izni') || clean.includes('ön inceleme')) {
      return 'mevzuat-4483';
    }
    if (clean.includes('3071') || clean.includes('4982') || clean.includes('dilekçe') || clean.includes('bilgi edinme')) {
      return 'mevzuat-3071';
    }
    if (clean.includes('5018') || clean.includes('kamu malî') || clean.includes('kamu mali') || clean.includes('bütçe')) {
      return 'mevzuat-5018';
    }
    if (clean.includes('4688') || clean.includes('sendika') || clean.includes('toplu sözleşme') || clean.includes('grev')) {
      return 'mevzuat-4688';
    }
    if (clean.includes('anayasa') || clean.includes('idare hukuk') || clean.includes('temel hak') || clean.includes('yasama') || clean.includes('yürütme') || clean.includes('yargı')) {
      return 'anayasa';
    }
    if (clean.includes('eğitim yönetimi') || clean.includes('okul yönetimi') || clean.includes('denetim') || clean.includes('örgüt')) {
      return 'egitim-yonetimi';
    }
    if (clean.includes('liderlik') || clean.includes('okul kültürü') || clean.includes('iletişim') || clean.includes('motivasyon') || clean.includes('vizyon')) {
      return 'liderlik';
    }
    if (clean.includes('değer') || clean.includes('etik') || clean.includes('mesleki etik') || clean.includes('ahlak')) {
      return 'degerler-egitimi';
    }

    // 2. Dinamik Konular İçinde Arama
    const topics = window.storageService.getTopics();
    for (const t of topics) {
      const topicNameClean = t.name.toLocaleLowerCase('tr-TR');
      if (clean.includes(topicNameClean) || topicNameClean.split(' ').some(w => w.length > 4 && clean.includes(w))) {
        return t.id;
      }
    }

    return null;
  }

  handleTitleInputMatch(titleText, selectId) {
    if (!titleText || titleText.trim().length < 3) return;
    const detectedTopicId = this.detectMatchingTopicId(titleText);
    const selectEl = document.getElementById(selectId);
    if (detectedTopicId && selectEl && selectEl.value !== detectedTopicId) {
      selectEl.value = detectedTopicId;
    }
  }

  // --- YOUTUBE OTOMATİK LİNK ANALİZİ VE TRANSKRİPT ÇEKME ---
  async handleYouTubeUrlAnalyze() {
    const urlInput = document.getElementById('video-url-input');
    const titleInput = document.getElementById('video-title-input');
    const notesInput = document.getElementById('video-notes-input');
    const previewCard = document.getElementById('video-preview-card');
    const previewThumb = document.getElementById('video-preview-thumb');
    const previewTitle = document.getElementById('video-preview-title');
    const previewChannel = document.getElementById('video-preview-channel');
    const topicSelect = document.getElementById('video-topic-select');
    const ytLinkBtn = document.getElementById('video-yt-link-btn');

    const url = urlInput ? urlInput.value.trim() : '';
    if (!url) {
      this.showToast('Lütfen geçerli bir YouTube video linki girin.', 'error');
      return;
    }

    this.showToast('YouTube videosu çözümleniyor...', 'info');

    try {
      // 1. Resmî YouTube API'si ile video başlığını ve kanalını çek
      const details = await window.youtubeService.fetchVideoDetails(url);
      
      if (titleInput && details.title) {
        titleInput.value = details.title;
      }

      // 🎯 DERS BAŞLIĞINA GÖRE KONU BAŞLIĞINI OTOMATİK EŞLE VE SEÇ
      if (details.title && topicSelect) {
        const detectedTopicId = this.detectMatchingTopicId(details.title);
        if (detectedTopicId) {
          topicSelect.value = detectedTopicId;
          const matchedOpt = topicSelect.options[topicSelect.selectedIndex];
          this.showToast(`🎯 Konu otomatik belirlendi: ${matchedOpt ? matchedOpt.text : ''}`, 'success');
        }
      }

      if (previewCard && previewThumb && previewTitle && previewChannel) {
        previewThumb.src = details.thumbnailUrl;
        previewTitle.textContent = details.title;
        previewChannel.textContent = `📺 Kanal: ${details.author}`;
        previewCard.style.display = 'block';
      }

      if (ytLinkBtn) {
        ytLinkBtn.href = details.url;
        ytLinkBtn.style.display = 'inline-flex';
      }

      // 2. Transkripti çekmeyi dene
      const transcript = await window.youtubeService.fetchTranscript(details.videoId);
      if (transcript && notesInput) {
        notesInput.value = transcript;
        this.showToast('✅ Video başlığı ve transkripti başarıyla yüklendi!', 'success');
      } else {
        this.showToast(`✅ "${details.title}" videosu bağlandı!`, 'success');
      }

    } catch (err) {
      console.warn('YouTube analiz hatası:', err);
      this.showToast('Video linki işlenirken bir hata oluştu.', 'error');
    }
  }

  async pasteClipboardToNotes(textareaId) {
    try {
      const text = await navigator.clipboard.readText();
      const el = document.getElementById(textareaId);
      if (el && text) {
        el.value = text;
        this.showToast('📋 Panodaki metin başarıyla yapıştırıldı!', 'success');
      } else {
        this.showToast('Panoda kopyalanmış bir metin bulunamadı.', 'info');
      }
    } catch (err) {
      this.showToast('Tarayıcınız panoya erişim izni istediğinde izin verin.', 'info');
    }
  }

  addVideoSource() {
    const topicSelect = document.getElementById('video-topic-select');
    const topicId = topicSelect ? topicSelect.value : 'mevzuat-657';
    const topicName = topicSelect ? topicSelect.options[topicSelect.selectedIndex].text : 'Genel Mevzuat';

    const title = document.getElementById('video-title-input').value.trim();
    const url = document.getElementById('video-url-input').value.trim();
    const notes = document.getElementById('video-notes-input').value.trim();

    if (!title && !notes) {
      this.showToast('Lütfen en azından video başlığı veya notlarını girin.', 'error');
      return;
    }

    const finalTitle = title || 'YouTube Ders Videosu';

    const saved = window.storageService.addSource({
      type: 'video',
      title: finalTitle,
      url: url,
      text: `${finalTitle}\nKonu: ${topicName}\nVideo Linki: ${url}\n\nKonu Notları & Transkript:\n${notes || finalTitle}`,
      size: 'YouTube Kaynağı',
      topicId: topicId,
      topicName: topicName
    });

    // Formu temizle
    document.getElementById('video-title-input').value = '';
    document.getElementById('video-url-input').value = '';
    document.getElementById('video-notes-input').value = '';
    const previewCard = document.getElementById('video-preview-card');
    if (previewCard) previewCard.style.display = 'none';

    this.showToast(`Video kaynağı "${topicName}" başlığına eklendi!`, 'success');
    this.renderSourcesList();
    this.openGenerateWithText(saved.text, saved.title, topicId);
  }

  deleteSource(sourceId) {
    if (confirm('Bu kaynağı silmek istediğinize emin misiniz?')) {
      window.storageService.deleteSource(sourceId);
      this.renderSourcesList();
      this.showToast('Kaynak silindi.', 'info');
    }
  }

  generateFromSavedSource(sourceId) {
    const src = window.storageService.getSources().find(s => s.id === sourceId);
    if (src) {
      this.openGenerateWithText(src.text, src.title, src.topicId);
    }
  }

  openGenerateWithText(text, title, topicId = null) {
    this.navigateTo('generate');
    this.populateTopicDropdowns();

    const textInput = document.getElementById('gen-text-input');
    const topicSelect = document.getElementById('gen-topic-select');
    
    if (textInput) textInput.value = text;
    if (topicSelect && topicId) {
      topicSelect.value = topicId;
    }
  }

  // --- SORU ÜRETİMİ (SIFIR API VEYA AI) ---
  async executeQuestionGeneration() {
    const text = document.getElementById('gen-text-input').value.trim();
    const topicSelect = document.getElementById('gen-topic-select');
    const topicId = topicSelect ? topicSelect.value : 'custom-src';
    const topicName = topicSelect ? topicSelect.options[topicSelect.selectedIndex].text : 'Özel Kaynak';
    const count = parseInt(document.getElementById('gen-count-select').value, 10) || 5;
    const settings = window.storageService.getSettings();

    if (!text || text.length < 30) {
      this.showToast('Lütfen soru üretmek için en az birkaç cümlelik kaynak metin girin.', 'error');
      return;
    }

    const btn = document.getElementById('btn-run-generate');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '⏳ Sorular Hazırlanıyor...';
    }

    try {
      let generated = [];

      // 1. Sıfır API / Yerleşik Kural Motoru (Varsayılan ve En Hızlı)
      if (settings.aiProvider === 'none' || !settings.aiProvider) {
        generated = window.questionGeneratorService.generateLocalQuestionsFromText(text, topicName, count);
        
        if (generated.length === 0) {
          generated = window.questionGeneratorService.generateLocalQuestionsFromText(
            text + " Bu kanun maddesi eğitim kurumu yöneticilerinin görev ve sorumluluklarını kapsar.", topicName, count
          );
        }
      } 
      // 2. Gemini API Seçiliyse
      else if (settings.aiProvider === 'gemini') {
        generated = await window.questionGeneratorService.generateQuestionsWithGemini(
          settings.geminiApiKey, text, topicName, count
        );
      } 
      // 3. Groq API Seçiliyse
      else if (settings.aiProvider === 'groq') {
        generated = await window.questionGeneratorService.generateQuestionsWithGroq(
          settings.groqApiKey, text, topicName, count
        );
      }

      if (!generated || generated.length === 0) {
        throw new Error('Metinden soru üretilemedi. Lütfen daha detaylı bir metin girin.');
      }

      // Üretilen sorulara seçilen konunun ID ve Adını bağla
      generated.forEach(q => {
        q.topicId = topicId;
        q.topicName = topicName;
      });

      // Havuza kaydet
      window.storageService.addQuestions(generated);
      this.showToast(`Tebrikler! ${generated.length} soru üretildi ve "${topicName}" havuzuna eklendi.`, 'success');

      // Doğrudan teste başlama seçeneği sun
      if (confirm(`${generated.length} soru "${topicName}" konusuna eklendi! Hemen bu testten soru çözmek ister misiniz?`)) {
        this.startQuizSession({
          title: `${topicName} - Yeni Üretilen Test`,
          questions: generated,
          mode: 'practice'
        });
      } else {
        this.navigateTo('test-hub');
      }

    } catch (err) {
      console.error(err);
      this.showToast(err.message, 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '✨ Test Sorularını Üret';
      }
    }
  }

  // --- AI PROMPT KOPYALA & JSON İÇE AKTAR (SIFIR API ASİSTANI) ---
  copyAiPrompt() {
    const text = document.getElementById('gen-text-input').value.trim();
    const topic = document.getElementById('gen-topic-input').value.trim() || 'EKYS Mevzuat';
    const count = document.getElementById('gen-count-select').value || 5;

    if (!text) {
      this.showToast('Lütfen önce metin alanına kaynak bilgisi girin.', 'error');
      return;
    }

    const prompt = window.questionGeneratorService.buildExamPrompt(text, topic, count);
    navigator.clipboard.writeText(prompt).then(() => {
      this.showToast('AI Prompt kopyalandı! ChatGPT veya Gemini sohbetine yapıştırabilirsiniz.', 'success');
      this.openImportJsonModal();
    });
  }

  openImportJsonModal() {
    const modal = document.getElementById('import-json-modal');
    if (modal) modal.classList.add('active');
  }

  closeImportJsonModal() {
    const modal = document.getElementById('import-json-modal');
    if (modal) modal.classList.remove('active');
  }

  importJsonQuestions() {
    const raw = document.getElementById('json-import-textarea').value.trim();
    const topic = document.getElementById('gen-topic-input').value.trim() || 'AI İçe Aktarılan';

    try {
      const parsed = window.questionGeneratorService.parseAIJsonResponse(raw, topic);
      window.storageService.addQuestions(parsed);
      this.showToast(`${parsed.length} adet soru başarıyla içe aktarıldı!`, 'success');
      this.closeImportJsonModal();
      document.getElementById('json-import-textarea').value = '';
      this.navigateTo('dashboard');
    } catch (err) {
      this.showToast('Geçersiz JSON formatı. Lütfen AI yanıtını eksiksiz yapıştırın.', 'error');
    }
  }

  // --- YANLIŞ DEFTERİ LİSTESİ ---
  renderWrongPoolList() {
    const container = document.getElementById('wrong-pool-container');
    if (!container) return;

    const wrongPool = window.storageService.getWrongPool();
    const allQuestions = window.storageService.getQuestions();

    if (wrongPool.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 50px; border: 1px dashed var(--border-color); border-radius: var(--radius-lg);">
          <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Yanlış Defteriniz Tertemiz!</h3>
          <p style="font-size: 0.9rem;">Çözdüğünüz testlerde yanlış yaptığınız sorular burada toplanır ve aralıklı tekrarla pekiştirilir.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <span style="font-weight: 700; color: var(--accent-danger);">Toplam ${wrongPool.length} Yanlış Soru</span>
        <button class="btn btn-danger btn-sm" onclick="app.startWrongPoolQuiz()">
          🔁 Yanlışları Şimdi Tekrar Çöz
        </button>
      </div>
    ` + wrongPool.map((item, idx) => {
      const q = allQuestions.find(q => q.id === item.questionId);
      if (!q) return '';

      return `
        <div class="card" style="margin-bottom: 16px; border-left: 4px solid var(--accent-danger);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171; padding: 2px 8px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">
              ${q.topicName || 'Mevzuat'} • ${item.wrongCount} Kez Yanlış Yapıldı
            </span>
          </div>
          <div style="font-weight: 600; font-size: 0.95rem; line-height: 1.5; margin-bottom: 12px;">
            ${q.question}
          </div>
          <div style="font-size: 0.85rem; color: var(--accent-success); background: rgba(16, 185, 129, 0.1); padding: 10px; border-radius: var(--radius-sm); margin-bottom: 8px;">
            <strong>Doğru Cevap: ${q.correctAnswer}</strong> - ${q.explanation || ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // --- İSTATİSTİKLER VE BAŞARI ANALİZİ ---
  renderStatsView() {
    const history = window.storageService.getQuizHistory();
    const container = document.getElementById('stats-summary-container');
    if (!container) return;

    if (history.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 40px;">İstatistiklerin oluşması için lütfen önce test çözün.</div>`;
      return;
    }

    let totalTests = history.length;
    let totalQuestions = 0;
    let totalCorrect = 0;
    let totalWrong = 0;

    history.forEach(h => {
      totalQuestions += (h.totalQuestions || 0);
      totalCorrect += (h.correctCount || 0);
      totalWrong += (h.wrongCount || 0);
    });

    const netRate = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;

    container.innerHTML = `
      <div class="grid-cards">
        <div class="card stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-info">
            <div class="stat-value">${totalTests}</div>
            <div class="stat-label">Tamamlanan Test</div>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon" style="color: var(--accent-success); background: rgba(16, 185, 129, 0.15);">✅</div>
          <div class="stat-info">
            <div class="stat-value" style="color: var(--accent-success);">${totalCorrect}</div>
            <div class="stat-label">Toplam Doğru</div>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon" style="color: var(--accent-danger); background: rgba(239, 68, 68, 0.15);">❌</div>
          <div class="stat-info">
            <div class="stat-value" style="color: var(--accent-danger);">${totalWrong}</div>
            <div class="stat-label">Toplam Yanlış</div>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon" style="color: #f59e0b; background: rgba(245, 158, 11, 0.15);">📈</div>
          <div class="stat-info">
            <div class="stat-value" style="color: #f59e0b;">%${netRate}</div>
            <div class="stat-label">Genel Başarı Oranı</div>
          </div>
        </div>
      </div>
    `;
  }

  // --- AYARLAR VE VERİ YÖNETİMİ ---
  loadSettingsForm() {
    const settings = window.storageService.getSettings();
    
    const themeSelect = document.getElementById('setting-theme');
    const aiProviderSelect = document.getElementById('setting-ai-provider');
    const geminiKeyInput = document.getElementById('setting-gemini-key');
    const groqKeyInput = document.getElementById('setting-groq-key');
    const targetDateInput = document.getElementById('setting-target-date');

    if (themeSelect) themeSelect.value = settings.theme || 'dark';
    if (aiProviderSelect) aiProviderSelect.value = settings.aiProvider || 'none';
    if (geminiKeyInput) geminiKeyInput.value = settings.geminiApiKey || '';
    if (groqKeyInput) groqKeyInput.value = settings.groqApiKey || '';
    if (targetDateInput && settings.targetDate) {
      targetDateInput.value = settings.targetDate.split('T')[0];
    }

    this.toggleAiKeyFields();
  }

  saveSettingsFromForm() {
    const theme = document.getElementById('setting-theme').value;
    const aiProvider = document.getElementById('setting-ai-provider').value;
    const geminiApiKey = document.getElementById('setting-gemini-key').value.trim();
    const groqApiKey = document.getElementById('setting-groq-key').value.trim();
    const targetDateVal = document.getElementById('setting-target-date').value;

    window.storageService.saveSettings({
      theme,
      aiProvider,
      geminiApiKey,
      groqApiKey,
      targetDate: targetDateVal ? `${targetDateVal}T09:30:00` : '2027-03-15T09:30:00'
    });

    this.applySavedTheme();
    this.startExamCountdown();
    this.showToast('Ayarlar kaydedildi!', 'success');
  }

  toggleAiKeyFields() {
    const provider = document.getElementById('setting-ai-provider')?.value;
    const geminiGroup = document.getElementById('group-gemini-key');
    const groqGroup = document.getElementById('group-groq-key');

    if (geminiGroup) geminiGroup.style.display = (provider === 'gemini') ? 'block' : 'none';
    if (groqGroup) groqGroup.style.display = (provider === 'groq') ? 'block' : 'none';
  }

  applySavedTheme() {
    const settings = window.storageService.getSettings();
    document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
  }

  exportDataBackup() {
    const data = window.storageService.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EKYS_2027_Yedek_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Yedek dosyası indirildi!', 'success');
  }

  importDataBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        const success = window.storageService.importAllData(json);
        if (success) {
          this.showToast('Veriler başarıyla geri yüklendi!', 'success');
          setTimeout(() => location.reload(), 1000);
        } else {
          this.showToast('Geçersiz yedek dosyası.', 'error');
        }
      } catch (err) {
        this.showToast('Dosya okunamadı.', 'error');
      }
    };
    reader.readAsText(file);
  }

  // --- YARDIMCI TOAST BİLDİRİMLERİ ---
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

// Uygulamayı Başlat
document.addEventListener('DOMContentLoaded', () => {
  window.app = new EKYSApp();
});
