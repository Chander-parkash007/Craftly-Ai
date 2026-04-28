@echo off
echo ========================================
echo   Craftly AI - Setup Checker
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is NOT installed!
    echo.
    echo Please install Node.js from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is NOT installed!
    echo.
    pause
    exit /b 1
)

echo [OK] npm is installed
npm --version
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [WARNING] Dependencies not installed!
    echo.
    echo Run: npm install
    echo.
) else (
    echo [OK] Dependencies are installed
    echo.
)

REM Check if .env file exists
if not exist ".env" (
    echo [ERROR] .env file is MISSING!
    echo.
    echo Creating .env file...
    echo # Get your free GROQ API key from https://console.groq.com > .env
    echo REACT_APP_GROQ_API_KEY=paste_your_groq_key_here >> .env
    echo.
    echo [CREATED] .env file created with placeholder
    echo.
) else (
    echo [OK] .env file exists
    echo.
)

REM Check if API key is configured
findstr /C:"paste_your_groq_key_here" .env >nul
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] API Key is NOT configured!
    echo.
    echo Your .env file still has the placeholder key.
    echo.
    echo TO FIX:
    echo 1. Get a free API key from: https://console.groq.com
    echo 2. Open .env file in this folder
    echo 3. Replace 'paste_your_groq_key_here' with your actual key
    echo 4. Save the file
    echo 5. Restart the app
    echo.
    echo The app will work with limited features without a valid API key.
    echo.
) else (
    findstr /C:"gsk_" .env >nul
    if %ERRORLEVEL% EQU 0 (
        echo [OK] API Key appears to be configured!
        echo.
    ) else (
        echo [WARNING] API Key format looks incorrect
        echo.
        echo Make sure your key starts with 'gsk_'
        echo.
    )
)

echo ========================================
echo   Setup Check Complete
echo ========================================
echo.
echo To start the app, run: npm start
echo.
pause
