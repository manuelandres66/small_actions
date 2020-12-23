from django.contrib import admin

from .models import User

class UserAdmin(admin.ModelAdmin):
    filter_horizontal = ("visited",)


admin.site.register(User, UserAdmin)