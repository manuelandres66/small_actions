from django.db import models
from django.contrib.auth.models import User
import uuid
# Create your models here.

class Point(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="points")
    points = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}: {self.points} points"

class Organization(models.Model):
    name = models.CharField(max_length=20)
    image = models.ImageField(upload_to='maps/static/maps/images/organizations', null=True, blank=True)

    def __str__(self):
        return f"{self.name}"

class Help(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    latitude = models.DecimalField(max_digits=5, decimal_places=3)
    longitude = models.DecimalField(max_digits=5, decimal_places=3)
    name = models.CharField(max_length=20)
    short_description = models.TextField(max_length=900)
    recomedations = models.TextField(max_length=900, null=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="help_points")
    category = models.CharField(max_length=11)

    def __str__(self):
        return f"{self.organization}: {self.name}"
