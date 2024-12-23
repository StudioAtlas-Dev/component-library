import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIEWPORT_WIDTH = 1920;
const VIEWPORT_HEIGHT = 1080;
const COMPONENTS_DIR = path.join(process.cwd(), 'src/app/components');
const PREVIEWS_DIR = path.join(process.cwd(), 'public/previews');

async function generatePreview(componentName: string) {
  console.log(`Processing ${componentName}...`);
  const previewPath = path.join(PREVIEWS_DIR, `${componentName}.png`);
  
  // Skip if preview already exists
  if (fs.existsSync(previewPath)) {
    console.log(`Preview for ${componentName} already exists, skipping...`);
    return;
  }

  console.log(`Launching browser for ${componentName}...`);
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      deviceScaleFactor: 1,
    },
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to the component's page
    const url = `http://localhost:3000/components/${componentName}`;
    console.log(`Navigating to ${url}...`);
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });

    // Ensure preview directory exists
    if (!fs.existsSync(PREVIEWS_DIR)) {
      console.log(`Creating previews directory at ${PREVIEWS_DIR}...`);
      fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
    }

    // Take screenshot
    console.log(`Taking screenshot for ${componentName}...`);
    await page.screenshot({
      path: previewPath,
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
      },
    });

    console.log(`Successfully generated preview for ${componentName}`);
  } catch (error) {
    console.error(`Error generating preview for ${componentName}:`, error);
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log(`Looking for components in ${COMPONENTS_DIR}...`);
  // Get all component directories
  const components = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Found components: ${components.join(', ')}`);

  // Generate previews for each component
  for (const component of components) {
    await generatePreview(component);
  }
}

// Run the script
main().catch(console.error);