from django.db import models
from login.models import User
from django.core.validators import RegexValidator


# Create your models here.
class InstagramPublication (models.Model):
    url = models.URLField()

class Organization(models.Model):
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="El numero de telefono debe tener el codigo del pais. Ej: +573023986488. 15 Digitos permitidos")

    name = models.CharField(max_length=20, unique=True)
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)

    contact_name = models.CharField(max_length=30, blank=True)
    contact_phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)

    image = models.ImageField(upload_to="organizations", blank=True, null=True)
    circular_icon = models.ImageField(upload_to="organizations/circle", blank=True, null=True)
    short_description = models.TextField(max_length=300) 
    quote = models.CharField(max_length=60) 

    user = models.OneToOneField(User, blank=True, null=True, on_delete=models.PROTECT, related_name='organization')
    instagram_photos = models.ManyToManyField(InstagramPublication)

    see = models.BooleanField()
    
    def __str__(self):
        return f"{self.name}"

    def get_points(self):
        return len(self.help_points.all())