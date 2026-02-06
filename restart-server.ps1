# Restart Development Server Script
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Restarting Development Server" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

# Navigate to project directory
Set-Location "F:\Fast Campus\UI Prototyping Guide\Study\Realm Of Shadows\Pre-registration landing page"

# Stop existing node processes
Write-Host "1. Stopping existing server..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1
Write-Host "   ✅ Server stopped`n" -ForegroundColor Green

# Clean Vite cache
Write-Host "2. Cleaning Vite cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "   ✅ Vite cache deleted`n" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ No cache to clean`n" -ForegroundColor Gray
}

# Verify .env file
Write-Host "3. Verifying .env configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    $envContent = Get-Content .env -Raw
    if ($envContent -match "ijmsaidaaquiujspwbkr") {
        Write-Host "   ✅ Supabase URL: https://ijmsaidaaquiujspwbkr.supabase.co" -ForegroundColor Green
        Write-Host "   ✅ Configuration verified!`n" -ForegroundColor Green
    } else {
        Write-Host "   ❌ ERROR: .env file not updated!" -ForegroundColor Red
        Write-Host "   Please update the .env file first.`n" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "   ❌ ERROR: .env file not found!`n" -ForegroundColor Red
    exit 1
}

# Start server
Write-Host "4. Starting development server..." -ForegroundColor Yellow
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Server Information" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Project: Realm of Shadows - Pre-registration" -ForegroundColor Gray
Write-Host "URL:     http://localhost:5173" -ForegroundColor Green
Write-Host "Supabase: https://ijmsaidaaquiujspwbkr.supabase.co" -ForegroundColor Gray
Write-Host "`nPress Ctrl+C to stop" -ForegroundColor Gray
Write-Host "========================================`n" -ForegroundColor Cyan

npx vite --clearScreen false --force --host 0.0.0.0
