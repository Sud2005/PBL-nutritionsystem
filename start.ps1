if (!(Test-Path -Path "backend\data")) {
    New-Item -ItemType Directory -Force -Path "backend\data" | Out-Null
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Starting Indian Diet Decision System " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Starting Java Spring Boot Backend..." -ForegroundColor Green

# Start Backend in a new window
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit -Command `"cd backend; .\mvnw.cmd spring-boot:run`"" -WindowStyle Normal

Write-Host "Starting React Frontend..." -ForegroundColor Green
# Start Frontend in a new window
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit -Command `"cd frontend; npm install; npm run dev`"" -WindowStyle Normal

Write-Host "Services are booting up in separate windows!" -ForegroundColor Yellow
Write-Host "-> Backend API: http://localhost:8080"
Write-Host "-> Frontend UI: http://localhost:5173"
Write-Host "-> Database: SQLite (Auto-creates at /backend/data/app.db)"
