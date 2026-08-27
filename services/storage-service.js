// EKYS 2027 - Veri Saklama ve Durum Yönetimi Servisi (LocalStorage & IndexedDB)

class StorageService {
  constructor() {
    this.KEYS = {
      QUESTIONS: 'ekys_questions_v1',
      WRONG_POOL: 'ekys_wrong_pool_v1',
      QUIZ_HISTORY: 'ekys_quiz_history_v1',
      SOURCES: 'ekys_sources_v1',
      SETTINGS: 'ekys_settings_v1',
      STATS: 'ekys_stats_v1'
    };

    this.initDefaults();
  }

  initDefaults() {
    // İlk açılışta hazır soruları yükle
    if (!localStorage.getItem(this.KEYS.QUESTIONS)) {
      const defaultQuestions = (typeof window !== 'undefined' && window.INITIAL_QUESTIONS) ? window.INITIAL_QUESTIONS : [];
      localStorage.setItem(this.KEYS.QUESTIONS, JSON.stringify(defaultQuestions));
    }

    if (!localStorage.getItem(this.KEYS.WRONG_POOL)) {
      localStorage.setItem(this.KEYS.WRONG_POOL, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.KEYS.QUIZ_HISTORY)) {
      localStorage.setItem(this.KEYS.QUIZ_HISTORY, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.KEYS.SOURCES)) {
      localStorage.setItem(this.KEYS.SOURCES, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.KEYS.SETTINGS)) {
      const defaultSettings = {
        theme: 'dark',
        targetDate: '2027-03-15T09:30:00', // 2027 Mart EKYS tahmini tarihi
        aiProvider: 'none', // 'none' (sıfır api yerleşik), 'gemini', 'groq', 'openai'
        geminiApiKey: '',
        groqApiKey: '',
        dailyTarget: 30, // Günlük hedef soru sayısı
        timerDurationPerQuestion: 90 // Soru başı 90 sn (EKYS standartı)
      };
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }
  }

  // --- SORULAR ---
  getQuestions() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.QUESTIONS)) || [];
    } catch (e) {
      console.error('Soru getirme hatası:', e);
      return [];
    }
  }

  saveQuestions(questions) {
    localStorage.setItem(this.KEYS.QUESTIONS, JSON.stringify(questions));
  }

  addQuestions(newQuestions) {
    const existing = this.getQuestions();
    const merged = [...existing];
    
    newQuestions.forEach(q => {
      if (!merged.find(item => item.id === q.id || (item.question === q.question && item.topicId === q.topicId))) {
        merged.push(q);
      }
    });

    this.saveQuestions(merged);
    return merged;
  }

  // --- YANLIŞ HAVUZU (SPACED REPETITION) ---
  getWrongPool() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.WRONG_POOL)) || [];
    } catch (e) {
      return [];
    }
  }

  addToWrongPool(questionId, selectedAnswer, correctAnswer) {
    const pool = this.getWrongPool();
    const existingIndex = pool.findIndex(item => item.questionId === questionId);

    const wrongItem = {
      questionId,
      wrongCount: existingIndex >= 0 ? pool[existingIndex].wrongCount + 1 : 1,
      lastFailedAt: new Date().toISOString(),
      nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 gün sonra tekrar
      solvedCorrectlyInReviewCount: 0
    };

    if (existingIndex >= 0) {
      pool[existingIndex] = { ...pool[existingIndex], ...wrongItem };
    } else {
      pool.push(wrongItem);
    }

    localStorage.setItem(this.KEYS.WRONG_POOL, JSON.stringify(pool));
  }

  markWrongPoolReviewed(questionId, isCorrect) {
    let pool = this.getWrongPool();
    const item = pool.find(i => i.questionId === questionId);
    
    if (item) {
      if (isCorrect) {
        item.solvedCorrectlyInReviewCount = (item.solvedCorrectlyInReviewCount || 0) + 1;
        // 2 kere doğru çözerse havuzdan çıkar
        if (item.solvedCorrectlyInReviewCount >= 2) {
          pool = pool.filter(i => i.questionId !== questionId);
        } else {
          // 3 gün sonraya ertele
          item.nextReviewDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
        }
      } else {
        item.wrongCount = (item.wrongCount || 1) + 1;
        item.solvedCorrectlyInReviewCount = 0;
        item.nextReviewDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      }
      localStorage.setItem(this.KEYS.WRONG_POOL, JSON.stringify(pool));
    }
  }

  // --- KAYNAKLAR (PDF, VİDEO, NOTLAR) ---
  getSources() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.SOURCES)) || [];
    } catch (e) {
      return [];
    }
  }

  addSource(source) {
    const sources = this.getSources();
    const newSource = {
      id: 'src_' + Date.now(),
      createdAt: new Date().toISOString(),
      questionCount: 0,
      ...source
    };
    sources.unshift(newSource);
    localStorage.setItem(this.KEYS.SOURCES, JSON.stringify(sources));
    return newSource;
  }

  deleteSource(sourceId) {
    const sources = this.getSources().filter(s => s.id !== sourceId);
    localStorage.setItem(this.KEYS.SOURCES, JSON.stringify(sources));
  }

  // --- TEST GEÇMİŞİ VE İSTATİSTİKLER ---
  getQuizHistory() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.QUIZ_HISTORY)) || [];
    } catch (e) {
      return [];
    }
  }

  saveQuizResult(result) {
    const history = this.getQuizHistory();
    const newResult = {
      id: 'res_' + Date.now(),
      date: new Date().toISOString(),
      ...result
    };
    history.unshift(newResult);
    localStorage.setItem(this.KEYS.QUIZ_HISTORY, JSON.stringify(history));
    return newResult;
  }

  // --- AYARLAR ---
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.SETTINGS)) || {};
    } catch (e) {
      return {};
    }
  }

  saveSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }

  // --- TOPLU SIFIRLAMA VEYA YEDEK ALMA ---
  exportAllData() {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      questions: this.getQuestions(),
      wrongPool: this.getWrongPool(),
      history: this.getQuizHistory(),
      sources: this.getSources(),
      settings: this.getSettings()
    };
  }

  importAllData(jsonData) {
    if (!jsonData || typeof jsonData !== 'object') return false;
    if (jsonData.questions) localStorage.setItem(this.KEYS.QUESTIONS, JSON.stringify(jsonData.questions));
    if (jsonData.wrongPool) localStorage.setItem(this.KEYS.WRONG_POOL, JSON.stringify(jsonData.wrongPool));
    if (jsonData.history) localStorage.setItem(this.KEYS.QUIZ_HISTORY, JSON.stringify(jsonData.history));
    if (jsonData.sources) localStorage.setItem(this.KEYS.SOURCES, JSON.stringify(jsonData.sources));
    if (jsonData.settings) localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(jsonData.settings));
    return true;
  }
}

if (typeof window !== 'undefined') {
  window.storageService = new StorageService();
}
