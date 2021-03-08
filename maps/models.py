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


class SubCategory(models.Model):
    code = models.CharField(max_length=7, unique=True)
    name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.code} ({self.name})"

class Category(models.Model):
    code = models.CharField(max_length=3, unique=True)
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default='#FFFFFF')
    sub_categories = models.ManyToManyField(SubCategory, blank=True)

    def __str__(self):
        return f"{self.code} ({self.name})"
    

class Help(models.Model):
    uuid = ShortUUIDField()
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    name = models.CharField(max_length=20)
    short_description = models.TextField(max_length=900)
    recomedations = models.TextField(max_length=900)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="help_points")
    data_created = models.DateTimeField(auto_now_add=True)
    views = models.PositiveIntegerField(default=0)

    photos = models.ManyToManyField(HelpPhoto)
    temporal_code = models.CharField(max_length=11)
    points_for_completed = models.PositiveIntegerField(default=10)
    comments = models.ManyToManyField(Comment, blank=True)


    #Categories
    mayor_categories = [
        ('D', 'Donar'),
        ('V', 'Voluntariado')
    ]
    mayor_category = models.CharField(max_length=1, choices=mayor_categories, default='D')
    category = models.ForeignKey(Category, on_delete=models.RESTRICT, related_name='helps')
    sub_category = models.ManyToManyField(SubCategory, related_name='helps')

    def __str__(self):
        return f"{self.organization}: {self.name}"
