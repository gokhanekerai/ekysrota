// EKYS 2027 - Veri Saklama ve Durum Yönetimi Servisi (LocalStorage & IndexedDB)

class StorageService {
  constructor() {
    this.KEYS = {
      TOPICS: 'ekys_topics_v5',
      QUESTIONS: 'ekys_questions_v5',
      WRONG_POOL: 'ekys_wrong_pool_v10',
      FAVORITES: 'ekys_favorites_v10',
      QUIZ_HISTORY: 'ekys_quiz_history_v10',
      SOURCES: 'ekys_sources_v3',
      SETTINGS: 'ekys_settings_v3',
      STATS: 'ekys_stats_v3',
      CUSTOM_USERS: 'ekys_local_users_v3'
    };

    this.cleanupOldVersions();
    this.initDefaults();
  }

  cleanupOldVersions() {
    // Önceki sürümlerden kalan tüm eski çözüm/test ve kullanıcı verilerini kesin olarak temizle
    const oldKeys = [
      'ekys_local_users_v3', 'ekys_local_users_v2', 'ekys_local_users',
      'ekys_wrong_pool_v9', 'ekys_favorites_v9', 'ekys_quiz_history_v9',
      'ekys_wrong_pool_v8', 'ekys_favorites_v8', 'ekys_quiz_history_v8',
      'ekys_wrong_pool_v7', 'ekys_favorites_v7', 'ekys_quiz_history_v7',
      'ekys_wrong_pool_v6', 'ekys_favorites_v6', 'ekys_quiz_history_v6',
      'ekys_wrong_pool_v5', 'ekys_favorites_v5', 'ekys_quiz_history_v5',
      'ekys_wrong_pool', 'ekys_favorites', 'ekys_quiz_history', 'ekys_stats'
    ];
    oldKeys.forEach(k => {
      try { localStorage.removeItem(k); } catch (e) {}
    });
  }

  initDefaults() {
    const realQuestions = (typeof window !== 'undefined' && Array.isArray(window.EKYS_EXTRACTED_QUESTIONS)) 
      ? [...window.EKYS_EXTRACTED_QUESTIONS] 
      : [];

    const stored = (typeof localStorage !== 'undefined' && localStorage.getItem(this.KEYS.QUESTIONS))
      ? JSON.parse(localStorage.getItem(this.KEYS.QUESTIONS) || '[]')
      : [];

    const dbIds = new Set(realQuestions.map(q => q.id));
    const customQuestions = stored.filter(q => !dbIds.has(q.id));
    const merged = [...realQuestions, ...customQuestions];

    this.saveQuestions(merged);

    // 2. Dinamik Konu Listesini Sadece Bu Gerçek Testlerden Oluştur
    const dynamicTopicMap = new Map();
    merged.forEach(q => {
      if (q.topicId && !dynamicTopicMap.has(q.topicId)) {
        dynamicTopicMap.set(q.topicId, {
          id: q.topicId,
          name: q.topicName || q.testTitle || q.topicId,
          category: q.category || 'Genel Soru Havuzu',
          icon: q.icon || (q.category && q.category.includes('Coğrafya') ? '🌍' : q.category && q.category.includes('Tarih') ? '🏛️' : '🎯'),
          targetQuestions: 20
        });
      }
    });

    const realTopics = Array.from(dynamicTopicMap.values());
    this.saveTopics(realTopics);

    // 3. Yanlış Defteri & Favoriler & Sınav Geçmişi (Temiz Sıfırlanmış)
    if (!localStorage.getItem(this.KEYS.WRONG_POOL)) {
      localStorage.setItem(this.KEYS.WRONG_POOL, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.KEYS.FAVORITES)) {
      localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.KEYS.QUIZ_HISTORY)) {
      localStorage.setItem(this.KEYS.QUIZ_HISTORY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.KEYS.SOURCES)) {
      localStorage.setItem(this.KEYS.SOURCES, JSON.stringify([]));
    }

