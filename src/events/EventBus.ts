import { HexCoordinate } from '../components/Core/gameCore/types/HexCoordinate';
import { TerrainType } from '../components/Core/gameCore/types/TerrainType';

// Event types for the pub/sub system
export enum UIEventType {
  CELL_HOVER = 'CELL_HOVER',
  CELL_LEAVE = 'CELL_LEAVE',
}

// Event interface for the pub/sub system
export interface UIEvent {
  type: UIEventType;
  payload?: {
    coordinate?: HexCoordinate;
    terrain?: TerrainType;
  };
}

// Event bus for component communication
class EventBus {
  private static instance: EventBus;
  private listeners: Map<UIEventType, ((event: UIEvent) => void)[]> = new Map();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe(eventType: UIEventType, callback: (event: UIEvent) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    
    const listeners = this.listeners.get(eventType)!;
    listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  public publish(event: UIEvent): void {
    console.log('EventBus publishing event:', event);
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => callback(event));
    }
  }
}

// Export the event bus for use in other components
export const eventBus = EventBus.getInstance(); 