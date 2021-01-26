from django.contrib import admin
from . import models
# Register your models here.

class HelpAdmin(admin.ModelAdmin):
    filter_horizontal = ("photos", "comments")

admin.site.register(models.Help, HelpAdmin)
admin.site.register(models.Organization)
admin.site.register(models.HelpPhoto)
admin.site.register(models.Comment)