    // 4. Ayarlar
    if (!localStorage.getItem(this.KEYS.SETTINGS)) {
      const defaultSettings = {
        theme: 'dark',
        targetDate: '2027-03-15T09:30:00',
        aiProvider: 'none',
        geminiApiKey: '',
        groqApiKey: '',
        dailyTarget: 30,
        timerDurationPerQuestion: 90
      };
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }
  }

  // --- KONU & MÜFREDAT YÖNETİMİ ---
  getTopics() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.TOPICS)) || [];
    } catch (e) {
      return [];
    }
  }

  saveTopics(topics) {
    localStorage.setItem(this.KEYS.TOPICS, JSON.stringify(topics));
  }

  addTopic(topic) {
    const topics = this.getTopics();
    const newTopic = {
      id: topic.id || 'topic_' + Date.now(),
      name: topic.name,
      category: topic.category || 'Mevzuat',
      icon: topic.icon || '📚',
      targetQuestions: parseInt(topic.targetQuestions, 10) || 5
    };
    topics.push(newTopic);
    this.saveTopics(topics);
    return newTopic;
  }

  deleteTopic(topicId) {
    let topics = this.getTopics();
    topics = topics.filter(t => t.id !== topicId);
    this.saveTopics(topics);
    return topics;
  }

  // --- SORULAR ---
  getQuestions() {
    try {
      const stored = JSON.parse(localStorage.getItem(this.KEYS.QUESTIONS)) || [];
      const dbQuestions = (typeof window !== 'undefined' && Array.isArray(window.EKYS_EXTRACTED_QUESTIONS)) 
        ? window.EKYS_EXTRACTED_QUESTIONS 
        : [];
      
      const dbIds = new Set(dbQuestions.map(q => q.id));
      const customQuestions = stored.filter(q => !dbIds.has(q.id));
      const merged = [...dbQuestions, ...customQuestions];

      if (merged.length !== stored.length) {
        this.saveQuestions(merged);
      }
      return merged;
    } catch (e) {
      console.error('Soru getirme hatası:', e);
      return (typeof window !== 'undefined' && Array.isArray(window.EKYS_EXTRACTED_QUESTIONS)) ? window.EKYS_EXTRACTED_QUESTIONS : [];
    }
  }

  saveQuestions(questions) {
    localStorage.setItem(this.KEYS.QUESTIONS, JSON.stringify(questions));
  }

  addQuestion(q) {
    const questions = this.getQuestions();
    const newQ = {
      id: q.id || 'q_' + Date.now(),
      topicId: q.topicId,
      topicName: q.topicName || '',
      category: q.category || 'Genel',
      questionNumber: q.questionNumber || (questions.length + 1),
      questionText: q.questionText || q.question || '',
      hasImage: !!q.hasImage,
      image: q.image || '',
      options: q.options || [
        { key: 'A', text: 'A' },
        { key: 'B', text: 'B' },
        { key: 'C', text: 'C' },
        { key: 'D', text: 'D' },
        { key: 'E', text: 'E' }
      ],
      correctAnswer: q.correctAnswer || 'A',
      explanation: q.explanation || ''
    };
    questions.push(newQ);
    this.saveQuestions(questions);
    return newQ;
  }

  addQuestions(newQuestions) {
    const existing = this.getQuestions();
    const merged = [...existing];
    
    newQuestions.forEach(q => {
      if (!merged.find(item => item.id === q.id)) {
        merged.push(q);
      }
    });

    this.saveQuestions(merged);
    return merged;
  }

  getQuestionsByTopic(topicId) {
    const all = this.getQuestions();
    return all.filter(q => q.topicId === topicId);
  }

  getQuestionsByCategory(category) {
    const all = this.getQuestions();
    return all.filter(q => q.category === category);
  }

  // --- YANLIŞ HAVUZU (YANLIŞ DEFTERİ) ---
  getWrongPool() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.WRONG_POOL)) || [];
    } catch (e) {
      return [];
    }
  }

  addToWrongPool(question, userAnswer) {
    const pool = this.getWrongPool();
    const existing = pool.find(item => item.id === question.id);

    if (existing) {
      existing.wrongCount = (existing.wrongCount || 1) + 1;
      existing.lastWrongDate = new Date().toISOString();
      existing.lastUserAnswer = userAnswer;
    } else {
      pool.push({
        ...question,
        wrongCount: 1,
        addedDate: new Date().toISOString(),
        lastWrongDate: new Date().toISOString(),
        lastUserAnswer: userAnswer
      });
    }

    localStorage.setItem(this.KEYS.WRONG_POOL, JSON.stringify(pool));
    this.syncCloud();
    return pool;
  }

  removeFromWrongPool(questionId) {
    let pool = this.getWrongPool();
    pool = pool.filter(item => item.id !== questionId);
    localStorage.setItem(this.KEYS.WRONG_POOL, JSON.stringify(pool));
    this.syncCloud();
    return pool;
  }

  // --- FAVORİ (YILDIZLI) SORULAR ---
  getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.FAVORITES)) || [];
    } catch (e) {
      return [];
    }
  }

  toggleFavorite(question) {
    let favs = this.getFavorites();
    const idx = favs.findIndex(item => item.id === question.id);
    let isFav = false;

    if (idx !== -1) {
      favs.splice(idx, 1);
      isFav = false;
    } else {
      favs.push({ ...question, favoritedAt: new Date().toISOString() });
      isFav = true;
    }

    localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(favs));
    this.syncCloud();
    return isFav;
  }

  isFavorite(questionId) {
    const favs = this.getFavorites();
    return favs.some(item => item.id === questionId);
  }

  // --- SINAV VE TEST GEÇMİŞİ ---
  getQuizHistory() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.QUIZ_HISTORY)) || [];
    } catch (e) {
      return [];
    }
  }

  saveQuizResult(result) {
    const history = this.getQuizHistory();
    const entry = {
      id: 'quiz_' + Date.now(),
      date: new Date().toISOString(),
      title: result.title || 'Genel Test',
      totalQuestions: result.totalQuestions,
      correctCount: result.correctCount,
      wrongCount: result.wrongCount,
      emptyCount: result.emptyCount || 0,
      score: result.score !== undefined ? result.score : (result.totalQuestions > 0 ? ((result.correctCount / result.totalQuestions) * 100) : 0),
      netScore: result.score !== undefined ? result.score : (result.netScore !== undefined ? result.netScore : (result.totalQuestions > 0 ? ((result.correctCount / result.totalQuestions) * 100) : 0)),
      durationSeconds: result.durationSeconds || 0,
      topicId: result.topicId || 'all',
      isDeneme: !!result.isDeneme,
      isCikmis: !!result.isCikmis,
      isScored: result.isScored !== undefined ? !!result.isScored : (!!result.isDeneme || !!result.isCikmis)
    };

    history.unshift(entry);
    localStorage.setItem(this.KEYS.QUIZ_HISTORY, JSON.stringify(history.slice(0, 100)));
    this.syncCloud();
    return entry;
  }

  // --- KAYNAKLAR (PDF / METİN) ---
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
      type: source.type || 'pdf',
      title: source.title,
      text: source.text || '',
      size: source.size || '0 KB',
      topicId: source.topicId || 'mevzuat-657',
      topicName: source.topicName || 'Genel',
      createdAt: new Date().toISOString()
    };
    sources.unshift(newSource);
    localStorage.setItem(this.KEYS.SOURCES, JSON.stringify(sources));
    this.syncCloud();
    return newSource;
  }

  deleteSource(id) {
    let sources = this.getSources();
    sources = sources.filter(s => s.id !== id);
    localStorage.setItem(this.KEYS.SOURCES, JSON.stringify(sources));
    this.syncCloud();
    return sources;
  }

  // --- AYARLAR & GÜNLÜK HEDEF ---
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.SETTINGS)) || {};
    } catch (e) {
      return {};
    }
  }

  saveSettings(settings) {
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    this.syncCloud();
  }

  getDailyTarget() {
    const s = this.getSettings();
    return parseInt(s.dailyTarget, 10) || 30;
  }

  setDailyTarget(count) {
    const s = this.getSettings();
    const val = Math.max(5, parseInt(count, 10) || 30);
    s.dailyTarget = val;
    this.saveSettings(s);
    return val;
  }

  syncCloud() {
    if (typeof window !== 'undefined' && window.firebaseService) {
      window.firebaseService.syncAllDataToCloud();
    }
  }

  exportAllData() {
    // Sadece kullanıcıya özel durumları buluta gönder (statik soru bankası hariç, 1MB limitini korur)
    let customQuestions = [];
    try {
      const storedQuestions = JSON.parse(localStorage.getItem(this.KEYS.QUESTIONS)) || [];
      const dbQuestions = (typeof window !== 'undefined' && Array.isArray(window.EKYS_EXTRACTED_QUESTIONS)) 
        ? window.EKYS_EXTRACTED_QUESTIONS 
        : [];
      const dbIds = new Set(dbQuestions.map(q => q.id));
      customQuestions = storedQuestions.filter(q => !dbIds.has(q.id));
    } catch (e) {}

    return {
      customQuestions: customQuestions,
      wrongPool: this.getWrongPool(),
      favorites: this.getFavorites(),
      quizHistory: this.getQuizHistory(),
      sources: this.getSources(),
      settings: this.getSettings()
    };
  }

  // --- TÜM SORU ÇÖZÜM & TEST VERİLERİNİ SIFIRLAMA ---
  clearAllQuizData() {
    localStorage.setItem(this.KEYS.QUIZ_HISTORY, JSON.stringify([]));
    localStorage.setItem(this.KEYS.WRONG_POOL, JSON.stringify([]));
    localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify([]));
    
    // Bulut senkronizasyonunu da anında sıfırla
    if (typeof window !== 'undefined' && window.firebaseService) {
      window.firebaseService.syncAllDataToCloud(true);
    }
  }

  importAllData(data, isRealtimeSync = false) {
    if (!data) return;

    // Eğer veri temizlenmiş veya sıfırlanmışsa doğrudan sıfırla
    if (data.isCleanWipe) {
      localStorage.setItem(this.KEYS.QUIZ_HISTORY, JSON.stringify([]));
      localStorage.setItem(this.KEYS.WRONG_POOL, JSON.stringify([]));
      localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify([]));
      return;
    }

    // 1. Sınav Geçmişini Senkronize Et (Realtime Sync'te tam listeyi veya birleşimi al)
    if (Array.isArray(data.quizHistory)) {
      if (isRealtimeSync) {
        // Canlı otomatik senkronizasyonda buluttaki güncel listeyi doğrudan al
        localStorage.setItem(this.KEYS.QUIZ_HISTORY, JSON.stringify(data.quizHistory.slice(0, 300)));
      } else {
        const localHistory = this.getQuizHistory();
        const map = new Map();
        localHistory.forEach(h => {
          const key = h.id || `${h.date}_${h.title}`;
          map.set(key, h);
        });
        data.quizHistory.forEach(h => {
          const key = h.id || `${h.date}_${h.title}`;
          map.set(key, h);
        });
        const mergedHistory = Array.from(map.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
        localStorage.setItem(this.KEYS.QUIZ_HISTORY, JSON.stringify(mergedHistory.slice(0, 300)));
      }
    }

    // 2. Yanlış Havuzunu Senkronize Et
    if (Array.isArray(data.wrongPool)) {
      if (isRealtimeSync) {
        localStorage.setItem(this.KEYS.WRONG_POOL, JSON.stringify(data.wrongPool));
      } else {
        const localWrong = this.getWrongPool();
        const map = new Map();
        localWrong.forEach(q => map.set(q.id, q));
        data.wrongPool.forEach(q => map.set(q.id, q));
        localStorage.setItem(this.KEYS.WRONG_POOL, JSON.stringify(Array.from(map.values())));
      }
    }

    // 3. Yıldızlı Soruları Senkronize Et
    if (Array.isArray(data.favorites)) {
      if (isRealtimeSync) {
        localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(data.favorites));
      } else {
        const localFav = this.getFavorites();
        const map = new Map();
        localFav.forEach(q => map.set(q.id, q));
        data.favorites.forEach(q => map.set(q.id, q));
        localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(Array.from(map.values())));
      }
    }

    // 4. Özel Sorular
    if (Array.isArray(data.customQuestions) && data.customQuestions.length > 0) {
      this.addQuestions(data.customQuestions);
    }

    if (data.sources) localStorage.setItem(this.KEYS.SOURCES, JSON.stringify(data.sources));
    if (data.settings) localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(data.settings));
  }

  // --- YÖNETİCİ TARAFINDAN TANIMLANAN KULLANICILAR (KULLANICI ADI & ŞİFRE) ---
  getCustomUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.CUSTOM_USERS)) || [];
    } catch (e) {
      return [];
    }
  }

  saveCustomUser(user) {
    let users = this.getCustomUsers();
    const uname = (user.username || user.email || '').trim().toLowerCase();
    users = users.filter(u => (u.username || u.email || '').trim().toLowerCase() !== uname);
    users.push({
      ...user,
      username: uname,
      createdAt: user.createdAt || new Date().toISOString()
    });
    localStorage.setItem(this.KEYS.CUSTOM_USERS, JSON.stringify(users));
    this.syncCloud();
    return users;
  }

  removeCustomUser(username) {
    let users = this.getCustomUsers();
    const uname = (username || '').trim().toLowerCase();
    users = users.filter(u => (u.username || u.email || '').trim().toLowerCase() !== uname);
    localStorage.setItem(this.KEYS.CUSTOM_USERS, JSON.stringify(users));
    this.syncCloud();
    return users;
  }

  findCustomUser(username, password) {
    const users = this.getCustomUsers();
    const uname = (username || '').trim().toLowerCase();
    return users.find(u => (u.username || u.email || '').trim().toLowerCase() === uname && u.password === password);
  }
}

if (typeof window !== 'undefined') {
  window.storageService = new StorageService();
}
