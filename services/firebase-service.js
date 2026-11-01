// EKYS 2027 Pro - Firebase Entegrasyon & Bulut Senkronizasyon Servisi

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyB18Kmb-B3fgXZveJ9UMweE4WERTeHJf10",
  authDomain: "ekysrota.firebaseapp.com",
  projectId: "ekysrota",
  storageBucket: "ekysrota.firebasestorage.app",
  messagingSenderId: "376029520553",
  appId: "1:376029520553:web:7c4c06a8710c642fd83fb8",
  measurementId: "G-W6W6QKMBL2"
};

class FirebaseService {
  constructor() {
    this.isInitialized = false;
    this.currentUser = null;
    this.currentUserDoc = null;
    this.auth = null;
    this.db = null;
    this.MASTER_USER_HASH = '6836709e8b442526079bf97fedf6150d00398e8df5c6b97f1763185a3eaf4eeb';
    this.MASTER_PASS_HASH = '1310bcdbfbb4ee4514d0d6d9af2a9a3b31a83d4d6457c8f0d37aecfdc368d3d8';
    this.MASTER_AUTH_TOKEN = 'sec_v238_6836709e';

    // Kayıtlı yerel oturum varsa doğrula ve başlat
    const savedSession = localStorage.getItem('ekys_active_session_v3');
    if (savedSession) {
      try {
        const doc = JSON.parse(savedSession);
        if (doc && doc.role === 'admin' && doc.authToken !== this.MASTER_AUTH_TOKEN) {
          localStorage.removeItem('ekys_active_session_v3');
        } else if (doc) {
          this.currentUserDoc = doc;
          this.currentUser = { uid: doc.uid, email: doc.email, displayName: doc.displayName };
        }
      } catch (e) {
        console.warn('Session parse hatası:', e);
      }
    }

    this.initFirebase(DEFAULT_FIREBASE_CONFIG);
  }

