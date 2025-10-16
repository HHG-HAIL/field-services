# PowerShell script to rebuild and restart backend services after moving projects

Write-Host "Rebuilding and restarting backend services with CORS fixes..." -ForegroundColor Cyan

$root = Split-Path -Parent $PSCommandPath
Set-Location $root

# Configure Java 17 and Maven
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:PATH = "$env:JAVA_HOME\bin;C:\Users\amir\apache-maven-3.9.11\bin;$env:PATH"

Write-Host "Using Java version:" -ForegroundColor Magenta
& java --version

Write-Host "Stopping any existing Java processes..." -ForegroundColor Yellow
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force

$services = @(
    @{ Name = "Work Order Service"; Path = "work-order-service"; Port = 8081 },
    @{ Name = "Technician Service"; Path = "technician-service"; Port = 8082 },
    @{ Name = "Schedule Service"; Path = "schedule-service"; Port = 8083 }
)

# Build services either via parent pom (if it exists) or individually
$aggregatorPom = Join-Path $root "backend\pom.xml"
$buildExit = 0

if (Test-Path $aggregatorPom) {
    Write-Host "Cleaning and rebuilding all services via backend/pom.xml..." -ForegroundColor Green
    Push-Location (Split-Path $aggregatorPom -Parent)
    & "C:\Users\amir\apache-maven-3.9.11\bin\mvn.cmd" clean install
    $buildExit = $LASTEXITCODE
    Pop-Location
} else {
    Write-Host "backend folder not found. Building each service individually..." -ForegroundColor Yellow
    foreach ($service in $services) {
        if (-not (Test-Path $service.Path)) {
            Write-Host "Skipping build for $($service.Name); folder '$($service.Path)' not found." -ForegroundColor Red
            $buildExit = 1
            continue
        }

        Write-Host "Cleaning and rebuilding $($service.Name)..." -ForegroundColor Green
        Push-Location $service.Path
        & "C:\Users\amir\apache-maven-3.9.11\bin\mvn.cmd" clean install
        if ($LASTEXITCODE -ne 0) {
            $buildExit = $LASTEXITCODE
            Pop-Location
            break
        }
        Pop-Location
    }
}

if ($buildExit -eq 0) {
    Write-Host "Build successful! Starting services..." -ForegroundColor Green

    foreach ($service in $services) {
        if (-not (Test-Path $service.Path)) {
            Write-Host "Cannot start $($service.Name); folder '$($service.Path)' not found." -ForegroundColor Red
            continue
        }

        Write-Host "Starting $($service.Name) on port $($service.Port)..." -ForegroundColor Blue
        Start-Process -FilePath "cmd" -ArgumentList "/c", "cd `"$($service.Path)`" && C:\Users\amir\apache-maven-3.9.11\bin\mvn.cmd spring-boot:run" -WindowStyle Minimized
        Start-Sleep -Seconds 3
    }

    Write-Host "Services will be available at:" -ForegroundColor Cyan
    Write-Host "   • Work Order Service: http://localhost:8081" -ForegroundColor White
    Write-Host "   • Technician Service: http://localhost:8082" -ForegroundColor White
    Write-Host "   • Schedule Service: http://localhost:8083" -ForegroundColor White
    Write-Host "   • WebSocket endpoint: http://localhost:8081/ws" -ForegroundColor White
    Write-Host ""
    Write-Host "Check logs in the separate command windows that opened." -ForegroundColor Yellow
} else {
    Write-Host "Build failed! Please review the errors above." -ForegroundColor Red
}
