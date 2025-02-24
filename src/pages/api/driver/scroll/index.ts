import { driverStore } from '@/src/lib/driverStore';
import { stat } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { WebDriver } from 'selenium-webdriver';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, scrolling, speed = 1 } = req.body;

  try {
//     const status = driverStore.getStatus();
    
//     // Try to verify each driver is still active
//     const activeDrivers = await Promise.all(
//       Array.from(driverStore.getAllDrivers().entries()).map(async ([id, info]) => {
//         try {
//           await info.driver.getCurrentUrl();
//           return { id, active: true };
//         } catch {
//           return { id, active: false };
//         }
//       })
//     );
// console.log('Driver:', status);
// console.log('Driver:', activeDrivers);
    const driver = driverStore.get(id);
    console.log('Driver:', id);
    if (!driver) {
      throw new Error('Browser not found');
    }

    if (scrolling) {
      // Start scrolling
      await driver.executeScript(`
        function smoothScroll() {
          window.scrollBy(0, ${speed});
          if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
            window.scrollTo(0, 0);
          }
          if (window._scrollTimeout) {
            window.requestAnimationFrame(smoothScroll);
          }
        }
        window._scrollTimeout = true;
        smoothScroll();
      `);
    } else {
      // Stop scrolling
      await driver.executeScript(`
        window._scrollTimeout = false;
      `);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to control scrolling' });
  }
}