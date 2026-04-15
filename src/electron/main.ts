import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import { GeminiClient } from './gemini-client';
import { MemoryEngine } from './memory-engine';

let mainWindow: BrowserWindow | null = null;

const isDev = !app.isPackaged;

const DATA_DIR = path.join(app.getPath('userData'), 'centaur-flywheel-data');

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: Math.min(1400, width),
    height: Math.min(900, height),
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#FFFFFF',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    show: false
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// --- Boot sequence ---
app.whenReady().then(async () => {
  const memory = new MemoryEngine(DATA_DIR);
  const geminiClient = initGeminiClient(memory);

  createWindow();

  const { registerIpcHandlers } = await import('./ipc-handlers');
  registerIpcHandlers({ memory, geminiClient, mainWindow });
});

function initGeminiClient(memory: MemoryEngine): GeminiClient | null {
  const settings = memory.readSettings();
  const apiKey = settings.apiKey || process.env.GOOGLE_API_KEY || '';
  if (!apiKey) {
    console.warn('[Flywheel] No API key configured.');
    return null;
  }

  let baseUrl = settings.baseUrl || '';
  if (!baseUrl) {
    switch (settings.provider) {
      case 'gemini':
        baseUrl = 'https://spark-gemini-proxy.finewood2008.workers.dev';
        break;
      case 'vveai':
        baseUrl = 'https://api.vveai.com';
        break;
      default:
        baseUrl = 'https://spark-gemini-proxy.finewood2008.workers.dev';
    }
  }

  return new GeminiClient({
    apiKey,
    baseUrl,
    model: settings.model || 'gemini-2.5-flash',
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    app.whenReady().then(() => createWindow());
  }
});
