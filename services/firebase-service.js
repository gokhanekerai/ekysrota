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

        // Oturum durumunu dinle
        this.auth.onAuthStateChanged(async (user) => {
          this.currentUser = user;
          if (user) {
            await this.loadUserProfile(user);
            await this.syncAllDataFromCloud();
          } else {
            this.currentUserDoc = null;
          }
          this.onAuthChange(user);
        });
      }
    } catch (err) {
      console.warn('Firebase başlatma uyarısı:', err);
    }
  }

  // --- KULLANICI GİRİŞ & KAYIT METOTLARI ---
  async loginWithEmail(email, password) {
    if (!this.isInitialized || !this.auth) {
      throw new Error('Firebase bağlantısı henüz hazır değil.');
    }
    const cred = await this.auth.signInWithEmailAndPassword(email, password);
    this.currentUser = cred.user;
    await this.loadUserProfile(cred.user);
    await this.syncAllDataFromCloud();
    return cred.user;
  }

  async registerWithEmail(email, password, displayName = '', role = 'student') {
    if (!this.isInitialized || !this.auth) {
      throw new Error('Firebase bağlantısı henüz hazır değil.');
    }
    const cred = await this.auth.createUserWithEmailAndPassword(email, password);
    if (displayName) {
      await cred.user.updateProfile({ displayName });
    }

    // Firestore kullanıcı profili oluştur
    if (this.db) {
      const userProfile = {
        uid: cred.user.uid,
        email: email,
        displayName: displayName || email.split('@')[0],
        role: role, // 'admin' veya 'student'
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      await this.db.collection('users').doc(cred.user.uid).set(userProfile, { merge: true });
      this.currentUserDoc = userProfile;
    }

    this.currentUser = cred.user;
    return cred.user;
  }

  async loginWithGoogle() {
    if (!this.isInitialized || !this.auth) {
      throw new Error('Firebase bağlantısı hazır değil.');
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await this.auth.signInWithPopup(provider);
    this.currentUser = result.user;
    await this.loadUserProfile(result.user);
    await this.syncAllDataFromCloud();
    return result.user;
  }

  async logout() {
    if (this.auth) {
      await this.auth.signOut();
      this.currentUser = null;
      this.currentUserDoc = null;
      this.onAuthChange(null);
    }
  }

  async loadUserProfile(user) {
    if (!this.db || !user) return;
    try {
      const doc = await this.db.collection('users').doc(user.uid).get();
      if (doc.exists) {
        this.currentUserDoc = doc.data();
      } else {
        // İlk kullanıcıyı otomatik yönetici yap veya öğrenci ata
        const usersSnapshot = await this.db.collection('users').limit(2).get();
        const isFirstUser = usersSnapshot.empty;
        const initialRole = isFirstUser ? 'admin' : 'student';

        const profile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          role: initialRole,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        await this.db.collection('users').doc(user.uid).set(profile);
        this.currentUserDoc = profile;
      }
    } catch (err) {
      console.warn('Kullanıcı profili yüklenirken hata:', err);
    }
  }

  isAdmin() {
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
    const userBtn = document.getElementById('btn-auth-user');
    const userProfileEl = document.getElementById('user-profile-display');
    const adminNavEl = document.getElementById('nav-admin-panel');

    const name = (this.currentUserDoc && this.currentUserDoc.displayName) || 
                 (user && user.displayName) || 
                 (user && user.email ? user.email.split('@')[0] : 'Kullanıcı');

    const role = (this.currentUserDoc && this.currentUserDoc.role === 'admin') ? '👑 Yönetici' : '🎓 Öğrenci';

    if (user) {
      if (userBtn) {
        userBtn.innerHTML = `<span>👤</span> <span>${name}</span>`;
        userBtn.classList.remove('btn-secondary');
        userBtn.classList.add('btn-primary');
      }
      if (userProfileEl) {
        userProfileEl.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid var(--border-color);">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #8b5cf6); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; color: white;">
                ${name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style="font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">
                  ${name}
                  <span class="badge ${this.isAdmin() ? 'badge-warning' : 'badge-info'}" style="font-size: 0.7rem; padding: 2px 6px;">${role}</span>
                </div>
                <div style="font-size: 0.78rem; color: var(--text-secondary);">${user.email}</div>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="firebaseService.logout()">🚪 Çıkış</button>
          </div>
        `;
      }
      if (adminNavEl) {
        adminNavEl.style.display = this.isAdmin() ? 'flex' : 'none';
      }
    } else {
      if (userBtn) {
        userBtn.innerHTML = `<span>🔑</span> <span>Giriş Yap</span>`;
        userBtn.classList.remove('btn-primary');
        userBtn.classList.add('btn-secondary');
      }
      if (userProfileEl) {
        userProfileEl.innerHTML = `
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-primary btn-block" onclick="app.openAuthModal('login')">
              <span>🔑</span> Giriş Yap
            </button>
            <button class="btn btn-secondary btn-block" onclick="app.openAuthModal('register')">
              <span>➕</span> Kayıt Ol
            </button>
          </div>
        `;
      }
      if (adminNavEl) {
        adminNavEl.style.display = 'none';
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
