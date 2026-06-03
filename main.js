const { app, BrowserWindow, ipcMain, shell, globalShortcut, dialog, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process'); // Chỉ giữ lại exec để chạy VBScript

// 1. TẠO ICON ỨNG DỤNG MẶC ĐỊNH
const iconPath = path.join(__dirname, 'icon.png');
if (!fs.existsSync(iconPath)) {
  const iconBase64 = "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";
  fs.writeFileSync(iconPath, Buffer.from(iconBase64, 'base64'));
}

// 2. BIẾN TOÀN CỤC & CẤU HÌNH
let mainWindow;
let tray = null;
let isQuiting = false;
let isHotkeysActive = false; // Công tắc (Mặc định tắt để tránh kẹt phím)

const CONFIG_PATH = path.join(app.getPath('userData'), 'shortcuts_v2.json');
const DEFAULT_CONFIG = {
  toggleUI: 'F2',       // Ẩn hiện giao diện
  toggleHotkeys: 'F8',  // Bật/tắt cụm phím làm việc
  undo: 'F3',
  macro: 'F4',
  srt: 'F5',
  cut: 'F6',
  cachePath: '',
  draftsPath: '' 
};
let currentConfig = { ...DEFAULT_CONFIG };

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      for (const key in parsed) {
        if (parsed[key] && typeof parsed[key] === 'string' && parsed[key].trim() !== '') {
          currentConfig[key] = parsed[key];
        }
      }
    }
  } catch (e) {}
}

function saveConfig(config) {
  currentConfig = { ...currentConfig, ...config };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(currentConfig, null, 2));
  applyHotkeysLogic();
}

// 3. KHỞI TẠO CỬA SỔ
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 340,
    height: 350,
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
    if (!isQuiting) { event.preventDefault(); mainWindow.hide(); }
    return false;
  });
}

function createTray() {
  if (tray) {
    tray.destroy(); // Hủy biểu tượng cũ nếu tạo lại
  }
  tray = new Tray(nativeImage.createFromPath(iconPath));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Hiện Giao Diện Công Cụ', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: `⚙️ Đổi Phím Bật/Tắt (Đang dùng: ${currentConfig.toggleHotkeys})`, click: () => showHotkeySettings() },
    { type: 'separator' },
    { label: 'Thoát Hoàn Toàn', click: () => { isQuiting = true; app.quit(); }}
  ]);
  tray.setToolTip('CapCut Export Tool');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => { mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show(); });
}

// IPC Events
ipcMain.on('app-hide', () => { if (mainWindow) mainWindow.hide(); });
ipcMain.on('app-minimize', () => { if (mainWindow) mainWindow.minimize(); });
ipcMain.on('save-config', (event, config) => { saveConfig(config); });

// ==========================================================================
// TÍNH NĂNG MỚI: ĐỔI PHÍM TẮT TRỰC TIẾP TRÊN GIAO DIỆN
// ==========================================================================
function showHotkeySettings() {
    if (mainWindow) {
        if (!mainWindow.isVisible()) mainWindow.show();
        mainWindow.focus();
        
        // Bơm mã HTML/JS vào thẳng cửa sổ chính để hiển thị bảng nhập phím
        mainWindow.webContents.executeJavaScript(`
            (function() {
                let overlay = document.getElementById('hotkey-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.id = 'hotkey-overlay';
                    overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(24, 24, 28, 0.95); z-index:9999; display:flex; flex-direction:column; justify-content:center; align-items:center; color:white; font-family:sans-serif; backdrop-filter: blur(5px);';
                    overlay.innerHTML = '<h3 style="margin-bottom:10px; color:#10b981; font-weight:800; font-size:16px;">ĐỔI PHÍM BẬT/TẮT</h3><p style="font-size:12px; color:#a1a1aa; text-align:center; padding:0 20px;">Hãy nhấn một phím bất kỳ trên bàn phím<br>(VD: F8, F9, Insert...)</p><button id="btn-cancel-hotkey" style="margin-top:25px; padding:8px 25px; background:#ef4444; font-weight:bold; border:none; border-radius:8px; color:white; cursor:pointer">Hủy Bỏ</button>';
                    document.body.appendChild(overlay);
                    
                    const cancelBtn = document.getElementById('btn-cancel-hotkey');
                    
                    const listener = (e) => {
                        e.preventDefault();
                        let key = e.key;
                        
                        // Bỏ qua nếu người dùng chỉ ấn các phím phụ
                        if (['Control', 'Shift', 'Alt', 'Meta'].includes(key)) return;
                        
                        // Định dạng lại các phím đặc biệt
                        if (key.length === 1) key = key.toUpperCase();
                        if (key.startsWith('Arrow')) key = key.replace('Arrow', '');
                        
                        // Gửi phím vừa nhận được về cho máy chủ Node.js
                        const { ipcRenderer } = require('electron');
                        ipcRenderer.send('save-toggle-hotkey', key);
                        
                        cleanup();
                    };
                    
                    const cleanup = () => {
                        window.removeEventListener('keydown', listener);
                        if(document.body.contains(overlay)) document.body.removeChild(overlay);
                    };
                    
                    cancelBtn.onclick = cleanup;
                    window.addEventListener('keydown', listener);
                }
            })();
        `).catch(err => console.log(err));
    }
}

