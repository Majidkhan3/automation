import { driverStore } from '@/src/lib/driverStore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, scrolling, speed = 1 } = req.body;

  console.log(`[Scroll API] Received request for id: ${id}, scrolling: ${scrolling}`);

  try {
    const driver = driverStore.get(id);
    if (!driver) {
      console.error(`[Scroll API] Browser with id: ${id} not found`);
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
    console.error('[Scroll API] Error:', error);
    res.status(500).json({ success: false, error: 'Failed to control scrolling' });
  }
}