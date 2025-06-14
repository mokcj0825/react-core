import {Scene} from "./Scene";
import {SceneCommand} from "./SceneCommand";

export type TheaterCommand =
  | { type: 'CHANGE_SCENE'; payload: Record<Scene, boolean> }
  | { type: 'START_GAME' }
  | { type: 'LOAD_GAME' }
  | { type: 'SHOW_SETTINGS' }
  | { type: 'EXIT_GAME' };

export class TheaterCommandUtils {

  static async loadInitCommand() {
    const selectedTestCase = localStorage.getItem('selectedTestCase') || 'test-case-001';
    const response = await fetch(`/architecture/${selectedTestCase}/init.json`);
    const data = await response.json();

    const commands = Array.isArray(data) ? data : [data];

    return commands as SceneCommand[];

  }

}