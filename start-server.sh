#!/bin/bash
cd /home/runner/workspace
pkill -f "node server" 2>/dev/null || true
sleep 1
node server/basic-server.js &
echo "Server started on port 3000"
sleep 3
echo "Testing API endpoints..."
curl -s http://localhost:3000/api/characters | head -n 1
echo "Server is ready!"