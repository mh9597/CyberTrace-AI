# CyberTrace AI Launch Script (PowerShell)
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Starting CyberTrace AI Platform (SIH 2026)" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Start Backend in new window
Write-Host "Launching FastAPI Backend on http://localhost:8000..." -ForegroundColor Yellow
Start-Process powershell -WorkingDirectory $PSScriptRoot -ArgumentList "-NoExit", "-Command", "python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload"

# 2. Start Frontend in new window
Write-Host "Launching React Frontend on http://localhost:5173..." -ForegroundColor Yellow
Start-Process powershell -WorkingDirectory "$PSScriptRoot\frontend" -ArgumentList "-NoExit", "-Command", "npm.cmd run dev"

Start-Sleep -Seconds 3
Write-Host "`nAll services launched successfully!" -ForegroundColor Green
Write-Host "Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:   http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs:  http://localhost:8000/api/docs" -ForegroundColor Cyan
