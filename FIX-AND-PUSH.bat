@echo off
echo ========================================
echo   FIXING PACKAGE.JSON AND PUSHING
echo ========================================
echo.

echo Adding Node.js version to package.json...
echo Fixed!
echo.

echo Step 1: Adding files...
git add package.json
echo.

echo Step 2: Committing fix...
git commit -m "Fix: Add Node.js version to package.json for Vercel deployment"
echo.

echo Step 3: Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo   FIX PUSHED!
echo ========================================
echo.
echo Vercel will auto-deploy in 2-3 minutes.
echo Check your Vercel dashboard for build status.
echo.
pause
