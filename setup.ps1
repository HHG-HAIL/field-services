# Field Service App - Setup Script
# This script helps you set up and run the Field Service Management System

Write-Host "🏗️  Field Service Management System Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "field-service-app") -or -not (Test-Path "backend")) {
    Write-Host "❌ Error: Please run this script from the task-app directory" -ForegroundColor Red
    Write-Host "Expected structure:" -ForegroundColor Yellow
    Write-Host "  task-app/" -ForegroundColor Yellow
    Write-Host "    ├── field-service-app/" -ForegroundColor Yellow
    Write-Host "    ├── backend/" -ForegroundColor Yellow
    Write-Host "    └── setup.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Project structure verified" -ForegroundColor Green

# Check Java installation
Write-Host "`n🔍 Checking Java installation..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1
    if ($javaVersion -match "17|18|19|20|21") {
        Write-Host "✅ Java 17+ found" -ForegroundColor Green
        $javaInstalled = $true
    } else {
        Write-Host "⚠️  Java 17+ required. Current version:" -ForegroundColor Yellow
        Write-Host $javaVersion -ForegroundColor White
        $javaInstalled = $false
    }
} catch {
    Write-Host "❌ Java not found in PATH" -ForegroundColor Red
    $javaInstalled = $false
}

# Check Maven installation
Write-Host "`n🔍 Checking Maven installation..." -ForegroundColor Yellow
try {
    $mavenVersion = mvn -version 2>&1
    if ($mavenVersion -match "Apache Maven") {
        Write-Host "✅ Maven found" -ForegroundColor Green
        $mavenInstalled = $true
    } else {
        $mavenInstalled = $false
    }
} catch {
    Write-Host "❌ Maven not found in PATH" -ForegroundColor Red
    $mavenInstalled = $false
}

# Check Node.js installation
Write-Host "`n🔍 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node -version 2>&1
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
    $nodeInstalled = $true
} catch {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    $nodeInstalled = $false
}

# Installation recommendations
if (-not $javaInstalled -or -not $mavenInstalled) {
    Write-Host "`n📋 Installation Required:" -ForegroundColor Cyan
    
    if (-not $javaInstalled) {
        Write-Host "📦 Java 17+ - Download from: https://adoptium.net/temurin/releases/" -ForegroundColor White
    }
    
    if (-not $mavenInstalled) {
        Write-Host "📦 Maven 3.8+ - Download from: https://maven.apache.org/download.cgi" -ForegroundColor White
    }
    
    Write-Host "`n💡 After installation, restart this script" -ForegroundColor Yellow
}

# Show available options
Write-Host "`n🚀 Available Options:" -ForegroundColor Cyan
Write-Host "1. Demo Mode (Frontend only - No backend needed)" -ForegroundColor White
Write-Host "2. Full Integration (Frontend + Backend services)" -ForegroundColor White
Write-Host "3. Build Backend Only" -ForegroundColor White
Write-Host "4. Open Project Documentation" -ForegroundColor White
Write-Host "5. Exit" -ForegroundColor White

$choice = Read-Host "`nEnter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host "`n🎯 Starting Demo Mode..." -ForegroundColor Green
        Write-Host "Opening React app with mock data" -ForegroundColor White
        Set-Location field-service-app
        npm start
    }
    
    "2" {
        if ($javaInstalled -and $mavenInstalled) {
            Write-Host "`n🏗️  Starting Full Integration..." -ForegroundColor Green
            
            # Build backend
            Write-Host "Building backend services..." -ForegroundColor Yellow
            Set-Location backend
            mvn clean compile
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Backend built successfully" -ForegroundColor Green
                
                Write-Host "`n🚀 Starting services..." -ForegroundColor Yellow
                Write-Host "This will open 4 terminal windows:" -ForegroundColor White
                Write-Host "  1. Work Order Service (Port 8081)" -ForegroundColor White
                Write-Host "  2. Technician Service (Port 8082)" -ForegroundColor White
                Write-Host "  3. Schedule Service (Port 8083)" -ForegroundColor White
                Write-Host "  4. React Frontend (Port 3000)" -ForegroundColor White
                
                $confirm = Read-Host "`nProceed? (y/n)"
                if ($confirm -eq "y" -or $confirm -eq "Y") {
                    # Start backend services in new terminals
                    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\work-order-service'; mvn spring-boot:run"
                    Start-Sleep 2
                    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\technician-service'; mvn spring-boot:run"
                    Start-Sleep 2
                    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\schedule-service'; mvn spring-boot:run"
                    Start-Sleep 3
                    
                    # Start frontend
                    Set-Location ..\field-service-app
                    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start"
                    
                    Write-Host "`n✅ All services starting!" -ForegroundColor Green
                    Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor White
                    Write-Host "Backend APIs available at ports 8081, 8082, 8083" -ForegroundColor White
                }
            } else {
                Write-Host "❌ Backend build failed" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Java 17+ and Maven required for full integration" -ForegroundColor Red
        }
    }
    
    "3" {
        if ($javaInstalled -and $mavenInstalled) {
            Write-Host "`n🔨 Building Backend..." -ForegroundColor Green
            Set-Location backend
            mvn clean compile
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Backend built successfully!" -ForegroundColor Green
                Write-Host "You can now start services manually or use option 2" -ForegroundColor White
            } else {
                Write-Host "❌ Backend build failed" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Java 17+ and Maven required" -ForegroundColor Red
        }
    }
    
    "4" {
        Write-Host "`n📖 Opening Documentation..." -ForegroundColor Green
        if (Test-Path "SETUP_GUIDE.md") {
            Start-Process "SETUP_GUIDE.md"
        } else {
            Write-Host "📄 Documentation: README.md files in backend/ and field-service-app/" -ForegroundColor White
        }
    }
    
    "5" {
        Write-Host "`n👋 Goodbye!" -ForegroundColor Green
        exit 0
    }
    
    default {
        Write-Host "`n❌ Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host "`n📚 For more information, see SETUP_GUIDE.md" -ForegroundColor Cyan