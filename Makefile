build:
	docker-compose down
	docker-compose rm
	docker-compose build

start:
	docker-compose up -d

stop:
	docker-compose down

bash:
	docker-compose exec backend bash

logs:
	docker-compose logs -f

migrate:
	docker-compose exec -T backend bash -c "python am/manage.py migrate"

admin:
	docker-compose exec -T backend bash -c 'echo "from django.contrib.auth.models import User; User.objects.create_superuser(\"root\", \"techsupport@herolfg.com\", \"changeme\")" | python am/manage.py shell'

key:
	printf "DJANGO_SECRET=%s\n" "`docker-compose exec -T backend python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`" > .env

webpack:
	docker-compose exec -T frontend bash -c 'cd static && webpack'

front:
	docker-compose exec frontend bash
