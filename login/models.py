from django.db import models
from django.contrib.auth.models import AbstractUser

from maps.models import Help

class User(AbstractUser):
    points = models.PositiveIntegerField(default=0)
    photo = models.ImageField(upload_to="people", null=True, blank=True)
    latitude = models.DecimalField(max_digits=6, decimal_places=4, null=True, blank=True)
    longitude = models.DecimalField(max_digits=6, decimal_places=4, null=True, blank=True)
    visited = models.ManyToManyField(Help, related_name="persons_visited", null=True, blank=True)