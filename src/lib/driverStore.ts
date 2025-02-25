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
    if (!id || !driver) {
      console.error('[DriverStore] Invalid ID or driver instance provided');
      throw new Error('Invalid ID or driver instance');
    }

    if (this.drivers.has(id)) {
      console.warn(`[DriverStore] Driver with ID ${id} already exists. Overwriting.`);
    }

    const driverInfo: DriverInfo = {
      driver,
      createdAt: new Date(),
      lastUsed: new Date(),
    };
    this.drivers.set(id, driverInfo);
    console.log(`[DriverStore] Driver ${id} added successfully`);
    this.logState();
  }

  public get(id: string): WebDriver | undefined {
    if (!id) {
      console.error('[DriverStore] Invalid ID provided');
      throw new Error('Invalid ID');
    }

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
    if (!id) {
      console.error('[DriverStore] Invalid ID provided');
      throw new Error('Invalid ID');
    }

    const result = this.drivers.delete(id);
    if (result) {
      console.log(`[DriverStore] Driver ${id} deleted successfully`);
    } else {
      console.log(`[DriverStore] Driver ${id} not found for deletion`);
    }
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
        lastUsed: info.lastUsed,
      })),
    };
  }

  public cleanupStaleDrivers(maxAgeInMinutes: number = 30): void {
    const now = new Date();
    const staleDriverIds: string[] = [];

    this.drivers.forEach((info, id) => {
      const ageInMinutes = (now.getTime() - info.lastUsed.getTime()) / (1000 * 60);
      if (ageInMinutes > maxAgeInMinutes) {
        staleDriverIds.push(id);
      }
    });

    staleDriverIds.forEach((id) => {
      this.delete(id);
      console.log(`[DriverStore] Cleaned up stale driver ${id}`);
    });
  }

  private logState(): void {
    console.log('[DriverStore] Current state:', {
      driversCount: this.drivers.size,
      driverIds: Array.from(this.drivers.keys()),
    });
  }
}

// Create and export a single instance
const store = DriverStore.getInstance();
console.log('[DriverStore] Initial state:', store.getStatus());
export const driverStore = store;