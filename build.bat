@echo off
REM Build backend.py + thu muc web/ thanh 1 file .exe (Windows)
REM Yeu cau: da cai Python, va cau truc thu muc nhu sau (cung cap voi file nay):
REM   backend.py
REM   web\index.html
REM   web\app.js
REM   web\style.css
REM   build.bat   <-- file nay

echo ============================================
echo   Dang cai dat cac thu vien can thiet...
echo ============================================
pip install --upgrade pyinstaller pywebview faster-whisper

echo.
echo ============================================
echo   Dang build file .exe...
echo   (--add-data de nhung thu muc web/ vao ben trong exe)
echo ============================================
pyinstaller --onefile --windowed --name VideoToText ^
  --add-data "web;web" ^
  --hidden-import webview.platforms.edgechromium ^
  backend.py

echo.
echo ============================================
echo   Hoan tat!
echo   File exe nam trong thu muc: dist\VideoToText.exe
echo.
echo   Luu y: may chay file exe can co san
echo   Microsoft Edge WebView2 Runtime (Windows 10/11 moi
echo   thuong da co san). Neu chua co, tai tai:
echo   https://developer.microsoft.com/microsoft-edge/webview2/
echo ============================================
pause
