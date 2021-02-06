from django.contrib import admin
from . import models
# Register your models here.

class HelpAdmin(admin.ModelAdmin):
    filter_horizontal = ("photos", "comments")

class CommentAdmin(admin.ModelAdmin):
    filter_horizontal = ("responses", )

admin.site.register(models.Help, HelpAdmin)
admin.site.register(models.HelpPhoto)
admin.site.register(models.Comment, CommentAdmin)
admin.site.register(models.SubCategory)