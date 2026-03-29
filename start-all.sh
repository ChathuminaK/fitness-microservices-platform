#!/bin/bash
# start-all.sh — Start all Fitness Management System microservices

echo "============================================================"
echo "  Fitness Management System — Starting All Services"
echo "============================================================"

# Function to open a new terminal tab and run a command
start_service() {
  local name=$1
  local dir=$2
  local port=$3

  echo "[$name] Starting on port $port..."

  # Try gnome-terminal (Linux), then osascript (macOS), then run in background
  if command -v gnome-terminal &>/dev/null; then
    gnome-terminal --tab --title="$name" -- bash -c "cd $dir && npm start; exec bash"
  elif command -v osascript &>/dev/null; then
    osascript -e "tell application \"Terminal\" to do script \"cd $(pwd)/$dir && npm start\""
  else
    # Fallback: run all in background with log files
    cd "$dir" && npm start > "../logs/${name}.log" 2>&1 &
    cd ..
    echo "  → Running in background. Log: logs/${name}.log"
  fi

  sleep 1
}

# Create logs directory for background mode
mkdir -p logs

start_service "User Service"      "user-service"      3001
start_service "Workout Service"   "workout-service"   3002
start_service "Progress Service"  "progress-service"  3003
start_service "Nutrition Service" "nutrition-service" 3004

echo ""
echo "Waiting 3 seconds before starting API Gateway..."
sleep 3

start_service "API Gateway"       "api-gateway"       8080

echo ""
echo "============================================================"
echo "  All services started!"
echo "  Gateway Swagger:   http://localhost:8080/api-docs"
echo "  Gateway Status:    http://localhost:8080/gateway/status"
echo "  User Swagger:      http://localhost:3001/api-docs"
echo "  Workout Swagger:   http://localhost:3002/api-docs"
echo "  Progress Swagger:  http://localhost:3003/api-docs"
echo "  Nutrition Swagger: http://localhost:3004/api-docs"
echo "============================================================"
