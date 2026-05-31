const { app, BrowserWindow, ipcMain, shell, globalShortcut, dialog, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

let mainWindow;
let tray = null;
let capcutCheckInterval;
let isCapcutRunning = false;
let isQuiting = false; 

const CONFIG_PATH = path.join(app.getPath('userData'), 'shortcuts.json');
const DEFAULT_CONFIG = {
  toggleUI: 'F2',
  undo: 'F3',
  macro: 'F4',
  srt: 'F5',
  cut: 'F6'
};

let currentConfig = { ...DEFAULT_CONFIG };

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
      currentConfig = { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    }
  } catch (e) {
    console.log("Không thể đọc config, dùng mặc định.");
  }
}

function saveConfig(config) {
  currentConfig = { ...currentConfig, ...config };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(currentConfig, null, 2));
  registerHotkeys(); 
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 340,
    height: 440,
    frame: false, 
    transparent: true,
    alwaysOnTop: true, 
    skipTaskbar: true, 
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('load-config', currentConfig);
  });

  mainWindow.on('close', function (event) {
    if (!isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

function createTray() {
  // Chuỗi Base64 của một icon màu xanh lá cây có chữ "CC" (CapCut)
  const iconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADdSURBVFhH7ZfBDoMgEEU9gqdwV2/n5o08i5fwJk1MTBttF0v+hE2M7828hDDBXwT+/wLIAZ2zR3gN2IuX7gQyH8C5wKzUvA9oG72M14D3DbgXmJWatwFtYy8jB2TjNeB9A+4FZqXmbcDYmON18w/I5w2wLzArNTlgQ1z/f4D7Q1S3/YDcB2S/YFYKDsjGb8A34FxgVmqygS3kF/AD/I15n29g916Q/YKx8fUBXwNmpSbvgH3X9b7A7heMje8a4DngKzAqB/w64OsDuD/E7heMje8d4D3gKzArNW8DOkfXgG/AqcD2C8am2D7B24wR5wP1hSgH6D0f1wAAAABJRU5ErkJggg==';
  
  // KHẮC PHỤC LỖI: Tạo icon trực tiếp từ bộ nhớ RAM thay vì lưu ra ổ cứng
  const icon = nativeImage.createFromBuffer(Buffer.from(iconBase64, 'base64'));

  // Nạp icon từ biến RAM vào khay hệ thống
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Hiện Giao Diện Cài Đặt (F2)', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Thoát Hoàn Toàn', click: () => { 
        isQuiting = true; 
        app.quit(); 
    }}
  ]);
  
  tray.setToolTip('CapCut Background Exporter');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

ipcMain.on('app-hide', () => {
  if (mainWindow) mainWindow.hide();
});

ipcMain.on('window-move', (event, { deltaX, deltaY }) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const bounds = mainWindow.getBounds();
    mainWindow.setBounds({
      x: Math.round(bounds.x + deltaX),
      y: Math.round(bounds.y + deltaY),
      width: bounds.width,
      height: bounds.height
    });
  }
});

ipcMain.on('app-minimize', () => { if (mainWindow) mainWindow.minimize(); });
ipcMain.on('save-config', (event, config) => { saveConfig(config); });

function registerHotkeys() {
  globalShortcut.unregisterAll();
  
  if (currentConfig.toggleUI) {
    globalShortcut.register(currentConfig.toggleUI, () => {
      if (mainWindow) {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
      }
    });
  }

  if (!isCapcutRunning) return;

  if (currentConfig.undo) {
    globalShortcut.register(currentConfig.undo, () => {
      runVbsScript(`
        Set WshShell = WScript.CreateObject("WScript.Shell")
        WshShell.SendKeys "^z"
      `);
      if (mainWindow) mainWindow.webContents.send('macro-status', 'Đã Undo (Hoàn tác).');
    });
  }

  if (currentConfig.macro) {
    globalShortcut.register(currentConfig.macro, () => {
      runVbsScript(`
        Set WshShell = WScript.CreateObject("WScript.Shell")
        WScript.Sleep 100
        WshShell.SendKeys "^a"
        WScript.Sleep 400
        WshShell.SendKeys "%g"
      `);
      if (mainWindow) mainWindow.webContents.send('macro-status', 'Đã bôi đen và gộp Clip xong!');
    });
  }

  if (currentConfig.srt) {
    globalShortcut.register(currentConfig.srt, extractSrtLogic);
  }

  if (currentConfig.cut) {
    globalShortcut.register(currentConfig.cut, cutCacheLogic);
  }
}

