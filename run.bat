@echo off
title CyberTrace AI Platform Launcher
echo ==================================================
echo  Starting CyberTrace AI Platform (SIH 2026)
echo ==================================================

echo Launching FastAPI Backend on http://localhost:8000...
start cmd /k "python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Launching React Frontend on http://localhost:5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo All services launched!
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/api/docs
