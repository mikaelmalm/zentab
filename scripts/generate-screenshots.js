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
        shell: true,
        detached: true
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
            try {
                // Kill the process group to ensure all child processes (npm, vite) are killed
                process.kill(-server.pid);
            } catch (e) {
                // Ignore errors if process is already dead
                if (e.code !== 'ESRCH') {
                    console.error('Error killing server process:', e);
                }
            }
        }
        process.exit(0);
    }
}

captureScreenshots();
