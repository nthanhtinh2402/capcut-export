@echo off
chcp 65001 >nul
color 0A
title Cài Đặt CapCut Background Exporter
echo ===================================================
echo   DANG CAI DAT UNG DUNG VAO WINDOWS STARTUP...
echo ===================================================
echo.

:: Lấy đường dẫn thư mục hiện tại
set "CURRENT_DIR=%~dp0"
set "VBS_RUNNER=%CURRENT_DIR%run_hidden.vbs"
set "BAT_RUNNER=%CURRENT_DIR%run_electron.bat"
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

:: 1. Tạo file bat chạy app
echo @echo off > "%BAT_RUNNER%"
echo cd /d "%CURRENT_DIR%" >> "%BAT_RUNNER%"
echo npm start >> "%BAT_RUNNER%"

:: 2. Tạo file VBS để chạy file bat kia một cách hoàn toàn ẩn (Không hiện CMD đen)
echo Set WshShell = CreateObject("WScript.Shell") > "%VBS_RUNNER%"
echo WshShell.Run chr(34) ^& "%BAT_RUNNER%" ^& Chr(34), 0, False >> "%VBS_RUNNER%"
echo Set WshShell = Nothing >> "%VBS_RUNNER%"

:: 3. Tạo Shortcut ném vào thư mục Startup của Windows
echo Set WshShell = CreateObject("WScript.Shell") > "%CURRENT_DIR%create_shortcut.vbs"
echo Set Shortcut = WshShell.CreateShortcut("%STARTUP_FOLDER%\CapCutBackgroundExporter.lnk") >> "%CURRENT_DIR%create_shortcut.vbs"
echo Shortcut.TargetPath = "%VBS_RUNNER%" >> "%CURRENT_DIR%create_shortcut.vbs"
echo Shortcut.WorkingDirectory = "%CURRENT_DIR%" >> "%CURRENT_DIR%create_shortcut.vbs"
echo Shortcut.WindowStyle = 7 >> "%CURRENT_DIR%create_shortcut.vbs"
echo Shortcut.Save >> "%CURRENT_DIR%create_shortcut.vbs"

cscript //nologo "%CURRENT_DIR%create_shortcut.vbs"
del "%CURRENT_DIR%create_shortcut.vbs"

echo.
echo HOAN TAT!
echo Tu nay moi khi ban mo may tinh, ung dung se tu dong chay ngam.
echo (Ban co the an nut F2 de goi giao dien len bat cu luc nao).
echo.
echo De chay ngay bay gio, hay nhap dup vao file run_hidden.vbs
echo.
pause