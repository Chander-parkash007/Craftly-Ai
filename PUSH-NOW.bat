@echo off
echo ========================================
echo   CRAFTLY AI - FINAL PUSH TO GITHUB
echo ========================================
echo.

echo Step 1: Adding all files...
git add .
echo.

echo Step 2: Committing changes...
git commit -m "Final version: Complete Craftly AI with all features, fixes, and documentation"
echo.

echo Step 3: Pulling remote changes...
git pull origin main --allow-unrelated-histories
echo.

echo Step 4: Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo   PUSH COMPLETE!
echo ========================================
echo.
echo Check your repository at:
echo https://github.com/Chander-parkash007/Craftly-Ai
echo.
pause
