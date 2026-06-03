<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      user-select: none;
    }

    /* CHẾ ĐỘ SONG NGỮ */
    body.lang-vn .en { display: none !important; }
    body.lang-en .vn { display: none !important; }

    .app-card {
      width: 340px;
      height: 100vh; /* Tự động ôm khít 100% chiều cao của cửa sổ Electron */
      background: #18181c;
      border: 1px solid #2d2d34;
      border-radius: 16px;
      box-shadow: 0 12px 36px rgba(0,0,0,0.6);
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
    }

    .title-bar {
      height: 44px;
      background: #111115;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px;
      border-bottom: 1px solid #232329;
      cursor: move;
      -webkit-app-region: drag;
    }

    .title-text {
      color: #9ca3af;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .control-buttons {
      display: flex;
      gap: 8px;
      -webkit-app-region: no-drag;
      align-items: center;
    }

    .icon-btn {
      background: transparent;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
      transition: color 0.2s;
    }
    .icon-btn:hover { color: #10b981; }

    .win-btn {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .win-btn.minimize { background: #f59e0b; }
    .win-btn.close { background: #ef4444; }

    .content {
      flex: 1;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      transition: opacity 0.3s;
    }

    .brand-section { text-align: center; }
    .app-title { font-size: 16px; font-weight: 800; color: #f3f4f6; margin: 0; }
    .app-desc { font-size: 10px; color: #9ca3af; margin: 4px 0 0; line-height: 1.4; }

    .action-group { width: 100%; display: flex; flex-direction: column; gap: 10px; }

    /* Xóa bỏ định dạng các nút .btn, .btn-folder, .btn-srt vì không còn dùng đến */

    .instruction-box {
      width: 100%; background: #27272a; border: 1px solid #3f3f46; border-radius: 8px;
      padding: 10px; font-size: 9px; color: #a1a1aa; text-align: left; box-sizing: border-box;
    }

    .status-bar {
      width: 100%; background: #111115; padding: 10px 14px; border-top: 1px solid #232329;
      display: flex; align-items: center; gap: 8px; font-size: 10px; color: #9ca3af; box-sizing: border-box;
    }

    .status-dot {
      width: 6px; height: 6px; background: #ef4444; border-radius: 50%;
    }
    .status-dot.active {
      background: #10b981; animation: blink 1.5s infinite;
    }

    @keyframes blink { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }

    .settings-panel {
      position: absolute; top: 44px; left: 0; width: 100%; height: calc(100% - 44px);
      background: #18181c; z-index: 10; padding: 20px; box-sizing: border-box;
      transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex; flex-direction: column;
    }
    .settings-panel.open { transform: translateX(0); }
    
    .settings-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .settings-title { font-size: 14px; font-weight: 800; color: #f3f4f6; }
    
    .setting-group { margin-bottom: 15px; }
    .setting-label { display: block; font-size: 10px; color: #9ca3af; margin-bottom: 5px; font-weight: 600; }
    
    .shortcut-input {
      width: 100%; background: #111115; border: 1px solid #3f3f46; color: #10b981;
      padding: 10px; border-radius: 6px; font-size: 11px; font-weight: bold; font-family: monospace;
      outline: none; text-align: center; box-sizing: border-box; cursor: text;
    }
    .shortcut-input:focus { border-color: #10b981; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2); }
    .shortcut-input::placeholder { color: #52525b; font-weight: normal; }

    .save-btn {
      margin-top: auto; padding: 12px; background: #3b82f6; color: white;
      border: none; border-radius: 8px; font-weight: 800; font-size: 11px; cursor: pointer;
    }
    .save-btn:hover { background: #2563eb; }
    
    .key-badge { color: #10b981; font-weight: bold; padding: 0 2px; }

  </style>
</head>
<body class="lang-vn">

  <div class="app-card">
    <div class="title-bar">
      <span class="title-text">CapCut Tool v8.0</span>
      <div class="control-buttons">
        <!-- Nút chuyển ngôn ngữ -->
        <button class="icon-btn" id="btn-lang" title="Thay đổi Ngôn ngữ / Change Language" onclick="toggleLang()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </button>
        <!-- Nút mở cài đặt -->
        <button class="icon-btn" id="btn-settings" title="Cài đặt Phím tắt / Shortcut Settings">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
        <button class="win-btn minimize" onclick="minimizeApp()"></button>
        <button class="win-btn close" onclick="hideApp()"></button>
      </div>
    </div>

    <div class="content" id="main-view">
      <div class="action-group">
        <div class="instruction-box" style="padding: 10px; background: #1f1f22; border-color: #8b5cf6;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #3f3f46; padding-bottom: 6px; margin-bottom: 6px;">
            <h3 style="color:#d4d4d8; font-size: 10px; margin: 0;">
              <span class="vn">🚀 MACRO PHÍM TẮT NGẦM</span>
              <span class="en">🚀 BACKGROUND MACRO HOTKEYS</span>
            </h3>
          </div>
          <p style="margin: 0 0 4px 0; line-height: 1.4;">• [<span id="lbl-ui" class="key-badge">F2</span>]: 
            <span class="vn">Ẩn / Hiện bảng điều khiển này.</span><span class="en">Show / Hide this control panel.</span>
          </p>
          <p style="margin: 0 0 4px 0; line-height: 1.4;">• [<span id="lbl-undo" class="key-badge">F3</span>]: 
            <span class="vn">Hoàn tác (Undo) trả về như cũ.</span><span class="en">Undo changes (Revert).</span>
          </p>
          <p style="margin: 0 0 4px 0; line-height: 1.4;">• [<span id="lbl-macro" class="key-badge">F4</span>]: 
            <span class="vn">Tự động Bôi đen & Gom Clip.</span><span class="en">Auto Select All & Compound Clip.</span>
          </p>
          <p style="margin: 0 0 4px 0; line-height: 1.4;">• [<span id="lbl-srt" class="key-badge">F5</span>]: 
            <span class="vn">Trích xuất & Lưu phụ đề SRT.</span><span class="en">Extract & Save SRT Subtitles.</span>
          </p>
          <p style="margin: 0; line-height: 1.4; color: #10b981; font-weight: bold;">• [<span id="lbl-cut" class="key-badge" style="color: #fff; background: #10b981; border-radius: 4px;">F6</span>]: 
            <span class="vn">Xuất Video.</span><span class="en">Export Video.</span>
          </p>
        </div>

        <div class="instruction-box" style="padding: 10px;">
          <h3 style="color:#d4d4d8; font-size: 10px; margin: 0 0 6px 0; border-bottom: 1px solid #3f3f46; padding-bottom: 6px;">
            <span class="vn">SAU KHI BẤM GOM CLIP:</span>
            <span class="en">AFTER COMPOUNDING:</span>
          </h3>
          <p style="margin: 0; line-height: 1.4;">
            <span class="vn">Bật <b>Motion Blur</b>, chỉnh Blur về <b>0%</b> và đợi nó chạy Processing 100% xong. Rồi bấm Phím tắt.</span>
            <span class="en">Enable <b>Motion Blur</b>, set Blur to <b>0%</b> and wait for Processing 100%. Then press Hotkeys.</span>
          </p>
        </div>

        <!-- Đã xóa hoàn toàn 2 nút .btn-folder (XUẤT VIDEO) và .btn-srt (XUẤT PHỤ ĐỀ) -->

      </div>
    </div>

    <div class="settings-panel" id="settings-view">
      <div class="settings-header">
        <span class="settings-title">
          <span class="vn">CÀI ĐẶT PHÍM TẮT</span><span class="en">HOTKEY SETTINGS</span>
        </span>
        <button class="icon-btn" id="btn-close-settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding-right: 4px;">
        <div class="setting-group">
          <label class="setting-label"><span class="vn">Phím Ẩn / Hiện Giao Diện</span><span class="en">Toggle UI Panel Key</span></label>
          <input type="text" class="shortcut-input" id="inp-ui" placeholder="Nhấn phím / Press key...">
        </div>
        <div class="setting-group">
          <label class="setting-label"><span class="vn">Phím Hoàn Tác (Undo)</span><span class="en">Undo Action Key</span></label>
          <input type="text" class="shortcut-input" id="inp-undo" placeholder="Nhấn phím / Press key...">
        </div>
        <div class="setting-group">
          <label class="setting-label"><span class="vn">Phím Tự động Gom Clip</span><span class="en">Auto Compound Clip Key</span></label>
          <input type="text" class="shortcut-input" id="inp-macro" placeholder="Nhấn phím / Press key...">
        </div>
        <div class="setting-group">
          <label class="setting-label"><span class="vn">Phím Xuất Phụ Đề SRT</span><span class="en">Export SRT Key</span></label>
          <input type="text" class="shortcut-input" id="inp-srt" placeholder="Nhấn phím / Press key...">
        </div>
        <div class="setting-group">
          <label class="setting-label"><span class="vn">Phím Xuất Video</span><span class="en">Export Video Key</span></label>
          <input type="text" class="shortcut-input" id="inp-cut" placeholder="Nhấn phím / Press key...">
        </div>
      </div>

      <button class="save-btn" id="btn-save-settings">
        <span class="vn">LƯU CÀI ĐẶT</span><span class="en">SAVE SETTINGS</span>
      </button>
    </div>

    <div class="status-bar">
      <span class="status-dot" id="status-indicator"></span>
      <span id="status-label">
        <span class="vn">Khởi động...</span><span class="en">Starting...</span>
      </span>
    </div>
  </div>

  <script>
    let ipcRenderer;
    if (typeof require !== 'undefined') {
      ipcRenderer = require('electron').ipcRenderer;
    } else {
      console.warn("Môi trường Web. Đã giả lập ipcRenderer.");
      ipcRenderer = { send: () => {}, on: () => {} };
    }

    // Cơ chế chuyển đổi ngôn ngữ
    let currentLang = 'vn';
    function toggleLang() {
      currentLang = currentLang === 'vn' ? 'en' : 'vn';
      document.body.className = 'lang-' + currentLang;
    }

    const statusLabel = document.getElementById('status-label');
    const statusIndicator = document.getElementById('status-indicator');

    const settingsView = document.getElementById('settings-view');
    const btnSettings = document.getElementById('btn-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnSaveSettings = document.getElementById('btn-save-settings');

    let currentConfig = {};
    let isDragging = false;
    let startX, startY;

    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('.win-btn') || e.target.closest('.btn') || e.target.closest('.icon-btn') || e.target.closest('.shortcut-input')) return;
      isDragging = true;
      startX = e.screenX; startY = e.screenY;
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      ipcRenderer.send('window-move', { deltaX: e.screenX - startX, deltaY: e.screenY - startY });
      startX = e.screenX; startY = e.screenY;
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    function hideApp() { ipcRenderer.send('app-hide'); }
    function minimizeApp() { ipcRenderer.send('app-minimize'); }
    function cutCacheFolder() { ipcRenderer.send('cut-cache-video'); }
    function exportSrt() { ipcRenderer.send('get-latest-srt'); }

    btnSettings.onclick = () => settingsView.classList.add('open');
    btnCloseSettings.onclick = () => settingsView.classList.remove('open');

    ipcRenderer.on('load-config', (event, config) => {
      currentConfig = config;
      document.getElementById('lbl-ui').innerText = config.toggleUI || 'Chưa gán';
      document.getElementById('lbl-undo').innerText = config.undo || 'Chưa gán';
      document.getElementById('lbl-macro').innerText = config.macro || 'Chưa gán';
      document.getElementById('lbl-srt').innerText = config.srt || 'Chưa gán';
      document.getElementById('lbl-cut').innerText = config.cut || 'Chưa gán';

      document.getElementById('inp-ui').value = config.toggleUI;
      document.getElementById('inp-undo').value = config.undo;
      document.getElementById('inp-macro').value = config.macro;
      document.getElementById('inp-srt').value = config.srt;
      document.getElementById('inp-cut').value = config.cut;
    });

    const inputs = document.querySelectorAll('.shortcut-input');
    inputs.forEach(input => {
      input.addEventListener('keydown', (e) => {
        e.preventDefault();
        let keys = [];
        if (e.ctrlKey) keys.push('CommandOrControl');
        if (e.altKey) keys.push('Alt');
        if (e.shiftKey) keys.push('Shift');
        
        let k = e.key;
        if (['Control', 'Alt', 'Shift', 'Meta', 'Tab', 'Escape'].includes(k)) return;
        if (/^[a-z]$/.test(k)) k = k.toUpperCase();
        if (k.startsWith('Arrow')) k = k.replace('Arrow', '');
        if (k === ' ') k = 'Space';
        
        keys.push(k);
        e.target.value = keys.join('+');
      });
    });

    btnSaveSettings.onclick = () => {
      const newConfig = {
        toggleUI: document.getElementById('inp-ui').value,
        undo: document.getElementById('inp-undo').value,
        macro: document.getElementById('inp-macro').value,
        srt: document.getElementById('inp-srt').value,
        cut: document.getElementById('inp-cut').value
      };
      ipcRenderer.send('save-config', newConfig);
      
      document.getElementById('lbl-ui').innerText = newConfig.toggleUI;
      document.getElementById('lbl-undo').innerText = newConfig.undo;
      document.getElementById('lbl-macro').innerText = newConfig.macro;
      document.getElementById('lbl-srt').innerText = newConfig.srt;
      document.getElementById('lbl-cut').innerText = newConfig.cut;
      settingsView.classList.remove('open');
    };

    // Bộ phiên dịch thông báo từ hệ thống
    const translateMsg = {
      'Đã Undo (Hoàn tác).': 'Undo successful.',
      'Đã bôi đen và gộp Clip xong!': 'Clips selected & compounded!',
      '❌ Không có phụ đề nào để xuất!': '❌ No subtitles to export!',
      '✅ Đã lưu file SRT thành công!': '✅ SRT file saved successfully!',
      '❌ Thư mục Cache chưa tồn tại. (Quên bật Motion Blur?)': '❌ Cache not found. (Forgot Motion Blur?)',
      '❌ Không có video nào được Render ngầm!': '❌ No background rendered video found!',
      '✅ Đã CUT video và dọn rác Cache thành công!': '✅ Video Exported & Cache cleaned successfully!'
    };

    ipcRenderer.on('capcut-status', (event, isRunning) => {
      if (isRunning) {
        statusIndicator.className = 'status-dot active';
        statusLabel.innerHTML = '<span class="vn">CapCut đang mở! Đã kích hoạt phím ngầm.</span><span class="en">CapCut is open! Hotkeys active.</span>';
      } else {
        statusIndicator.className = 'status-dot';
        statusLabel.innerHTML = '<span class="vn">Chờ CapCut... Phím ngầm đã tắt.</span><span class="en">Waiting for CapCut... Hotkeys disabled.</span>';
      }
    });

    ipcRenderer.on('macro-status', (event, message) => {
      const enMsg = translateMsg[message] || message;
      statusLabel.innerHTML = `<span class="vn">${message}</span><span class="en">${enMsg}</span>`;
    });
  </script>
</body>
</html>