// Nhận phím mới và lưu lại
ipcMain.on('save-toggle-hotkey', (event, newKey) => {
    if (newKey && newKey.trim() !== '') {
        saveConfig({ toggleHotkeys: newKey });
        createTray(); // Cập nhật lại chữ "Đang dùng: XXX" trên khay hệ thống
        
        if (isHotkeysActive) {
            updateUIStatus(`ĐÃ BẬT PHÍM TẮT (Bấm ${newKey} để khóa)`, '#10b981');
        } else {
            updateUIStatus(`ĐÃ KHÓA PHÍM TẮT (Bấm ${newKey} để bật)`, '#f59e0b');
        }
    }
});

function runVbsScript(vbsCode) {
  const tempVbsPath = path.join(app.getPath('temp'), 'cc_macro.vbs');
  try {
    fs.writeFileSync(tempVbsPath, vbsCode, 'utf-8');
    exec(`cscript.exe //NoLogo "${tempVbsPath}"`, { windowsHide: true });
  } catch (e) {}
}

// ==========================================================================
// ĐỌC DATABASE GỐC VÀ DÒ TÌM CACHE
// ==========================================================================
function getProjectFromMasterDatabase() {
  const defaultDraftsDir = path.join(process.env.USERPROFILE, 'AppData', 'Local', 'CapCut', 'User Data', 'Projects', 'com.lveditor.draft');
  if (!fs.existsSync(defaultDraftsDir)) return null;
  
  try {
    const files = fs.readdirSync(defaultDraftsDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(defaultDraftsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.includes('"all_draft_store"')) {
          const data = JSON.parse(content);
          if (data.all_draft_store && Array.isArray(data.all_draft_store)) {
            data.all_draft_store.sort((a, b) => b.tm_draft_modified - a.tm_draft_modified);
            for (const proj of data.all_draft_store) {
               if (proj.draft_json_file && fs.existsSync(proj.draft_json_file)) {
                   return {
                       contentPath: proj.draft_json_file,
                       folderName: proj.draft_name || path.basename(proj.draft_fold_path),
                       mtime: proj.tm_draft_modified,
                       rootPath: proj.draft_root_path
                   };
               }
            }
          }
        }
      }
    }
  } catch (e) {}
  return null;
}

function autoDetectCachePath() {
  const active = getProjectFromMasterDatabase();
  if (active && active.rootPath) {
     const capcutBase = path.join(active.rootPath, '..');
     const cache1 = path.join(capcutBase, 'Cache', 'MotionBlurCache');
     const cache2 = path.join(capcutBase, 'CapCut Cache', 'MotionBlurCache');
     const cache3 = path.join(capcutBase, '..', 'Cache', 'MotionBlurCache');
     if (fs.existsSync(cache1)) return cache1;
     if (fs.existsSync(cache2)) return cache2;
     if (fs.existsSync(cache3)) return cache3;
  }
  const defaultCache = path.join(process.env.USERPROFILE, 'AppData', 'Local', 'CapCut', 'User Data', 'Cache', 'MotionBlurCache');
  if (fs.existsSync(defaultCache)) return defaultCache;
  return null;
}

function getActiveProjectInfo() {
  const masterProject = getProjectFromMasterDatabase();
  if (masterProject) return masterProject;
  
  if (mainWindow) mainWindow.setAlwaysOnTop(false);
  dialog.showMessageBoxSync(mainWindow, { 
    type: 'error', title: 'Lỗi Database', message: 'Không thể đọc được dữ liệu dự án từ CapCut!' 
  });
  if (mainWindow) mainWindow.setAlwaysOnTop(true);
  return null;
}

