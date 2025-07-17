// Dynamic Import Registry for scalable component loading
interface ComponentRegistry {
  [key: string]: () => Promise<{ default: React.ComponentType }>;
}

// Central registry for all dynamic components
const COMPONENT_REGISTRY: ComponentRegistry = {
  'Squad': () => import('./Squad'),
  'rogue-mode-tutorial': () => import('./rogue-mode-tutorial'),
  'rogue-mode-001': () => import('./rogue-mode-001'),
  // Add more components here as needed
  // 'ComponentName': () => import('./ComponentName'),
};

// Event-driven component loading system
class DynamicImportManager {
  private static instance: DynamicImportManager;
  private loadedComponents: Map<string, React.ComponentType> = new Map();
  private loadingPromises: Map<string, Promise<React.ComponentType>> = new Map();

  static getInstance(): DynamicImportManager {
    if (!DynamicImportManager.instance) {
      DynamicImportManager.instance = new DynamicImportManager();
    }
    return DynamicImportManager.instance;
  }

  async loadComponent(componentName: string): Promise<React.ComponentType> {
    // Check if already loaded
    if (this.loadedComponents.has(componentName)) {
      return this.loadedComponents.get(componentName)!;
    }

    // Check if currently loading
    if (this.loadingPromises.has(componentName)) {
      return this.loadingPromises.get(componentName)!;
    }

    // Start loading
    const loadPromise = this.loadComponentInternal(componentName);
    this.loadingPromises.set(componentName, loadPromise);

    try {
      const component = await loadPromise;
      this.loadedComponents.set(componentName, component);
      this.loadingPromises.delete(componentName);
      return component;
    } catch (error) {
      this.loadingPromises.delete(componentName);
      throw error;
    }
  }

  private async loadComponentInternal(componentName: string): Promise<React.ComponentType> {
    const importFunction = COMPONENT_REGISTRY[componentName];
    
    if (!importFunction) {
      throw new Error(`Component '${componentName}' not found in registry`);
    }

    try {
      const module = await importFunction();
      return module.default;
    } catch (error) {
      console.error(`Failed to load component '${componentName}':`, error);
      throw new Error(`Failed to load component: ${componentName}`);
    }
  }

  // Preload components for better performance
  preloadComponents(componentNames: string[]): Promise<void[]> {
    return Promise.all(
      componentNames.map(async name => {
        try {
          await this.loadComponent(name);
        } catch {
          // Silently fail for preloading
          console.warn(`Failed to preload component: ${name}`);
        }
      })
    );
  }

  // Clear cache for memory management
  clearCache(): void {
    this.loadedComponents.clear();
    this.loadingPromises.clear();
  }

  // Get list of available components
  getAvailableComponents(): string[] {
    return Object.keys(COMPONENT_REGISTRY);
  }
}

export const dynamicImportManager = DynamicImportManager.getInstance();
export { COMPONENT_REGISTRY }; 