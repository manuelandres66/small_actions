from django.db import models
from django.contrib.auth.models import AbstractUser

from maps.models import Help

class User(AbstractUser):
    points = models.PositiveIntegerField(default=0)
    photo = models.ImageField(upload_to="people", null=True, blank=True)
    latitude = models.DecimalField(max_digits=8, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    visited = models.ManyToManyField(Help, related_name="persons_visited", null=True, blank=True)
    can_change = models.BooleanField(null=True, blank=True) #Security
    dark_mode = models.BooleanField(default=False)
    #Forgot password
    date_forgot = models.DateTimeField(auto_now_add=True)
    random_string = models.CharField(max_length=20, blank=True, null=True, unique=True)

    def get_ranking(self):
        return list(User.objects.all().order_by('-points')).index(User.objects.get(username=self.username))