docker compose -f docker-compose-test.yml down
docker compose -f docker-compose-test.yml build || exit 1
docker image prune -f
docker compose -f docker-compose-test.yml up -d