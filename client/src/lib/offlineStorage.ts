// Offline storage system using IndexedDB for STEM Quest
export interface UserProgress {
  id: string;
  totalPoints: number;
  completedQuizzes: number;
  currentStreak: number;
  level: number;
  completedTopics: string[];
  completedQuizIds: string[];
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  topic: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  pointsEarned: number;
  accuracy: number;
  answers: any[];
  completedAt: Date;
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: 'quiz_completed' | 'topic_unlocked' | 'achievement_earned' | 'level_up';
  subject?: string;
  topic?: string;
  quizId?: string;
  quizTitle?: string;
  score?: number;
  points?: number;
  achievementId?: string;
  achievementName?: string;
  level?: number;
  timestamp: Date;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
  requirement: string;
  points: number;
  category: 'quiz' | 'streak' | 'level' | 'subject' | 'special';
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  language: string;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  offlineMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentCache {
  id: string;
  type: 'quiz' | 'subject' | 'topic' | 'achievement';
  data: any;
  version: string;
  lastUpdated: Date;
  expiresAt?: Date;
}

class OfflineStorage {
  private dbName = 'STEMQuestDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createObjectStores(db);
      };
    });
  }

  private createObjectStores(db: IDBDatabase): void {
    // User Progress Store
    if (!db.objectStoreNames.contains('userProgress')) {
      const progressStore = db.createObjectStore('userProgress', { keyPath: 'id' });
      progressStore.createIndex('userId', 'id', { unique: true });
      progressStore.createIndex('lastActivity', 'lastActivity', { unique: false });
    }

    // Quiz Results Store
    if (!db.objectStoreNames.contains('quizResults')) {
      const resultsStore = db.createObjectStore('quizResults', { keyPath: 'id' });
      resultsStore.createIndex('quizId', 'quizId', { unique: false });
      resultsStore.createIndex('subject', 'subject', { unique: false });
      resultsStore.createIndex('completedAt', 'completedAt', { unique: false });
      resultsStore.createIndex('score', 'score', { unique: false });
    }

    // Activities Store
    if (!db.objectStoreNames.contains('activities')) {
      const activitiesStore = db.createObjectStore('activities', { keyPath: 'id' });
      activitiesStore.createIndex('type', 'type', { unique: false });
      activitiesStore.createIndex('timestamp', 'timestamp', { unique: false });
      activitiesStore.createIndex('subject', 'subject', { unique: false });
    }

    // Achievements Store
    if (!db.objectStoreNames.contains('achievements')) {
      const achievementsStore = db.createObjectStore('achievements', { keyPath: 'id' });
      achievementsStore.createIndex('earned', 'earned', { unique: false });
      achievementsStore.createIndex('category', 'category', { unique: false });
      achievementsStore.createIndex('earnedDate', 'earnedDate', { unique: false });
    }

    // Settings Store
    if (!db.objectStoreNames.contains('settings')) {
      const settingsStore = db.createObjectStore('settings', { keyPath: 'id' });
      settingsStore.createIndex('key', 'key', { unique: true });
    }

    // Content Cache Store
    if (!db.objectStoreNames.contains('contentCache')) {
      const cacheStore = db.createObjectStore('contentCache', { keyPath: 'id' });
      cacheStore.createIndex('type', 'type', { unique: false });
      cacheStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
      cacheStore.createIndex('expiresAt', 'expiresAt', { unique: false });
    }
  }

  // User Progress Methods
  async saveUserProgress(progress: Partial<UserProgress>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['userProgress'], 'readwrite');
    const store = transaction.objectStore('userProgress');

    const existingProgress = await this.getUserProgress();
    const updatedProgress: UserProgress = {
      id: 'default',
      totalPoints: 0,
      completedQuizzes: 0,
      currentStreak: 0,
      level: 1,
      completedTopics: [],
      completedQuizIds: [],
      lastActivity: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...existingProgress,
      ...progress,
      updatedAt: new Date()
    };

    return new Promise((resolve, reject) => {
      const request = store.put(updatedProgress);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getUserProgress(): Promise<UserProgress | null> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['userProgress'], 'readonly');
    const store = transaction.objectStore('userProgress');

    return new Promise((resolve, reject) => {
      const request = store.get('default');
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // Convert date strings back to Date objects
          result.lastActivity = new Date(result.lastActivity);
          result.createdAt = new Date(result.createdAt);
          result.updatedAt = new Date(result.updatedAt);
        }
        resolve(result || null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Quiz Results Methods
  async saveQuizResult(result: Omit<QuizResult, 'id' | 'createdAt'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['quizResults'], 'readwrite');
    const store = transaction.objectStore('quizResults');

    const quizResult: QuizResult = {
      ...result,
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    return new Promise((resolve, reject) => {
      const request = store.put(quizResult);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getQuizResults(limit?: number): Promise<QuizResult[]> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['quizResults'], 'readonly');
    const store = transaction.objectStore('quizResults');
    const index = store.index('completedAt');

    return new Promise((resolve, reject) => {
      const request = index.openCursor(null, 'prev');
      const results: QuizResult[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && (!limit || results.length < limit)) {
          const result = cursor.value;
          // Convert date strings back to Date objects
          result.completedAt = new Date(result.completedAt);
          result.createdAt = new Date(result.createdAt);
          results.push(result);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Activities Methods
  async saveActivity(activity: Omit<Activity, 'id' | 'createdAt'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['activities'], 'readwrite');
    const store = transaction.objectStore('activities');

    const newActivity: Activity = {
      ...activity,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    return new Promise((resolve, reject) => {
      const request = store.put(newActivity);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getActivities(limit?: number): Promise<Activity[]> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['activities'], 'readonly');
    const store = transaction.objectStore('activities');
    const index = store.index('timestamp');

    return new Promise((resolve, reject) => {
      const request = index.openCursor(null, 'prev');
      const results: Activity[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && (!limit || results.length < limit)) {
          const result = cursor.value;
          // Convert date strings back to Date objects
          result.timestamp = new Date(result.timestamp);
          result.createdAt = new Date(result.createdAt);
          results.push(result);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Achievements Methods
  async saveAchievements(achievements: Achievement[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['achievements'], 'readwrite');
    const store = transaction.objectStore('achievements');

    return new Promise((resolve, reject) => {
      const requests = achievements.map(achievement => {
        const updatedAchievement = {
          ...achievement,
          updatedAt: new Date()
        };
        return store.put(updatedAchievement);
      });

      let completed = 0;
      const total = requests.length;

      requests.forEach(request => {
        request.onsuccess = () => {
          completed++;
          if (completed === total) resolve();
        };
        request.onerror = () => reject(request.error);
      });
    });
  }

  async getAchievements(): Promise<Achievement[]> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['achievements'], 'readonly');
    const store = transaction.objectStore('achievements');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const results = request.result.map((achievement: any) => ({
          ...achievement,
          earnedDate: achievement.earnedDate ? new Date(achievement.earnedDate) : undefined,
          createdAt: new Date(achievement.createdAt),
          updatedAt: new Date(achievement.updatedAt)
        }));
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Settings Methods
  async saveSettings(settings: Partial<Settings>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');

    const existingSettings = await this.getSettings();
    const updatedSettings: Settings = {
      language: 'en',
      soundEnabled: true,
      notificationsEnabled: true,
      theme: 'light',
      autoSave: true,
      offlineMode: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...existingSettings,
      ...settings,
      updatedAt: new Date()
    };

    return new Promise((resolve, reject) => {
      const request = store.put({ id: 'default', ...updatedSettings });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSettings(): Promise<Settings | null> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['settings'], 'readonly');
    const store = transaction.objectStore('settings');

    return new Promise((resolve, reject) => {
      const request = store.get('default');
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // Remove the id field and convert dates
          const { id, ...settings } = result;
          settings.createdAt = new Date(settings.createdAt);
          settings.updatedAt = new Date(settings.updatedAt);
          resolve(settings);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Content Cache Methods
  async cacheContent(id: string, type: string, data: any, version: string, expiresInHours?: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['contentCache'], 'readwrite');
    const store = transaction.objectStore('contentCache');

    const cacheItem: ContentCache = {
      id,
      type,
      data,
      version,
      lastUpdated: new Date(),
      expiresAt: expiresInHours ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000) : undefined
    };

    return new Promise((resolve, reject) => {
      const request = store.put(cacheItem);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedContent(id: string): Promise<any | null> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['contentCache'], 'readonly');
    const store = transaction.objectStore('contentCache');

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // Check if content has expired
          if (result.expiresAt && new Date() > new Date(result.expiresAt)) {
            // Content expired, delete it
            this.deleteCachedContent(id);
            resolve(null);
          } else {
            resolve(result.data);
          }
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteCachedContent(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['contentCache'], 'readwrite');
    const store = transaction.objectStore('contentCache');

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Utility Methods
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const storeNames = ['userProgress', 'quizResults', 'activities', 'achievements', 'settings', 'contentCache'];
    
    for (const storeName of storeNames) {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  async getStorageStats(): Promise<{ totalSize: number; itemCounts: Record<string, number> }> {
    if (!this.db) throw new Error('Database not initialized');

    const storeNames = ['userProgress', 'quizResults', 'activities', 'achievements', 'settings', 'contentCache'];
    const itemCounts: Record<string, number> = {};

    for (const storeName of storeNames) {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      itemCounts[storeName] = await new Promise<number>((resolve, reject) => {
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    // Estimate total size (rough calculation)
    const totalSize = Object.values(itemCounts).reduce((sum, count) => sum + count * 1024, 0);

    return { totalSize, itemCounts };
  }

  // Sync Methods (for when online)
  async exportData(): Promise<string> {
    const [progress, results, activities, achievements, settings] = await Promise.all([
      this.getUserProgress(),
      this.getQuizResults(),
      this.getActivities(),
      this.getAchievements(),
      this.getSettings()
    ]);

    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: {
        progress,
        results,
        activities,
        achievements,
        settings
      }
    };

    return JSON.stringify(exportData, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    const importData = JSON.parse(jsonData);
    
    if (importData.data.progress) {
      await this.saveUserProgress(importData.data.progress);
    }
    
    if (importData.data.achievements) {
      await this.saveAchievements(importData.data.achievements);
    }
    
    if (importData.data.settings) {
      await this.saveSettings(importData.data.settings);
    }
    
    // Import quiz results
    if (importData.data.results) {
      for (const result of importData.data.results) {
        await this.saveQuizResult(result);
      }
    }
    
    // Import activities
    if (importData.data.activities) {
      for (const activity of importData.data.activities) {
        await this.saveActivity(activity);
      }
    }
  }
}

// Create and export a singleton instance
export const offlineStorage = new OfflineStorage();

// Initialize the storage when the module is loaded
if (typeof window !== 'undefined') {
  offlineStorage.init().catch(console.error);
}
