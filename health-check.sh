#!/bin/bash

# Health Check Script for Smart Food Management System
# Validates all services are running and responsive

BACKEND_URL="${1:-http://localhost:5000}"
FRONTEND_URL="${2:-http://localhost:3000}"
AI_SERVICE_URL="${3:-http://localhost:8000}"

echo ""
echo "======================================"
echo "🏥 Smart Food System - Health Check"
echo "======================================"
echo ""

ALL_HEALTHY=true

# Function to test endpoint
test_service_health() {
    local SERVICE_NAME=$1
    local URL=$2
    local ENDPOINT=${3:-/health}
    
    echo "Testing $SERVICE_NAME..."
    
    if response=$(curl -s -w "\n%{http_code}" "$URL$ENDPOINT" 2>/dev/null); then
        http_code=$(echo "$response" | tail -n 1)
        body=$(echo "$response" | head -n -1)
        
        if [ "$http_code" = "200" ]; then
            echo "✅ $SERVICE_NAME is healthy"
            echo "   URL: $URL"
            return 0
        else
            echo "❌ $SERVICE_NAME returned status code: $http_code"
            return 1
        fi
    else
        echo "❌ $SERVICE_NAME is not responding"
        return 1
    fi
}

# Test Backend
if ! test_service_health "Backend" "$BACKEND_URL"; then
    ALL_HEALTHY=false
fi

echo ""

# Test AI Service
if ! test_service_health "AI Service" "$AI_SERVICE_URL"; then
    ALL_HEALTHY=false
fi

echo ""

# Test Frontend (usually 404 for /health but should respond)
echo "Testing Frontend..."
if response=$(curl -s -w "\n%{http_code}" "$FRONTEND_URL" 2>/dev/null); then
    http_code=$(echo "$response" | tail -n 1)
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "404" ]; then
        echo "✅ Frontend is responsive"
        echo "   URL: $FRONTEND_URL"
    else
        echo "❌ Frontend returned status code: $http_code"
        ALL_HEALTHY=false
    fi
else
    echo "❌ Frontend is not responding"
    ALL_HEALTHY=false
fi

echo ""

# Additional Backend Checks
if test_service_health "Backend" "$BACKEND_URL" "/" > /dev/null 2>&1; then
    echo "Running additional Backend checks..."
    if response=$(curl -s "$BACKEND_URL/" 2>/dev/null); then
        echo "   Backend status: $response"
    fi
fi

echo ""
echo "======================================"

if [ "$ALL_HEALTHY" = true ]; then
    echo "✅ All services are healthy!"
    echo "======================================"
    echo ""
    exit 0
else
    echo "❌ Some services are not responding"
    echo "======================================"
    echo ""
    echo "Make sure all services are running:"
    echo "  - Backend: npm start (from backend folder)"
    echo "  - Frontend: npm run dev (from frontend folder)"
    echo "  - AI Service: uvicorn api:app --reload (from ai-service folder)"
    echo ""
    exit 1
fi
