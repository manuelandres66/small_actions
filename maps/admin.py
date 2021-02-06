from django.contrib import admin
from . import models
# Register your models here.

class HelpAdmin(admin.ModelAdmin):
    filter_horizontal = ("photos", "comments", "sub_category")

class CommentAdmin(admin.ModelAdmin):
    filter_horizontal = ("responses", )

class CategoryAdmin(admin.ModelAdmin):
    filter_horizontal = ('sub_categories',)

admin.site.register(models.Help, HelpAdmin)
admin.site.register(models.HelpPhoto)
admin.site.register(models.Comment, CommentAdmin)
admin.site.register(models.Category, CategoryAdmin)
admin.site.register(models.SubCategory)