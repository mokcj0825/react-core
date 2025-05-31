import {Scene} from "./Scene.ts";

export type SceneCommand = INVOKE_SCENE | INVOKE_SCRIPT | RESET_STATE;

type INVOKE_SCENE = {
  command: 'INVOKE_SCENE';
  scene: Scene;
  sceneResource: string;
}

type INVOKE_SCRIPT = {
  command: 'INVOKE_SCRIPT';
  script: string;
  entryPoint: string;
}

type RESET_STATE = {
  command: 'RESET_STATE';
}


export class SceneCommandUtils {
  static getNewSceneState = function (scene: Scene) {
    const newState: Record<Scene, boolean> = {
      homeScreen: false,
      chat: false,
      town: false,
      deployment: false,
      battlefield: false,
      inventory: false,
    };
    newState[scene] = true;
    return newState;
  }

  static executeScript = async function(scriptName: string, entryPoint: string) {
    try {
      const selectedTestCase = localStorage.getItem('selectedTestCase') || 'test-case-001';
      const response = await fetch(`/architecture/${selectedTestCase}/${scriptName}`);
      const scriptContent = await response.text();

      const blob = new Blob([scriptContent], { type: 'application/javascript' });
      const scriptUrl = URL.createObjectURL(blob);

      const module = await import(scriptUrl);
      if (typeof module[entryPoint] === 'function') {
        await module[entryPoint]();
      } else {
        console.error(`Entry point ${entryPoint} not found in script`);
      }

      URL.revokeObjectURL(scriptUrl);
    } catch (error) {
      console.error('Error executing script:', error);
    }
  }

  static async resetState(): Promise<void> {
    try {
      const db = await SceneCommandUtils.openDB();
      const tx = db.transaction('storyChapter', 'readwrite');
      const store = tx.objectStore('storyChapter');
      await store.put({ id: 'current', chapter: 'chapter-001' });
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      console.log('Game state has been reset to chapter-001');
    } catch (error) {
      console.error('Failed to reset story chapter:', error);
      throw error;
    }
  }

  // Helper function to open IndexedDB
  static async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('StoryChapterDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('storyChapter')) {
          db.createObjectStore('storyChapter', { keyPath: 'id' });
        }
      };
    });
  }
}