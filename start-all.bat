@echo off
echo ============================================================
echo   Fitness Management System — Starting All Services
echo ============================================================

echo [1/5] Starting User Service (port 3001)...
start "User Service" cmd /k "cd user-service && npm start"
timeout /t 2 /nobreak >nul

echo [2/5] Starting Workout Service (port 3002)...
start "Workout Service" cmd /k "cd workout-service && npm start"
timeout /t 2 /nobreak >nul

echo [3/5] Starting Progress Service (port 3003)...
start "Progress Service" cmd /k "cd progress-service && npm start"
timeout /t 2 /nobreak >nul

echo [4/5] Starting Nutrition Service (port 3004)...
start "Nutrition Service" cmd /k "cd nutrition-service && npm start"
timeout /t 2 /nobreak >nul

echo [5/5] Starting API Gateway (port 8080)...
start "API Gateway" cmd /k "cd api-gateway && npm start"
timeout /t 2 /nobreak >nul

echo.
echo ============================================================
echo   All services started! Open these URLs:
echo   Gateway Swagger:  http://localhost:8080/api-docs
echo   User Swagger:     http://localhost:3001/api-docs
echo   Workout Swagger:  http://localhost:3002/api-docs
echo   Progress Swagger: http://localhost:3003/api-docs
echo   Nutrition Swagger:http://localhost:3004/api-docs
echo ============================================================
pause
