docker-compose down -v
docker-compose build
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d