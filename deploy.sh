#!/bin/bash

# Deployment script for CleanTabs

echo "🚀 Starting deployment..."

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t cleantabs-app .

# Stop existing container if running
echo "🛑 Stopping existing container..."
docker stop cleantabs-container 2>/dev/null || true
docker rm cleantabs-container 2>/dev/null || true

# Run the new container
echo "▶️ Starting new container..."
docker run -d \
  --name cleantabs-container \
  -p 3000:3000 \
  -v $(pwd)/database.db:/app/database.db \
  --restart unless-stopped \
  cleantabs-app

echo "✅ Deployment completed!"
echo "🌐 Application is running at http://localhost:3000"

# Check if container is running
sleep 5
if docker ps | grep -q cleantabs-container; then
  echo "✅ Container is running successfully"
else
  echo "❌ Container failed to start"
  docker logs cleantabs-container
fi