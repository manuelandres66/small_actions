import os

import sys

sys.path.append('/opt/bitnami/projects/small_actions')

os.environ.setdefault("PYTHON_EGG_CACHE", "/opt/bitnami/projects/small_actions/egg_cache")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "small_actions.settings")

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
