from django.contrib import admin

# Register your models here.
from . import models

admin.site.register(models.Organization)
admin.site.register(models.InstagramPublication)