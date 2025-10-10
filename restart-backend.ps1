# PowerShell script to rebuild and restart backend services with CORS fixes

Write-Host "🔄 Rebuilding and restarting backend services with CORS fixes..." -ForegroundColor Cyan

# Set Java 17 and Maven paths
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:PATH = "$env:JAVA_HOME\bin;C:\Users\amir\apache-maven-3.9.11\bin;$env:PATH"

# Verify Java version
Write-Host "☕ Using Java version:" -ForegroundColor Magenta
& java --version

# Navigate to backend directory
Set-Location "backend"

# Stop any running Java processes (optional)
Write-Host "🛑 Stopping any existing Java processes..." -ForegroundColor Yellow
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force

# Clean and rebuild all services
Write-Host "🧹 Cleaning and rebuilding all services..." -ForegroundColor Green
& "C:\Users\amir\apache-maven-3.9.11\bin\mvn.cmd" clean install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful! Starting services..." -ForegroundColor Green
    
    # Start Work Order Service (Port 8081)
    Write-Host "🚀 Starting Work Order Service on port 8081..." -ForegroundColor Blue
    Start-Process -FilePath "cmd" -ArgumentList "/c", "cd work-order-service && C:\Users\amir\apache-maven-3.9.11\bin\mvn.cmd spring-boot:run" -WindowStyle Minimized
    
    # Wait a bit before starting next service
    Start-Sleep -Seconds 3
    
    # Start Technician Service (Port 8082)
    Write-Host "🚀 Starting Technician Service on port 8082..." -ForegroundColor Blue
    Start-Process -FilePath "cmd" -ArgumentList "/c", "cd technician-service && C:\Users\amir\apache-maven-3.9.11\bin\mvn.cmd spring-boot:run" -WindowStyle Minimized
    
    # Wait a bit before starting next service
    Start-Sleep -Seconds 3
    
    # Start Schedule Service (Port 8083)
    Write-Host "🚀 Starting Schedule Service on port 8083..." -ForegroundColor Blue
    Start-Process -FilePath "cmd" -ArgumentList "/c", "cd schedule-service && C:\Users\amir\apache-maven-3.9.11\bin\mvn.cmd spring-boot:run" -WindowStyle Minimized
    
    Write-Host "✅ All services are starting up!" -ForegroundColor Green
    Write-Host "📍 Services will be available at:" -ForegroundColor Cyan
    Write-Host "   • Work Order Service: http://localhost:8081" -ForegroundColor White
    Write-Host "   • Technician Service: http://localhost:8082" -ForegroundColor White
    Write-Host "   • Schedule Service: http://localhost:8083" -ForegroundColor White
    Write-Host "   • WebSocket endpoint: http://localhost:8081/ws" -ForegroundColor White
    Write-Host ""
    Write-Host "🔍 You can check logs in the separate command windows that opened." -ForegroundColor Yellow
    Write-Host "🌐 CORS is now configured to allow requests from any origin." -ForegroundColor Green
    
} else {
    Write-Host "❌ Build failed! Please check the error messages above." -ForegroundColor Red
}

# Navigate back to original directory
Set-Location ".."