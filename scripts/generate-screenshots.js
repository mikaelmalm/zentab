import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4173; // Default Vite preview port
const URL = `http://localhost:${PORT}/zentab/`;

const EDIT_DATA_PATH = path.join(__dirname, 'screenshot-data-edit.json');
const CLEAN_DATA_PATH = path.join(__dirname, 'screenshot-data-clean.json');

const ASSETS_DIR = path.join(__dirname, '../assets');

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startServer() {
    console.log('Starting Vite preview server...');
    const server = spawn('npm', ['run', 'preview'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
        shell: true
    });

    // Wait for server to be ready
    await wait(3000); // Simple wait, could be more robust
    return server;
}

async function captureScreenshots() {
    let server;
    let browser;

    try {
        server = await startServer();
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
            defaultViewport: { width: 1920, height: 1080 }
        });

        const page = await browser.newPage();
        
        // Read data
        const editData = JSON.parse(fs.readFileSync(EDIT_DATA_PATH, 'utf8'));
        const cleanData = JSON.parse(fs.readFileSync(CLEAN_DATA_PATH, 'utf8'));

        // 1. Capture Default View
        console.log('Setting up Default View...');
        await page.goto(URL);
        
        // Inject data into localStorage
        await page.evaluate((editData) => {
            localStorage.setItem('zentab_data', JSON.stringify(editData));
        }, editData);

        await page.reload({ waitUntil: 'networkidle0' });
        await wait(2000); // Wait for animations/rendering

        console.log('Capturing zentab-default.png...');
        await page.screenshot({ path: path.join(ASSETS_DIR, 'zentab-default.png'), fullPage: false });

        // 2. Capture Clean View
        console.log('Setting up Clean View...');
        
        await page.evaluate((cleanData) => {
            localStorage.setItem('zentab_data', JSON.stringify(cleanData));
        }, cleanData);

        await page.reload({ waitUntil: 'networkidle0' });
        await wait(2000);

        console.log('Capturing zentab-clean.png...');
        await page.screenshot({ path: path.join(ASSETS_DIR, 'zentab-clean.png'), fullPage: false });

    } catch (error) {
        console.error('Error generating screenshots:', error);
        process.exit(1);
    } finally {
        if (browser) await browser.close();
        if (server) {
            server.kill();
             // Spawned processes with shell: true might need tree kill, but for CI/simple script this might handle it.
             // On linux/mac locally standard kill might leave orphans if not careful, but usually okay for this.
             process.kill(-server.pid); // Attempt to kill process group if detached, but here it's simple
        }
        process.exit(0);
    }
}

captureScreenshots();
