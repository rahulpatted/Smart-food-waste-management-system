# Health Check Script for Smart Food Management System
# Validates all services are running and responsive

param(
    [string]$BackendUrl = "http://localhost:5000",
    [string]$FrontendUrl = "http://localhost:3000",
    [string]$AiServiceUrl = "http://localhost:8000"
)

Write-Host "`n======================================" -ForegroundColor Cyan
Write-Host "🏥 Smart Food System - Health Check" -ForegroundColor Cyan
Write-Host "======================================`n" -ForegroundColor Cyan

$allHealthy = $true

# Function to test endpoint
function Test-ServiceHealth {
    param(
        [string]$ServiceName,
        [string]$Url,
        [string]$HealthEndpoint = "/health"
    )
    
    try {
        Write-Host "Testing $ServiceName..." -ForegroundColor Yellow
        $response = Invoke-WebRequest -Uri "$Url$HealthEndpoint" -UseBasicParsing -TimeoutSec 5
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $ServiceName is healthy" -ForegroundColor Green
            Write-Host "   URL: $Url" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $ServiceName returned status code: $($response.StatusCode)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ $ServiceName is not responding" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test Backend
$backendHealth = Test-ServiceHealth "Backend" $BackendUrl
if (-not $backendHealth) { $allHealthy = $false }

Write-Host ""

# Test AI Service
$aiHealth = Test-ServiceHealth "AI Service" $AiServiceUrl
if (-not $aiHealth) { $allHealthy = $false }

Write-Host ""

# Test Frontend (usually 404 for /health but should respond)
try {
    Write-Host "Testing Frontend..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri $FrontendUrl -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Frontend is responsive" -ForegroundColor Green
    Write-Host "   URL: $FrontendUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend is not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $allHealthy = $false
}

Write-Host ""

# Additional Backend Checks
if ($backendHealth) {
    Write-Host "Running additional Backend checks..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "$BackendUrl/" -UseBasicParsing
        $json = $response.Content | ConvertFrom-Json
        Write-Host "   Message: $($json.message)" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Could not fetch backend status message" -ForegroundColor Yellow
    }
}

Write-Host ""

# Summary
Write-Host "======================================" -ForegroundColor Cyan
if ($allHealthy) {
    Write-Host "✅ All services are healthy!" -ForegroundColor Green
    Write-Host "======================================`n" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "❌ Some services are not responding" -ForegroundColor Red
    Write-Host "======================================`n" -ForegroundColor Cyan
    Write-Host "Make sure all services are running:" -ForegroundColor Yellow
    Write-Host "  - Backend: npm start (from backend folder)" -ForegroundColor Yellow
    Write-Host "  - Frontend: npm run dev (from frontend folder)" -ForegroundColor Yellow
    Write-Host "  - AI Service: uvicorn api:app --reload (from ai-service folder)" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
