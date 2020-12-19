from django.contrib import admin
from . import models
# Register your models here.

class HelpAdmin(admin.ModelAdmin):
    filter_horizontal = ("photos",)

admin.site.register(models.Point)
admin.site.register(models.Help, HelpAdmin)
admin.site.register(models.Organization)
admin.site.register(models.HelpPhoto)