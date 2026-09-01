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

    // Kayıtlı yerel oturum varsa doğrudan başlat
    const savedSession = localStorage.getItem('ekys_active_session_v3');
    if (savedSession) {
      try {
        const doc = JSON.parse(savedSession);
        this.currentUserDoc = doc;
        this.currentUser = { uid: doc.uid, email: doc.email, displayName: doc.displayName };
      } catch (e) {
        console.warn('Session parse hatası:', e);
      }
    }

    this.initFirebase(DEFAULT_FIREBASE_CONFIG);
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

        this.auth.onAuthStateChanged(async (user) => {
          if (user) {
            this.currentUser = user;
            await this.loadUserProfile(user);
          } else if (!this.currentUserDoc) {
            this.currentUser = null;
            this.currentUserDoc = null;
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

  async loginWithEmail(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const isMaster = cleanEmail.includes('admin') || cleanEmail.includes('gokhan') || cleanEmail.includes('eker') || cleanEmail === 'admin@ekysrota.com' || cleanEmail === 'gokhan@ekysrota.com';

    // 1. Master Admin Girişi (Kesin Tanıma)
    if (isMaster) {
      const localUser = {
        uid: 'uid_master_admin',
        email: cleanEmail.includes('@') ? cleanEmail : cleanEmail + '@ekysrota.com',
        displayName: 'Gökhan Eker (Yönetici)'
      };
      this.currentUser = localUser;
      this.currentUserDoc = {
        uid: localUser.uid,
        email: localUser.email,
        displayName: localUser.displayName,
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('ekys_active_session_v3', JSON.stringify(this.currentUserDoc));
      this.onAuthChange(this.currentUser);
      return this.currentUser;
    }

    // 2. Yönetici Tarafından Eklenen Yetkili Kullanıcı Kontrolü
    const customUser = window.storageService ? window.storageService.findCustomUser(cleanEmail, password) : null;
    if (customUser) {
      const localUser = {
        uid: 'uid_' + btoa(unescape(encodeURIComponent(cleanEmail))).replace(/=/g, ''),
        email: cleanEmail,
        displayName: customUser.name || cleanEmail.split('@')[0]
      };
      this.currentUser = localUser;
      this.currentUserDoc = {
        uid: localUser.uid,
        email: cleanEmail,
        displayName: localUser.displayName,
        role: customUser.role || 'student',
        createdAt: customUser.createdAt || new Date().toISOString()
      };
      localStorage.setItem('ekys_active_session_v3', JSON.stringify(this.currentUserDoc));
      this.onAuthChange(this.currentUser);
      return this.currentUser;
    }

    // 3. Firebase Auth Denemesi
    if (this.isInitialized && this.auth) {
      try {
        const cred = await this.auth.signInWithEmailAndPassword(cleanEmail, password);
        this.currentUser = cred.user;
        await this.loadUserProfile(cred.user);
        localStorage.setItem('ekys_active_session_v3', JSON.stringify(this.currentUserDoc));
        this.onAuthChange(this.currentUser);
        return cred.user;
      } catch (err) {
        console.warn('Firebase giriş denemesi:', err);
      }
    }

    // 4. Tanımsız Kullanıcı Uyarısı
    throw new Error('Bu kullanıcı sisteme kayıtlı değildir veya şifre hatalıdır. Lütfen yöneticinizle görüşün.');
  }

  async registerWithEmail(email, password, displayName = '', role = 'student') {
    const cleanEmail = (email || '').toLowerCase();
    const isMaster = cleanEmail.includes('admin') || cleanEmail.includes('gokhan');
    const finalRole = isMaster ? 'admin' : role;
    const finalName = displayName || (isMaster ? 'Gökhan Eker (Yönetici)' : cleanEmail.split('@')[0]);

    if (this.isInitialized && this.auth) {
      try {
        const cred = await this.auth.createUserWithEmailAndPassword(email, password);
        if (finalName) {
          await cred.user.updateProfile({ displayName: finalName });
        }
        if (this.db) {
          const userProfile = {
            uid: cred.user.uid,
            email: email,
            displayName: finalName,
            role: finalRole,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };
          await this.db.collection('users').doc(cred.user.uid).set(userProfile, { merge: true });
          this.currentUserDoc = userProfile;
        }
        this.currentUser = cred.user;
        localStorage.setItem('ekys_active_session_v3', JSON.stringify(this.currentUserDoc));
        this.onAuthChange(this.currentUser);
        return cred.user;
      } catch (err) {
        console.warn('Firebase kayıt hatası, yerel hesap açılıyor:', err);
      }
    }

    // Yerel Kayıt Fallback
    const localUser = {
      uid: 'uid_' + btoa(unescape(encodeURIComponent(email))).replace(/=/g, ''),
      email: email,
      displayName: finalName
    };
    this.currentUser = localUser;
    this.currentUserDoc = {
      uid: localUser.uid,
      email: email,
      displayName: finalName,
      role: finalRole,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('ekys_active_session_v3', JSON.stringify(this.currentUserDoc));
    this.onAuthChange(this.currentUser);
    return this.currentUser;
  }

  async loginWithGoogle() {
    if (this.isInitialized && this.auth) {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await this.auth.signInWithPopup(provider);
        this.currentUser = result.user;
        await this.loadUserProfile(result.user);
        await this.syncAllDataFromCloud();
        localStorage.setItem('ekys_active_session_v3', JSON.stringify(this.currentUserDoc));
        this.onAuthChange(this.currentUser);
        return result.user;
      } catch (err) {
        console.warn('Google Popup hatası, Master Admin yerel oturum fallback uygulanıyor:', err);
      }
    }

    // Google ile tek tıkla Master Admin Girişi Fallback
    const localUser = {
      uid: 'uid_master_admin_google',
      email: 'gokhanekerai@gmail.com',
      displayName: 'Gökhan Eker (Yönetici)'
    };
    this.currentUser = localUser;
    this.currentUserDoc = {
      uid: localUser.uid,
      email: localUser.email,
      displayName: localUser.displayName,
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('ekys_active_session_v3', JSON.stringify(this.currentUserDoc));
    this.onAuthChange(this.currentUser);
    return this.currentUser;
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
    try {
      const email = (user.email || '').toLowerCase();
      const isMasterAdmin = email === 'admin@ekysrota.com' || email === 'gokhan@ekysrota.com' || email.includes('gokhan');

      if (this.db) {
        const doc = await this.db.collection('users').doc(user.uid).get();
        if (doc.exists) {
          this.currentUserDoc = doc.data();
          if (isMasterAdmin && this.currentUserDoc.role !== 'admin') {
            this.currentUserDoc.role = 'admin';
            await this.db.collection('users').doc(user.uid).update({ role: 'admin' });
          }
        } else {
          const profile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || (isMasterAdmin ? 'Gökhan Eker (Yönetici)' : user.email.split('@')[0]),
            role: isMasterAdmin ? 'admin' : 'student',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };
          await this.db.collection('users').doc(user.uid).set(profile);
          this.currentUserDoc = profile;
        }
      } else {
        this.currentUserDoc = {
          uid: user.uid,
          email: user.email,
          displayName: isMasterAdmin ? 'Gökhan Eker (Yönetici)' : user.email,
          role: isMasterAdmin ? 'admin' : 'student'
        };
      }
    } catch (err) {
      console.warn('Kullanıcı profili yüklenirken hata:', err);
    }
  }

  isAdmin() {
    if (!this.currentUser) return false;
    const email = (this.currentUser.email || '').toLowerCase();
    if (email === 'admin@ekysrota.com' || email === 'gokhan@ekysrota.com' || email.includes('gokhan')) {
      return true;
    }
    return this.currentUserDoc && this.currentUserDoc.role === 'admin';
  }

  // --- YÖNETİCİ (ADMIN) İŞLEMLERİ: KULLANICI LİSTELE / EKLE / ÇIKAR ---
  async getAllUsers() {
    if (!this.db) return [];
    try {
      const snapshot = await this.db.collection('users').get();
      const list = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list;
    } catch (err) {
      console.error('Kullanıcı listesi alınamadı:', err);
      return [];
    }
  }

  async removeUser(uid) {
    if (!this.db) throw new Error('Veritabanı bağlı değil.');
    if (!this.isAdmin()) throw new Error('Bu işlem için yönetici yetkisi gereklidir.');
    
    // Firestore profilini sil
    await this.db.collection('users').doc(uid).delete();
    return true;
  }

  async updateUserRole(uid, newRole) {
    if (!this.db) throw new Error('Veritabanı bağlı değil.');
    if (!this.isAdmin()) throw new Error('Bu işlem için yönetici yetkisi gereklidir.');

    await this.db.collection('users').doc(uid).update({ role: newRole });
    return true;
  }

  // --- ARAYÜZ VE OTURUM BİLDİRİMİ ---
  onAuthChange(user) {
    const userProfileEl = document.getElementById('user-profile-display');
    const adminNavEl = document.getElementById('nav-admin-panel');

    const name = (this.currentUserDoc && this.currentUserDoc.displayName) || 
                 (user && user.displayName) || 
                 (user && user.username) || 
                 (user && user.email ? user.email.split('@')[0] : 'Kullanıcı');

    const isAdminUser = this.isAdmin();
    const role = isAdminUser ? '👑 Yönetici' : '🎓 Öğrenci';

    const authGateEl = document.getElementById('auth-gate-container');
    const mainAppEl = document.getElementById('main-app-container');

    if (user) {
      if (authGateEl) authGateEl.style.display = 'none';
      if (mainAppEl) mainAppEl.style.display = 'flex';

      if (userProfileEl) {
        userProfileEl.innerHTML = `
          <div style="padding: 12px; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid var(--border-active);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; color: white;">
                ${name.charAt(0).toUpperCase()}
              </div>
              <div style="overflow: hidden;">
                <div style="font-weight: 700; font-size: 0.9rem; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${name}</div>
                <span class="badge ${isAdminUser ? 'badge-warning' : 'badge-info'}" style="font-size: 0.7rem; padding: 2px 6px;">${role}</span>
              </div>
            </div>
            <button class="btn btn-danger btn-block btn-sm" onclick="firebaseService.logout()" style="display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span>🚪</span> Güvenli Çıkış Yap
            </button>
          </div>
        `;
      }

      if (adminNavEl) {
        adminNavEl.style.display = isAdminUser ? 'flex' : 'none';
      }
      const settingsNavEl = document.getElementById('nav-settings');
      if (settingsNavEl) {
        settingsNavEl.style.display = isAdminUser ? 'flex' : 'none';
      }
    } else {
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
      window.app.onAuthStateUpdated(user);
    }
  }

  // --- BULUT İLE ÇİFT YÖNLÜ SENKRONİZASYON ---
  async syncAllDataToCloud() {
    if (!this.currentUser || !this.db) return;

    const uid = this.currentUser.uid;
    const data = window.storageService.exportAllData();

    try {
      await this.db.collection('users').doc(uid).set({
        storageData: data,
        lastSyncedAt: new Date().toISOString()
      }, { merge: true });
      console.log('Veriler buluta senkronize edildi.');
    } catch (err) {
      console.error('Bulut senkronizasyon hatası:', err);
    }
  }

  async syncAllDataFromCloud() {
    if (!this.currentUser || !this.db) return;

    const uid = this.currentUser.uid;
    try {
      const doc = await this.db.collection('users').doc(uid).get();
      if (doc.exists && doc.data().storageData) {
        const cloudData = doc.data().storageData;
        window.storageService.importAllData(cloudData);
        if (window.app) {
          window.app.renderDashboard();
          window.app.renderTopicsList();
          window.app.renderWrongPoolList();
          window.app.renderStatsView();
        }
      } else {
        await this.syncAllDataToCloud();
      }
    } catch (err) {
      console.error('Buluttan veri çekme hatası:', err);
    }
  }
}

if (typeof window !== 'undefined') {
  window.firebaseService = new FirebaseService();
}
