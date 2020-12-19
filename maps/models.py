from django.db import models
from django.contrib.auth.models import User
from shortuuidfield import ShortUUIDField

# Create your models here.

class Point(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="points")
    points = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}: {self.points} points"

class Organization(models.Model):
    name = models.CharField(max_length=20)
    image = models.ImageField(upload_to="organizations", blank=True, null=True)
    circular_icon = models.ImageField(upload_to="organizations/circle", blank=True, null=True)
    short_description = models.TextField(max_length=300)
    quote = models.CharField(max_length=60)

    def __str__(self):
        return f"{self.name}"

class HelpPhoto(models.Model):
    photo = models.ImageField(upload_to="help", blank=True, null=True)

class Help(models.Model):
    uuid = ShortUUIDField()
    latitude = models.DecimalField(max_digits=5, decimal_places=3)
    longitude = models.DecimalField(max_digits=5, decimal_places=3)
    name = models.CharField(max_length=20)
    short_description = models.TextField(max_length=900)
    recomedations = models.TextField(max_length=900)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="help_points")
    category = models.CharField(max_length=11)
    photos = models.ManyToManyField(HelpPhoto)

    def __str__(self):
        return f"{self.organization}: {self.name}"
