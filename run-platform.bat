@echo off
echo Starting Bengal Education Ventures Platform...
echo ============================================

echo .
echo [1/3] Setting up Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd backend && npm install && npm run dev"

echo .
echo [2/3] Setting up Frontend Application (Port 3000)...
start "Frontend Application" cmd /k "cd frontend && npm install && npm run dev"

echo .
echo [3/3] Opening Browser...
timeout /t 10
start http://localhost:3000

echo .
echo ============================================
echo   DONE!
echo   - Backend running on http://localhost:5000
echo   - Frontend running on http://localhost:3000
echo   - Keep the opened command windows running!
echo ============================================
pause
