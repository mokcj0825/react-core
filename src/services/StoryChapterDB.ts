export class StoryChapterDB {
  private static instance: StoryChapterDB;
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'StoryDB';
  private readonly STORE_NAME = 'storyStore';
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): StoryChapterDB {
    if (!StoryChapterDB.instance) {
      StoryChapterDB.instance = new StoryChapterDB();
    }
    return StoryChapterDB.instance;
  }

  async init(): Promise<void> {
    // If already initialized, return immediately
    if (this.initialized) {
      return;
    }

    // If initialization is in progress, return the existing promise
    if (this.initPromise) {
      return this.initPromise;
    }

    // Create new initialization promise
    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onerror = () => {
        console.error('Error opening StoryDB:', request.error);
        this.initPromise = null;
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initialized = true;
        console.log('StoryDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME);
        }
      };
    });

    return this.initPromise;
  }

  async setStoryChapter(chapter: string): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put(chapter, 'storyChapter');

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getStoryChapter(): Promise<string | null> {
    if (!this.initialized) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get('storyChapter');

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
} 