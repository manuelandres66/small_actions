from django.contrib import admin
from . import models
# Register your models here.

admin.site.register(models.Point)
admin.site.register(models.Help)
admin.site.register(models.Organization)