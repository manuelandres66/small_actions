from django.db import models
from django.core.validators import RegexValidator
from shortuuidfield import ShortUUIDField

# Create your models here.

class Organization(models.Model):
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")

    name = models.CharField(max_length=20, unique=True)
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)

    contact_name = models.CharField(max_length=30, blank=True)
    contact_phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)

    image = models.ImageField(upload_to="organizations", blank=True, null=True)
    circular_icon = models.ImageField(upload_to="organizations/circle", blank=True, null=True)
    short_description = models.TextField(max_length=300)
    quote = models.CharField(max_length=60) 

    user = models.OneToOneField('login.User', blank=True, null=True, on_delete=models.PROTECT)
    
    def __str__(self):
        return f"{self.name}"

class HelpPhoto(models.Model):
    photo = models.ImageField(upload_to="help", blank=True, null=True)

class Help(models.Model):
    uuid = ShortUUIDField()
    latitude = models.DecimalField(max_digits=8, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    name = models.CharField(max_length=20)
    short_description = models.TextField(max_length=900)
    recomedations = models.TextField(max_length=900)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="help_points")
    category = models.CharField(max_length=11)
    photos = models.ManyToManyField(HelpPhoto)
    temporal_code = models.CharField(max_length=11)
    points_for_completed = models.PositiveIntegerField(default=10)


    def __str__(self):
        return f"{self.organization}: {self.name}"
