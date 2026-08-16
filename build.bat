@echo off
REM Build Desktop App (.exe) từ Next.js và desktop_app.py

echo ============================================
echo   1. Cai dat cac thu vien Python
echo ============================================
pip install --upgrade pyinstaller pywebview faster-whisper fastapi uvicorn python-multipart

echo.
echo ============================================
echo   2. Build Next.js (Xuat HTML tinh)
echo ============================================
call npm install
call npm run build

echo.
echo ============================================
echo   3. Dong goi thanh .exe (PyInstaller)
echo ============================================
REM --add-data "out;out" de nhung thu muc HTML vao ben trong exe
pyinstaller --onefile --windowed --name VideoToText ^
  --add-data "out;out" ^
  --hidden-import webview.platforms.edgechromium ^
  --exclude-module PyQt5 ^
  --exclude-module PyQt6 ^
  --exclude-module PySide2 ^
  --exclude-module PySide6 ^
  desktop_app.py

echo.
echo ============================================
echo   Hoan tat!
echo   File exe nam trong thu muc: dist\VideoToText.exe
echo.
echo   Luu y: May chay file exe can Microsoft Edge WebView2
echo   va phai duoc cai dat ffmpeg trong PATH.
echo ============================================
pause
