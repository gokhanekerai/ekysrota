// EKYS 2027 - Firebase Entegrasyon & Bulut Senkronizasyon Servisi

class FirebaseService {
  constructor() {
    this.isInitialized = false;
    this.currentUser = null;
    this.auth = null;
    this.db = null;

    this.loadFirebaseConfig();
  }

  loadFirebaseConfig() {
    const settings = (typeof window !== 'undefined' && window.storageService) 
      ? window.storageService.getSettings() 
      : {};

    if (settings.firebaseConfig && settings.firebaseConfig.apiKey) {
      this.initFirebase(settings.firebaseConfig);
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

        // Oturum durumunu dinle
        this.auth.onAuthStateChanged(user => {
          this.currentUser = user;
          this.onAuthChange(user);
        });
      }
    } catch (err) {
      console.warn('Firebase başlatma uyarısı:', err);
    }
  }

  async loginWithGoogle() {
    if (!this.isInitialized || !this.auth) {
      throw new Error('Firebase henüz yapılandırılmadı. Lütfen Ayarlar sekmesinden Firebase bilgilerinizi girin.');
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await this.auth.signInWithPopup(provider);
    this.currentUser = result.user;
    await this.syncAllDataFromCloud();
    return result.user;
  }

  async logout() {
    if (this.auth) {
      await this.auth.signOut();
      this.currentUser = null;
      this.onAuthChange(null);
    }
  }

  onAuthChange(user) {
    const userBtn = document.getElementById('btn-auth-user');
    const userProfileEl = document.getElementById('user-profile-display');

    if (user) {
      if (userBtn) {
        userBtn.innerHTML = `<span>👤</span> <span>${user.displayName ? user.displayName.split(' ')[0] : 'Kullanıcı'}</span>`;
        userBtn.classList.remove('btn-secondary');
        userBtn.classList.add('btn-primary');
      }
      if (userProfileEl) {
        userProfileEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${user.photoURL || 'https://via.placeholder.com/40'}" style="width: 36px; height: 36px; border-radius: 50%;">
            <div>
              <div style="font-weight: 700; font-size: 0.9rem;">${user.displayName || 'Giriş Yapıldı'}</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">${user.email}</div>
            </div>
            <button class="btn btn-secondary btn-sm" style="margin-left: auto;" onclick="firebaseService.logout()">Çıkış</button>
          </div>
        `;
      }
      // Verileri bulutla senkronize et
      this.syncAllDataFromCloud();
    } else {
      if (userBtn) {
        userBtn.innerHTML = `<span>🔑</span> <span>Google ile Giriş</span>`;
        userBtn.classList.remove('btn-primary');
        userBtn.classList.add('btn-secondary');
      }
      if (userProfileEl) {
        userProfileEl.innerHTML = `
          <button class="btn btn-primary btn-block" onclick="firebaseService.loginWithGoogle()">
            <span style="font-size: 1.1rem;">🌐</span> Google Hesabı ile Giriş Yap
          </button>
        `;
      }
    }
  }

  // --- BULUT İLE ÇİFT YÖNLÜ SENKRONİZASYON ---
  async syncAllDataToCloud() {
    if (!this.currentUser || !this.db) return;

    const uid = this.currentUser.uid;
    const data = window.storageService.exportAllData();

    try {
      await this.db.collection('users').doc(uid).set({
        ...data,
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
      if (doc.exists) {
        const cloudData = doc.data();
        window.storageService.importAllData(cloudData);
        if (window.app) {
          window.app.renderDashboard();
          window.app.renderTopicsList();
          window.app.renderSourcesList();
          window.app.renderWrongPoolList();
        }
      } else {
        // İlk kez giriyorsa mevcut yerel veriyi buluta aktar
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
