from django.db import models
from shortuuidfield import ShortUUIDField

from info.models import Organization
from login.models import User

# Create your models here.

class HelpPhoto(models.Model):
    photo = models.ImageField(upload_to="help", blank=True, null=True)

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    comment = models.CharField(max_length=250) 
    responses = models.ManyToManyField('self', blank=True)
    date = models.DateTimeField(auto_now_add=True)

class Help(models.Model):
    uuid = ShortUUIDField()
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    name = models.CharField(max_length=20)
    short_description = models.TextField(max_length=900)
    recomedations = models.TextField(max_length=900)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="help_points")
    category = models.CharField(max_length=11)
    photos = models.ManyToManyField(HelpPhoto)
    temporal_code = models.CharField(max_length=11)
    points_for_completed = models.PositiveIntegerField(default=10)
    comments = models.ManyToManyField(Comment, blank=True)


    def __str__(self):
        return f"{self.organization}: {self.name}"
