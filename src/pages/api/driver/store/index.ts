import { driverStore } from '@/src/lib/driverStore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const status = driverStore.getStatus();
    
    // Try to verify each driver is still active
    const activeDrivers = await Promise.all(
      Array.from(driverStore.getAllDrivers().entries()).map(async ([id, info]) => {
        try {
          await info.driver.getCurrentUrl();
          return { id, active: true };
        } catch {
          return { id, active: false };
        }
      })
    );
    console.log('Driver:', status);
console.log('Driver:', activeDrivers);

    res.status(200).json({
      ...status,
      activeDrivers
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get debug info',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}