from django.contrib import admin

from .models import User

class UserAdmin(admin.ModelAdmin):
    filter_horizontal = ("visited","groups")


admin.site.register(User, UserAdmin)