  // Saf JS SHA-256 Kriptografik Özet Fonksiyonu (Tüm tarayıcılarda çalışır)
  sha256(str) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    let ascii = unescape(encodeURIComponent(String(str || '')));
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    const lengthProperty = 'length';
    let i, j;
    let result = '';
    const words = [];
    const asciiBitLength = ascii[lengthProperty] * 8;
    let hash = [];
    const k = [];
    let primeCounter = 0;
    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += '\x80';
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii[lengthProperty]; i++) {
      j = ascii.charCodeAt(i);
      if (j >> 8) return '';
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength);
    for (j = 0; j < words[lengthProperty];) {
      const w = words.slice(j, j += 16);
      const oldHash = hash;
      hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const a = hash[0], e = hash[4];
        const temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
          + ((e & hash[5]) ^ ((~e) & hash[6]))
          + k[i]
          + (w[i] = (i < 16) ? w[i] : (
              w[i - 16]
              + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
              + w[i - 7]
              + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
            ) | 0
          );
        const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }
      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }
    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += ((b < 16) ? 0 : '') + b.toString(16);
      }
    }
    return result;
  }

  encodeStudentPass(plain) {
    try {
      const key = 'EKYS_ROTA_2027_SEC_KEY';
      const raw = unescape(encodeURIComponent(String(plain || '')));
      let out = '';
      for (let i = 0; i < raw.length; i++) {
        out += String.fromCharCode(raw.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return 'enc1_' + btoa(out);
    } catch (e) {
      return '';
    }
  }

  decodeStudentPass(enc) {
    try {
      if (!enc || !String(enc).startsWith('enc1_')) return enc || '';
      const key = 'EKYS_ROTA_2027_SEC_KEY';
      const raw = atob(String(enc).slice(5));
      let out = '';
      for (let i = 0; i < raw.length; i++) {
        out += String.fromCharCode(raw.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return decodeURIComponent(escape(out));
    } catch (e) {
      return '••••••';
    }
  }

  initFirebase(config) {
    try {
      if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
          firebase.initializeApp(config);
        }
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.isInitialized = true;

        this.setupRealtimeSync();

        this.auth.onAuthStateChanged(async (user) => {
          if (user) {
            this.currentUser = user;
            await this.loadUserProfile(user);
            await this.syncAllDataFromCloud();
          } else if (this.currentUserDoc) {
            this.currentUser = { uid: this.currentUserDoc.uid, email: this.currentUserDoc.email, displayName: this.currentUserDoc.displayName };
            await this.syncAllDataFromCloud();
          } else {
            let localSess = null;
            try {
              localSess = JSON.parse(localStorage.getItem('ekys_active_session_v3') || 'null');
            } catch (e) {}

            if (localSess && localSess.role === 'admin' && localSess.authToken !== this.MASTER_AUTH_TOKEN) {
              localStorage.removeItem('ekys_active_session_v3');
              localSess = null;
            }

            if (localSess && (localSess.username || localSess.uid)) {
              this.currentUser = {
                uid: localSess.uid || (localSess.role === 'admin' ? 'uid_master_admin' : 'uid_student'),
                email: localSess.email || `${localSess.username}@ekysrota.com`,
                displayName: localSess.displayName || localSess.username,
                role: localSess.role || 'student'
              };
              this.currentUserDoc = localSess;
            } else {
              this.currentUser = null;
              this.currentUserDoc = null;
            }
          }
          this.onAuthChange(this.currentUser);
        });
      }
    } catch (err) {
      console.warn('Firebase başlatma uyarısı:', err);
    }

    // İlk yüklemede oturum durumunu güncelle
    setTimeout(() => {
      this.onAuthChange(this.currentUser);
    }, 100);
  }

  // --- CANLI GERÇEK ZAMANLI SENKRONİZASYON (KULLANICI BAZLI İZOLE) ---
  setupRealtimeSync() {
    this.setupUserRealtimeSync();

    // 2. Ekran Değişimi ve Sekme Odaklanmasında Otomatik Senkronizasyon
    if (typeof window !== 'undefined' && !this.visibilityListenersSet) {
      this.visibilityListenersSet = true;
      window.addEventListener('focus', () => {
        this.syncAllDataFromCloud();
      });

      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          this.syncAllDataFromCloud();
        }
      });

      window.addEventListener('online', () => {
        this.syncAllDataFromCloud();
      });

      // 30 saniyelik periyodik arka plan senkronizasyon kontrolü
      setInterval(() => {
        this.syncAllDataFromCloud();
      }, 30000);
    }
  }

  setupUserRealtimeSync() {
    if (!this.db) return;

    if (this.realtimeUnsubscribe && typeof this.realtimeUnsubscribe === 'function') {
      try { this.realtimeUnsubscribe(); } catch (e) {}
      this.realtimeUnsubscribe = null;
    }

    const isUserAdmin = this.isAdmin();
    const targetDoc = isUserAdmin 
      ? 'users/uid_master_admin' 
      : (this.currentUser && this.currentUser.uid ? `users/${this.currentUser.uid}` : null);
    
    if (!targetDoc) return;

    try {
      const [col, docId] = targetDoc.split('/');
      this.realtimeUnsubscribe = this.db.collection(col).doc(docId).onSnapshot((doc) => {
        if (doc && doc.exists) {
          const data = doc.data();
          if (data && data.storageData && window.storageService) {
            const lastLocalSync = this.lastLocalWriteTime || 0;
            if (Date.now() - lastLocalSync < 1500) {
              return;
            }
            window.storageService.importAllData(data.storageData, true);
            this.refreshActiveUI();
          }
        }
      }, (err) => {
        console.warn('Realtime snapshot dinleme uyarısı:', err.message || err);
      });
    } catch (e) {
      console.warn('Realtime sync başlatılamadı:', e);
    }
  }

  refreshActiveUI() {
    if (window.app) {
      try {
        if (typeof window.app.renderDashboard === 'function') window.app.renderDashboard();
        if (typeof window.app.renderStatsView === 'function') window.app.renderStatsView();
        if (typeof window.app.renderWrongPoolList === 'function') window.app.renderWrongPoolList();
        if (typeof window.app.renderFavoritesList === 'function') window.app.renderFavoritesList();
        if (typeof window.app.updateHeaderTarget === 'function') window.app.updateHeaderTarget();
      } catch (e) {
        console.warn('UI refresh hatası:', e);
      }
    }
  }

  // --- TÜM BULUT VE YEREL VERİLERİ SIFIRLAMA ---
  async clearAllDataAndCloud() {
    if (window.storageService) {
      window.storageService.clearAllQuizData();
    }

    if (this.db) {
      try {
        await this.ensureAuth();
      } catch (e) {}

      const cleanPayload = {
        storageData: {
          quizHistory: [],
          wrongPool: [],
          favorites: [],
          customQuestions: [],
          isCleanWipe: true
        },
        email: (this.currentUser && this.currentUser.email) ? this.currentUser.email.toLowerCase() : 'admin@ekysrota.com',
        displayName: (this.currentUser && this.currentUser.displayName) || 'Gökhan Eker (Yönetici)',
        lastSyncedAt: new Date().toISOString(),
        isCleanWipe: true
      };

      try {
        await this.db.collection('global_sync').doc('master_state').set(cleanPayload);
        await this.db.collection('users').doc('uid_master_admin').set(cleanPayload);
        if (this.currentUser && this.currentUser.uid) {
          await this.db.collection('users').doc(this.currentUser.uid).set(cleanPayload);
        }
      } catch (err) {
        console.warn('Bulut verilerini sıfırlama uyarısı:', err);
      }
    }

    this.refreshActiveUI();
    return true;
  }

  async loginWithEmail(email, password) {
    const cleanInput = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanInput) {
      throw new Error('Lütfen kullanıcı adınızı giriniz.');
    }
    if (!cleanPass) {
      throw new Error('Lütfen şifrenizi giriniz.');
    }

    const inputUserHash = this.sha256(cleanInput);
    const inputPassHash = this.sha256(cleanPass);

    // 1. Master Admin Girişi (SHA-256 Kriptografik Doğrulama - gokhaneker)
    if (inputUserHash === this.MASTER_USER_HASH) {
      if (inputPassHash !== this.MASTER_PASS_HASH) {
        throw new Error('Yönetici şifresi hatalıdır! Lütfen şifrenizi kontrol ediniz.');
      }
      const localUser = {
        uid: 'uid_master_admin',
        email: 'admin@ekysrota.com',
        displayName: 'Gökhan Eker (Yönetici)'
      };
      this.currentUser = localUser;
      this.currentUserDoc = {
        uid: localUser.uid,
        username: cleanInput,
        email: localUser.email,
        displayName: 'Gökhan Eker (Yönetici)',
        role: 'admin',
        authToken: this.MASTER_AUTH_TOKEN,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('ekys_active_session_v3', JSON.stringify(this.currentUserDoc));
      this.onAuthChange(this.currentUser);
      await this.syncAllDataFromCloud();
      return this.currentUser;
    }

    // Eski standart 'admin' veya 'gokhan' denemelerini engelle
    if (cleanInput === 'admin' || cleanInput === 'gokhan' || cleanInput === 'admin@ekysrota.com' || cleanInput === 'gokhan@ekysrota.com') {
      throw new Error('Bu kullanıcı sisteme kayıtlı değildir veya şifre hatalıdır.');
    }

    // 2. Bulut (Firestore custom_users) Öğrenci / Yetkili Kullanıcı Kontrolü
    if (this.db) {
      try {
        let uData = null;
        let foundKey = cleanInput;
        const docRef = await this.db.collection('custom_users').doc(cleanInput).get();
        if (docRef.exists) {
          uData = docRef.data();
        } else {
          const qSnap = await this.db.collection('custom_users').where('username', '==', cleanInput).limit(1).get();
          if (!qSnap.empty) {
            uData = qSnap.docs[0].data();
            foundKey = qSnap.docs[0].id;
          }
        }

        if (uData) {
          const passMatched =
            (uData.passwordHash && uData.passwordHash === inputPassHash) ||
            (uData.passwordEnc && this.decodeStudentPass(uData.passwordEnc) === cleanPass) ||
            (uData.password && String(uData.password).trim() === cleanPass);

          if (passMatched) {
            const displayName = uData.displayName || uData.username || cleanInput;
            const localUser = {
              uid: 'uid_' + (uData.username || foundKey),
              email: uData.email || `${cleanInput}@ekysrota.local`,
              displayName: displayName
            };
            this.currentUser = localUser;
            this.currentUserDoc = {
              uid: localUser.uid,
              username: uData.username || foundKey,
              email: localUser.email,
              displayName: displayName,
              role: 'student',
              createdAt: uData.createdAt || new Date().toISOString()
            };
            localStorage.setItem('ekys_active_session_v3', JSON.stringify(this.currentUserDoc));
            this.onAuthChange(this.currentUser);
            await this.syncAllDataFromCloud();
            return this.currentUser;
          } else {
            throw new Error('Girdiğiniz şifre hatalıdır. Lütfen şifrenizi kontrol ediniz.');
          }
        }
      } catch (dbErr) {
        if (dbErr.message && dbErr.message.includes('şifre hatalıdır')) throw dbErr;
        console.warn('Bulut kullanıcı sorgu hatası:', dbErr);
      }
    }

    // 3. Yerel Tanımlı (LocalStorage) Kullanıcı Kontrolü (Fallback)
    const customUser = window.storageService ? window.storageService.findCustomUser(cleanInput, cleanPass) : null;
    if (customUser) {
      const displayName = customUser.name || customUser.displayName || cleanInput;
      const localUser = {
        uid: 'uid_' + cleanInput,
        email: `${cleanInput}@ekysrota.local`,
        displayName: displayName
      };
      this.currentUser = localUser;
      this.currentUserDoc = {
        uid: localUser.uid,
        username: cleanInput,
        email: localUser.email,
        displayName: displayName,
        role: 'student',
        createdAt: customUser.createdAt || new Date().toISOString()
      };
      localStorage.setItem('ekys_active_session_v3', JSON.stringify(this.currentUserDoc));
      this.onAuthChange(this.currentUser);
      await this.syncAllDataFromCloud();
      return this.currentUser;
    }

    // 4. Tanımsız Kullanıcı Uyarısı
    throw new Error('Bu kullanıcı sisteme kayıtlı değildir veya şifre hatalıdır. Lütfen yöneticinizle görüşün.');
  }

  async registerWithEmail() {
    throw new Error('Yeni kullanıcı kaydı yalnızca Yönetici tarafından yapılabilir.');
  }

  async loginWithGoogle() {
    throw new Error('Lütfen yönetici tarafından tanımlanan kullanıcı adı ve şifrenizle giriş yapınız.');
  }

  async logout() {
    localStorage.removeItem('ekys_active_session_v3');
    this.currentUser = null;
    this.currentUserDoc = null;
    if (this.auth) {
      try {
        await this.auth.signOut();
      } catch (e) {
        console.warn('Firebase signOut:', e);
      }
    }
    this.onAuthChange(null);
  }

  async loadUserProfile(user) {
    if (!user) return;
  }

  isAdmin() {
    return !!(
      this.currentUserDoc &&
      this.currentUserDoc.role === 'admin' &&
      this.currentUserDoc.authToken === this.MASTER_AUTH_TOKEN
    );
  }

  // --- YÖNETİCİ (ADMIN) İŞLEMLERİ: KULLANICI LİSTELE / EKLE / ÇIKAR ---
  async saveCustomUserCloud(userData) {
    if (!this.db) return false;
    try {
      const uname = (userData.username || userData.email || '').trim().toLowerCase();
      const rawPass = String(userData.password || '').trim();
      await this.db.collection('custom_users').doc(uname).set({
        username: uname,
        passwordHash: this.sha256(rawPass),
        passwordEnc: this.encodeStudentPass(rawPass),
        displayName: userData.displayName || userData.name || uname,
        role: 'student',
        createdAt: userData.createdAt || new Date().toISOString()
      });
      return true;
    } catch (e) {
      console.warn('saveCustomUserCloud hatası:', e);
      return false;
    }
  }

  async getAllUsers() {
    const list = [{
      id: 'admin',
      username: 'gokhaneker',
      email: 'admin@ekysrota.com',
      displayName: 'Gökhan Eker (Ana Yönetici)',
      role: 'admin',
      password: '•••••••• (SHA-256 Korumalı)',
      createdAt: new Date().toISOString()
    }];
    if (!this.db) return list;
    try {
      const snap = await this.db.collection('custom_users').get();
      snap.forEach(doc => {
        const data = doc.data();
        if (data && data.username && data.username !== 'admin' && data.username !== 'gokhaneker') {
          const decodedPass = data.passwordEnc
            ? this.decodeStudentPass(data.passwordEnc)
            : (data.password || '••••••');
          list.push({
            id: doc.id,
            username: data.username,
            email: data.email || `${data.username}@ekysrota.local`,
            displayName: data.displayName || data.username,
            role: 'student',
            password: decodedPass,
            createdAt: data.createdAt || new Date().toISOString()
          });
        }
      });
    } catch (e) {
      console.warn('getAllUsers hatası:', e);
    }
    return list;
  }

  async removeUser(uidOrUsername) {
    if (!this.db) return true;
    try {
      const key = String(uidOrUsername).trim().toLowerCase();
      await this.db.collection('custom_users').doc(key).delete();
      await this.db.collection('users').doc(key).delete();
    } catch (e) {
      console.warn('removeUser hatası:', e);
    }
    return true;
  }

  async updateUserRole(uid, newRole) {
    return true;
  }

  // --- ARAYÜZ VE OTURUM BİLDİRİMİ ---
  onAuthChange(user) {
    const userProfileEl = document.getElementById('user-profile-display');
    const adminNavEl = document.getElementById('nav-admin-panel');
    const settingsNavEl = document.getElementById('nav-settings');

    const authGateEl = document.getElementById('auth-gate-container');
    const mainAppEl = document.getElementById('main-app-container');

    if (user || this.currentUserDoc) {
      if (authGateEl) authGateEl.style.display = 'none';
      if (mainAppEl) mainAppEl.style.display = 'flex';

      const isUserAdmin = this.isAdmin();
      const uKey = isUserAdmin 
        ? 'master_admin' 
        : ((this.currentUserDoc && (this.currentUserDoc.username || this.currentUserDoc.displayName || this.currentUserDoc.uid)) || (user && user.uid) || 'student');
      
      if (window.storageService) {
        window.storageService.setCurrentUser(uKey);
      }
      this.setupUserRealtimeSync();

      const displayName = (this.currentUserDoc && this.currentUserDoc.displayName) || (isUserAdmin ? 'Gökhan Eker (Yönetici)' : 'Öğrenci');
      const roleLabel = isUserAdmin ? '👑 Yönetici' : '🎓 Öğrenci';
      const initial = (displayName.charAt(0) || 'U').toUpperCase();

      if (userProfileEl) {
        userProfileEl.innerHTML = `
          <div style="padding: 12px; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid var(--border-active);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: ${isUserAdmin ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'linear-gradient(135deg, #10b981, #059669)'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; color: white;">
                ${initial}
              </div>
              <div style="overflow: hidden;">
                <div style="font-weight: 700; font-size: 0.9rem; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;" title="${displayName}">${displayName}</div>
                <span class="badge ${isUserAdmin ? 'badge-warning' : 'badge-info'}" style="font-size: 0.7rem; padding: 2px 6px;">${roleLabel}</span>
              </div>
            </div>
            <button class="btn btn-danger btn-block btn-sm" onclick="firebaseService.logout()" style="display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span>🚪</span> Güvenli Çıkış Yap
            </button>
          </div>
        `;
      }

      if (adminNavEl) {
        adminNavEl.style.display = isUserAdmin ? 'flex' : 'none';
      }
      if (settingsNavEl) {
        settingsNavEl.style.display = isUserAdmin ? 'flex' : 'none';
      }
    } else {
      if (this.realtimeUnsubscribe && typeof this.realtimeUnsubscribe === 'function') {
        try { this.realtimeUnsubscribe(); } catch (e) {}
        this.realtimeUnsubscribe = null;
      }
      
      let hasActiveLocalSession = false;
      try {
        const sess = JSON.parse(localStorage.getItem('ekys_active_session_v3') || 'null');
        if (sess && (sess.uid || sess.username)) {
          hasActiveLocalSession = true;
          if (window.storageService) {
            window.storageService.setCurrentUser(sess.username || sess.uid);
          }
        }
      } catch (e) {}

      if (!hasActiveLocalSession && window.storageService) {
        window.storageService.setCurrentUser('guest');
      }

      if (authGateEl) authGateEl.style.display = 'flex';
      if (mainAppEl) mainAppEl.style.display = 'none';

      if (userProfileEl) {
        userProfileEl.innerHTML = `
          <button class="btn btn-primary btn-block btn-sm" onclick="app.showAuthGate()">
            <span>🔑</span> Giriş Yap
          </button>
        `;
      }
      if (adminNavEl) {
        adminNavEl.style.display = 'none';
      }
      const settingsNavEl = document.getElementById('nav-settings');
      if (settingsNavEl) {
        settingsNavEl.style.display = 'none';
      }
    }

    if (window.app && typeof window.app.onAuthStateUpdated === 'function') {
      window.app.onAuthStateUpdated(user || this.currentUserDoc);
    }
  }

  async ensureAuth() {
    if (!this.auth) return null;
    if (this.auth.currentUser) return this.auth.currentUser;
    try {
      const res = await this.auth.signInAnonymously();
      return res.user;
    } catch (e) {
      return null;
    }
  }

  // --- BULUT İLE ÇİFT YÖNLÜ SENKRONİZASYON (KULLANICI BAZLI İZOLE) ---
  async syncAllDataToCloud(isWipe = false) {
    if (!this.db || !window.storageService) return;
    this.lastLocalWriteTime = Date.now();
    try {
      await this.ensureAuth();
    } catch (e) {}

    const data = window.storageService.exportAllData();
    const isUserAdmin = this.isAdmin();
    const rawUid = (this.currentUser && this.currentUser.uid) ? this.currentUser.uid : (isUserAdmin ? 'uid_master_admin' : 'uid_guest');
    const email = (this.currentUser && this.currentUser.email) ? this.currentUser.email.toLowerCase() : (isUserAdmin ? 'admin@ekysrota.com' : `${rawUid}@ekysrota.local`);
    const displayName = (this.currentUser && this.currentUser.displayName) || (isUserAdmin ? 'Gökhan Eker (Yönetici)' : 'Öğrenci');

    const payload = {
      storageData: data,
      email: email,
      displayName: displayName,
      role: isUserAdmin ? 'admin' : 'student',
      lastSyncedAt: new Date().toISOString(),
      isCleanWipe: !!isWipe
    };

    if (isUserAdmin) {
      try {
        await this.db.collection('users').doc('uid_master_admin').set(payload, { merge: true });
        await this.db.collection('global_sync').doc('master_state').set(payload, { merge: true });
      } catch (err) {
        console.warn('Admin cloud sync write:', err.message || err);
      }
    } else {
      // Öğrenci verisi SADECE kendi users/{uid} belgesine yazılır! Asla admin ve global_sync havuzuna karışmaz!
      try {
        await this.db.collection('users').doc(rawUid).set(payload, { merge: true });
      } catch (err) {
        console.warn(`Student cloud sync write for ${rawUid}:`, err.message || err);
      }
    }
  }

  async syncAllDataFromCloud() {
    if (!this.db || !window.storageService) return false;
    try {
      await this.ensureAuth();
    } catch (e) {}

    const isUserAdmin = this.isAdmin();
    const rawUid = (this.currentUser && this.currentUser.uid) ? this.currentUser.uid : (isUserAdmin ? 'uid_master_admin' : '');

    if (isUserAdmin) {
      const docsToTry = ['users/uid_master_admin', 'global_sync/master_state'];
      for (const targetPath of docsToTry) {
        try {
          const [col, docId] = targetPath.split('/');
          const doc = await this.db.collection(col).doc(docId).get();
          if (doc && doc.exists) {
            const d = doc.data();
            if (d && d.storageData) {
              window.storageService.importAllData(d.storageData);
              this.refreshActiveUI();
              return true;
            }
          }
        } catch (e) {
          console.warn('Doc fetch error for ' + targetPath, e.message || e);
        }
      }
      return false;
    } else {
      // Öğrenci için: SADECE kendi bulut belgesini (users/{uid}) oku!
      // Eğer bu öğrenci yeni ise veya belgesi yoksa HİÇBİR ŞEY ALMA (verileri %100 sıfır kalsın)!
      if (!rawUid) return false;
      try {
        const doc = await this.db.collection('users').doc(rawUid).get();
        if (doc && doc.exists) {
          const d = doc.data();
          if (d && d.storageData) {
            window.storageService.importAllData(d.storageData);
            this.refreshActiveUI();
            return true;
          }
        }
      } catch (e) {
        console.warn('Student fetch error for ' + rawUid, e.message || e);
      }
      return false;
    }

    // Görünümleri yeniden render et
    if (window.app) {
      window.app.renderDashboard();
      window.app.renderWrongPoolList();
      window.app.renderFavoritesList();
      window.app.renderStatsView();
    }

    if (!anyFound) {
      await this.syncAllDataToCloud();
    }
    return anyFound;
  }
}

if (typeof window !== 'undefined') {
  window.firebaseService = new FirebaseService();
}