function runVbsScript(vbsCode) {
  const tempVbsPath = path.join(app.getPath('temp'), 'cc_macro.vbs');
  try {
    fs.writeFileSync(tempVbsPath, vbsCode, 'utf-8');
    exec(`cscript.exe //NoLogo "${tempVbsPath}"`);
  } catch (e) {}
}

function checkCapcutProcess() {
  exec('tasklist | find /i "CapCut.exe"', (err, stdout) => {
    const isRunningNow = stdout.toLowerCase().indexOf("capcut.exe") > -1;
    
    if (isRunningNow !== isCapcutRunning) {
      isCapcutRunning = isRunningNow;
      if (mainWindow) {
        mainWindow.webContents.send('capcut-status', isCapcutRunning);
      }
      registerHotkeys();
    }
  });
}

function usToSrtTime(us) {
  const totalMs = Math.round(us / 1000);
  const ms = totalMs % 1000;
  const totalSeconds = Math.floor(totalMs / 1000);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);
  const pad = (num, size) => num.toString().padStart(size, '0');
  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)},${pad(ms, 3)}`;
}

function extractSrtLogic() {
  const CAPCUT_DRAFTS_PATH = path.join(
    process.env.USERPROFILE, 'AppData', 'Local', 'CapCut', 'User Data', 'Projects', 'com.lveditor.draft'
  );
  if (!fs.existsSync(CAPCUT_DRAFTS_PATH)) return;

  const folders = fs.readdirSync(CAPCUT_DRAFTS_PATH);
  const projects = [];

  folders.forEach(folder => {
    const folderPath = path.join(CAPCUT_DRAFTS_PATH, folder);
    if (fs.statSync(folderPath).isDirectory()) {
      const contentPath = path.join(folderPath, 'draft_content.json');
      const metaPath = path.join(folderPath, 'draft_meta_info.json');
      if (fs.existsSync(contentPath) && fs.existsSync(metaPath)) {
        projects.push({
          contentPath: contentPath, metaPath: metaPath,
          mtime: fs.statSync(contentPath).mtimeMs
        });
      }
    }
  });

  if (projects.length === 0) return;
  projects.sort((a, b) => b.mtime - a.mtime);
  const active = projects[0];

  let projectName = 'CapCut_Subtitles';
  try {
    const meta = JSON.parse(fs.readFileSync(active.metaPath, 'utf-8'));
    if (meta.draft_name) projectName = meta.draft_name;
  } catch(e) {}

  try {
    const draftContent = JSON.parse(fs.readFileSync(active.contentPath, 'utf-8'));
    const textMap = new Map();
    const textsList = draftContent.materials?.texts || [];

    textsList.forEach(item => {
      let actual = item.recognize_text || "";
      if (!actual && item.content) {
        try { actual = JSON.parse(item.content).text || ""; } 
        catch (err) { actual = item.content; }
      }
      textMap.set(item.id, actual);
    });

    const textTracks = (draftContent.tracks || []).filter(t => t.type === 'text');
    const segments = [];
    textTracks.forEach(track => {
      if (track.segments) {
        track.segments.forEach(seg => {
          const text = textMap.get(seg.material_id);
          if (text && seg.target_timerange) {
            segments.push({ start: seg.target_timerange.start, duration: seg.target_timerange.duration, text: text });
          }
        });
      }
    });

    if (segments.length === 0) {
      if (mainWindow) mainWindow.webContents.send('macro-status', '❌ Không có phụ đề nào để xuất!');
      return;
    }

    segments.sort((a, b) => a.start - b.start);
    let srtContent = '';
    segments.forEach((sub, i) => {
      srtContent += `${i + 1}\n${usToSrtTime(sub.start)} --> ${usToSrtTime(sub.start + sub.duration)}\n${sub.text}\n\n`;
    });

    const safeName = projectName.replace(/[/\\?%*:|"<>\s]/g, '_') + '.srt';
    
    if (mainWindow) mainWindow.setAlwaysOnTop(false);
    
    dialog.showSaveDialog({
      title: 'Lưu File SRT Phụ đề',
      defaultPath: path.join(app.getPath('desktop'), safeName),
      filters: [{ name: 'SubRip Text', extensions: ['srt'] }]
    }).then(result => {
      if (mainWindow) mainWindow.setAlwaysOnTop(true);
      if (!result.canceled) {
        fs.writeFileSync(result.filePath, srtContent, 'utf-8');
        if (mainWindow) mainWindow.webContents.send('macro-status', `✅ Đã lưu file SRT thành công!`);
        shell.showItemInFolder(result.filePath);
      }
    });
  } catch(e) {}
}

function cutCacheLogic() {
  const CAPCUT_DRAFTS_PATH = path.join(process.env.USERPROFILE, 'AppData', 'Local', 'CapCut', 'User Data', 'Projects', 'com.lveditor.draft');
  const CACHE_PATH = path.join(process.env.USERPROFILE, 'AppData', 'Local', 'CapCut', 'User Data', 'Cache', 'motion_blur_cache');
  
  if (!fs.existsSync(CACHE_PATH)) {
    if (mainWindow) mainWindow.webContents.send('macro-status', '❌ Thư mục Cache chưa tồn tại. (Quên bật Motion Blur?)');
    return;
  }

  let projectName = 'Exported_Video';
  try {
    const folders = fs.readdirSync(CAPCUT_DRAFTS_PATH);
    const projects = [];
    folders.forEach(f => {
      const fp = path.join(CAPCUT_DRAFTS_PATH, f);
      if (fs.statSync(fp).isDirectory() && fs.existsSync(path.join(fp, 'draft_meta_info.json'))) {
        projects.push({ fp, mtime: fs.statSync(path.join(fp, 'draft_content.json')).mtimeMs });
      }
    });
    projects.sort((a, b) => b.mtime - a.mtime);
    const meta = JSON.parse(fs.readFileSync(path.join(projects[0].fp, 'draft_meta_info.json'), 'utf-8'));
    if (meta.draft_name) projectName = meta.draft_name;
  } catch(e) {}

  const files = fs.readdirSync(CACHE_PATH);
  const mp4Files = [];
  const alphaFiles = [];

  files.forEach(f => {
    const filePath = path.join(CACHE_PATH, f);
    const stat = fs.statSync(filePath);
    if (!stat.isDirectory()) {
      if (f.endsWith('.mp4.alpha')) {
        alphaFiles.push(filePath);
      } else if (f.endsWith('.mp4')) {
        mp4Files.push({ path: filePath, mtime: stat.mtimeMs });
      }
    }
  });

  if (mp4Files.length === 0) {
    if (mainWindow) mainWindow.webContents.send('macro-status', '❌ Không có video nào được Render ngầm!');
    return;
  }

  mp4Files.sort((a, b) => b.mtime - a.mtime);
  const targetMp4 = mp4Files[0].path;
  const safeName = projectName.replace(/[/\\?%*:|"<>\s]/g, '_') + '.mp4';
  
  if (mainWindow) mainWindow.setAlwaysOnTop(false);

  dialog.showSaveDialog({
    title: 'Cắt và Lưu Video MP4',
    defaultPath: path.join(app.getPath('desktop'), safeName),
    filters: [{ name: 'MP4 Video', extensions: ['mp4'] }]
  }).then(result => {
    if (mainWindow) mainWindow.setAlwaysOnTop(true);
    if (!result.canceled) {
      fs.copyFileSync(targetMp4, result.filePath);
      
      try { fs.unlinkSync(targetMp4); } catch(e) {}
      alphaFiles.forEach(alphaPath => {
        try { fs.unlinkSync(alphaPath); } catch(e) {}
      });

      if (mainWindow) mainWindow.webContents.send('macro-status', `✅ Đã CUT video và dọn rác Cache thành công!`);
      shell.showItemInFolder(result.filePath);
    }
  });
}

app.whenReady().then(() => {
  loadConfig();
  createWindow();
  createTray();
  
  checkCapcutProcess();
  capcutCheckInterval = setInterval(checkCapcutProcess, 2000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && isQuiting) {
    app.quit();
  }
});