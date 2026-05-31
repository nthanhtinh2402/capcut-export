@echo off
chcp 65001 >nul
color 0C
title Gỡ Cài Đặt CapCut Background Exporter
echo ===================================================
echo   DANG GO BO UNG DUNG KHOI WINDOWS STARTUP...
echo ===================================================
echo.

set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT_FILE=%STARTUP_FOLDER%\CapCutBackgroundExporter.lnk"

if exist "%SHORTCUT_FILE%" (
del "%SHORTCUT_FILE%"
echo Da xoa thanh cong shortcut khoi thu muc Startup!
) else (
echo Khong tim thay shortcut. Co the ung dung chua duoc cai dat.
)

:: Tắt luôn tiến trình nếu nó đang chạy
taskkill /F /IM electron.exe /T >nul 2>&1

echo.
echo Da don dep xong! Ung dung se khong tu dong chay vao lan khoi dong toi nua.
echo.
pause