// ==========================================================================
// TRÍCH XUẤT PHỤ ĐỀ (SRT) & XUẤT VIDEO (MP4)
// ==========================================================================
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
  const active = getActiveProjectInfo();
  if (!active) return;
  const projectName = active.folderName;
  
  try {
    const draftContent = JSON.parse(fs.readFileSync(active.contentPath, 'utf-8'));
    const textMap = new Map();
    const textsList = draftContent.materials?.texts || [];
    
    textsList.forEach(item => {
      let actual = item.recognize_text || "";
      if (!actual && item.content) {
        try { actual = JSON.parse(item.content).text || ""; } catch (err) { actual = item.content; }
      }
      actual = actual.replace(/<[^>]*>?/gm, '').trim(); 
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
      dialog.showMessageBox(mainWindow, { type: 'warning', title: 'Trống Phụ đề', message: 'Dự án này không có bất kỳ dòng phụ đề hoặc chữ nào để xuất!' });
      return;
    }
    
    segments.sort((a, b) => a.start - b.start);
    let srtContent = '';
    segments.forEach((sub, i) => {
      srtContent += `${i + 1}\n${usToSrtTime(sub.start)} --> ${usToSrtTime(sub.start + sub.duration)}\n${sub.text}\n\n`;
    });
    
    const safeName = projectName.replace(/[/\\?%*:|"<>\s]/g, '_') + '.srt';
    dialog.showSaveDialog(mainWindow, {
      title: 'Lưu File SRT Phụ đề',
      defaultPath: path.join(app.getPath('desktop'), safeName),
      filters: [{ name: 'SubRip Text', extensions: ['srt'] }]
    }).then(result => {
      if (!result.canceled) {
        fs.writeFileSync(result.filePath, srtContent, 'utf-8');
        shell.showItemInFolder(result.filePath);
      }
    });
  } catch(e) {}
}

function cutCacheLogic() {
  const active = getActiveProjectInfo();
  if (!active) return;
  const projectName = active.folderName;
  let CACHE_PATH = autoDetectCachePath();
  
  if (!CACHE_PATH || !fs.existsSync(CACHE_PATH)) {
    if (mainWindow) mainWindow.setAlwaysOnTop(false);
    const result = dialog.showOpenDialogSync(mainWindow, {
      title: 'CHỌN THƯ MỤC MOTION BLUR CACHE CỦA CAPCUT',
      properties: ['openDirectory']
    });
    if (mainWindow) mainWindow.setAlwaysOnTop(true);
    if (result && result.length > 0) {
      CACHE_PATH = result[0];
      saveConfig({ cachePath: CACHE_PATH }); 
    } else { return; }
  }
  
  const files = fs.readdirSync(CACHE_PATH);
  const mp4Files = [];
  const alphaFiles = [];
  files.forEach(f => {
    const filePath = path.join(CACHE_PATH, f);
    const stat = fs.statSync(filePath);
    if (!stat.isDirectory()) {
      if (f.endsWith('.mp4.alpha')) alphaFiles.push(filePath);
      else if (f.endsWith('.mp4')) mp4Files.push({ path: filePath, mtime: stat.mtimeMs });
    }
  });
  
  if (mp4Files.length === 0) {
    dialog.showMessageBox(mainWindow, { type: 'warning', title: 'Thư mục Cache Trống', message: 'Không tìm thấy file Video MP4 nào!\nHãy đảm bảo bạn đã tích bật Motion Blur 1%.' });
    return;
  }
  
  mp4Files.sort((a, b) => b.mtime - a.mtime);
  const targetMp4 = mp4Files[0].path;
  const safeName = projectName.replace(/[/\\?%*:|"<>\s]/g, '_') + '.mp4';
  
  dialog.showSaveDialog(mainWindow, {
    title: 'Cắt và Lưu Video MP4',
    defaultPath: path.join(app.getPath('desktop'), safeName),
    filters: [{ name: 'MP4 Video', extensions: ['mp4'] }]
  }).then(result => {
    if (!result.canceled) {
      fs.copyFileSync(targetMp4, result.filePath);
      try { fs.unlinkSync(targetMp4); } catch(e) {}
      alphaFiles.forEach(alphaPath => { try { fs.unlinkSync(alphaPath); } catch(e) {} });
      shell.showItemInFolder(result.filePath);
    }
  });
}

// ==========================================================================
// HỆ THỐNG QUẢN LÝ PHÍM TẮT (THỦ CÔNG)
// ==========================================================================
function registerGlobalHotkeys() {
  // 1. Phím Ẩn/Hiện giao diện (Luôn hoạt động)
  if (currentConfig.toggleUI) {
    try {
      globalShortcut.register(currentConfig.toggleUI, () => {
        if (mainWindow) mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
      });
    } catch(e) {}
  }

  // 2. Phím Công Tắc Bật/Tắt (Luôn hoạt động)
  if (currentConfig.toggleHotkeys) {
    try {
      globalShortcut.register(currentConfig.toggleHotkeys, () => {
        isHotkeysActive = !isHotkeysActive;
        
        if (isHotkeysActive) {
          registerCapcutHotkeys();
          updateUIStatus(`ĐÃ BẬT PHÍM TẮT (Bấm ${currentConfig.toggleHotkeys} để khóa)`, '#10b981');
        } else {
          unregisterCapcutHotkeys();
          updateUIStatus(`ĐÃ KHÓA PHÍM TẮT (Bấm ${currentConfig.toggleHotkeys} để bật)`, '#f59e0b');
        }
      });
    } catch(e) {}
  }
}

// Hàm chỉ đăng ký cụm phím tính năng
function registerCapcutHotkeys() {
  if (currentConfig.undo) {
    try { globalShortcut.register(currentConfig.undo, () => { runVbsScript(`Set WshShell = WScript.CreateObject("WScript.Shell")\nWshShell.SendKeys "^z"`); }); } catch(e) {}
  }
  if (currentConfig.macro) {
    try { globalShortcut.register(currentConfig.macro, () => { runVbsScript(`Set WshShell = WScript.CreateObject("WScript.Shell")\nWScript.Sleep 50\nWshShell.SendKeys "^a"\nWScript.Sleep 300\nWshShell.SendKeys "%g"`); }); } catch(e) {}
  }
  if (currentConfig.srt) {
    try { globalShortcut.register(currentConfig.srt, extractSrtLogic); } catch(e) {}
  }
  if (currentConfig.cut) {
    try { globalShortcut.register(currentConfig.cut, cutCacheLogic); } catch(e) {}
  }
}

function unregisterCapcutHotkeys() {
  if (currentConfig.undo) globalShortcut.unregister(currentConfig.undo);
  if (currentConfig.macro) globalShortcut.unregister(currentConfig.macro);
  if (currentConfig.srt) globalShortcut.unregister(currentConfig.srt);
  if (currentConfig.cut) globalShortcut.unregister(currentConfig.cut);
}

function applyHotkeysLogic() {
  globalShortcut.unregisterAll();
  registerGlobalHotkeys(); // Đăng ký lại F2, phím Tắt/Bật
  
  if (isHotkeysActive) {
    registerCapcutHotkeys(); // Nếu công tắc đang bật thì kích hoạt luôn
  }
}

function updateUIStatus(text, color) {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.executeJavaScript(`
            var lbl = document.getElementById('status-label');
            if (lbl) {
                lbl.innerText = '${text}';
                lbl.style.color = '${color}';
            }
            var dot = document.querySelector('.status-dot');
            if (dot) {
                dot.style.backgroundColor = '${color}';
                if(color === '#10b981') {
                    dot.style.animation = 'none';
                    dot.style.boxShadow = '0 0 8px #10b981';
                } else if(color === '#ef4444') {
                    dot.style.animation = 'none';
                    dot.style.boxShadow = '0 0 8px #ef4444';
                } else {
                    dot.style.animation = 'blink 1.5s infinite';
                    dot.style.boxShadow = 'none';
                }
            }
        `).catch(()=>{});
    }
}

// ==========================================================================
// APP LIFECYCLE 
// ==========================================================================
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (!mainWindow.isVisible()) mainWindow.show();
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    loadConfig();
    createWindow();
    try { createTray(); } catch(e) {}
    
    applyHotkeysLogic();
    
    // Mặc định khởi động ứng dụng sẽ khóa phím tắt (để tránh vô tình bấm lúc dùng web)
    setTimeout(() => {
      updateUIStatus(`ĐÃ KHÓA PHÍM TẮT (Bấm ${currentConfig.toggleHotkeys} để bật)`, '#f59e0b');
    }, 1500);
  });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin' && isQuiting) {
      app.quit();
    }
  });
}
