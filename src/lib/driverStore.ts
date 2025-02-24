import { WebDriver } from 'selenium-webdriver';

interface DriverInfo {
  driver: WebDriver;
  createdAt: Date;
  lastUsed: Date;
}

class DriverStore {
  private static instance: DriverStore;
  private drivers: Map<string, DriverInfo>;
  private initialized: boolean;

  private constructor() {
    this.drivers = new Map();
    this.initialized = false;
    console.log('[DriverStore] Constructor called');
  }

  public static getInstance(): DriverStore {
    if (!DriverStore.instance) {
      console.log('[DriverStore] Creating new instance');
      DriverStore.instance = new DriverStore();
      DriverStore.instance.initialized = true;
    }
    return DriverStore.instance;
  }

  public set(id: string, driver: WebDriver): void {
    console.log(`[DriverStore] Setting driver ${id}`);
    const driverInfo: DriverInfo = {
      driver,
      createdAt: new Date(),
      lastUsed: new Date()
    };
    this.drivers.set(id, driverInfo);
    this.logState();
  }

  public get(id: string): WebDriver | undefined {
    console.log(`[DriverStore] Getting driver ${id}`);
    const driverInfo = this.drivers.get(id);
    if (driverInfo) {
      driverInfo.lastUsed = new Date();
      console.log(`[DriverStore] Driver ${id} found and last used updated`);
      return driverInfo.driver;
    }
    console.log(`[DriverStore] Driver ${id} not found`);
    return undefined;
  }

  public delete(id: string): boolean {
    console.log(`[DriverStore] Deleting driver ${id}`);
    const result = this.drivers.delete(id);
    this.logState();
    return result;
  }

  public getAllDrivers(): Map<string, DriverInfo> {
    return this.drivers;
  }

  public getStatus(): any {
    return {
      initialized: this.initialized,
      driversCount: this.drivers.size,
      driverIds: Array.from(this.drivers.keys()),
      driverDetails: Array.from(this.drivers.entries()).map(([id, info]) => ({
        id,
        createdAt: info.createdAt,
        lastUsed: info.lastUsed
      }))
    };
  }

  private logState(): void {
    console.log('[DriverStore] Current state:', {
      driversCount: this.drivers.size,
      driverIds: Array.from(this.drivers.keys())
    });
  }
}

// Create and export a single instance
const store = DriverStore.getInstance();
console.log('[DriverStore] Initial state:', store.getStatus());
export const driverStore = store;