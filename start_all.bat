@echo off
echo Starting FoodSave Application locally...

:: Kill existing node or python processes (optional but recommended during hackathon restarts)
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1

:: 1. Launch Backend
start cmd /k "title Backend Server && cd /d %~dp0backend && node server.js"

:: 2. Launch Frontend
start cmd /k "title Frontend Server && cd /d %~dp0frontend && npm run dev"

:: 3. Launch AI Service
start cmd /k "title AI Service && cd /d %~dp0ai-service && python -m uvicorn api:app --reload --port 8000"

echo All services are launching in separate windows. 🚀
echo.
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:5000
echo - AI Service API: http://localhost:8000/docs
echo.
exit
