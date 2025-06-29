#!/bin/bash

# F1 Store Docker Management Script

case "$1" in
  "build")
    echo "🏗️  Building all Docker images..."
    docker compose build
    ;;
  "start")
    echo "🚀 Starting F1 Store application..."
    docker compose up -d
    echo ""
    echo "🏎️  F1 Store is running!"
    echo "📱 Home: http://localhost:3000"
    echo "🔍 Product Details: http://localhost:3002"
    echo "🔗 API: http://localhost:8080"
    echo ""
    echo "To stop: ./docker-run.sh stop"
    ;;
  "stop")
    echo "🛑 Stopping F1 Store application..."
    docker compose down
    ;;
  "restart")
    echo "🔄 Restarting F1 Store application..."
    docker compose down
    docker compose up -d
    ;;
  "logs")
    echo "📋 Showing logs..."
    docker compose logs -f
    ;;
  "clean")
    echo "🧹 Cleaning up Docker resources..."
    docker compose down -v
    docker system prune -f
    ;;
  *)
    echo "F1 Store Docker Management"
    echo ""
    echo "Usage: $0 {build|start|stop|restart|logs|clean}"
    echo ""
    echo "Commands:"
    echo "  build    - Build all Docker images"
    echo "  start    - Start the application"
    echo "  stop     - Stop the application"
    echo "  restart  - Restart the application"
    echo "  logs     - Show application logs"
    echo "  clean    - Clean up Docker resources"
    echo ""
    exit 1
    ;;
esac
