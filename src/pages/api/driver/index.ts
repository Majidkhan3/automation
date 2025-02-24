import type { NextApiRequest, NextApiResponse } from 'next';
import { Builder } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { driverStore } from '../../../lib/driverStore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.body;

  try {
    const options = new Options();
    options.addArguments('--headless'); // Optional: run in headless mode
    
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    const id = Date.now().toString();
    
    // Add debug logging
    console.log('Creating new driver with id:', id);
    console.log('Driver instance:', !!driver);
    
    driverStore.set(id, driver);
    
    // Verify the driver was stored
    const storedDriver = driverStore.get(id);
    console.log('Stored driver retrieved:', !!storedDriver);

    await driver.get(url);
    
    res.status(200).json({ success: true, id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to open website'
    });
  }
}