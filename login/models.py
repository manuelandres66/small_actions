from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser): 
    points = models.PositiveIntegerField(default=0)
    photo = models.ImageField(upload_to="people", null=True, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    # visited = models.ManyToManyField('maps.Help', related_name="persons_visited", null=True, blank=True)
    can_change = models.BooleanField(null=True, blank=True) #Security
    dark_mode = models.BooleanField(default=False)
    #Forgot password
    date_forgot = models.DateTimeField(auto_now_add=True)
    random_string = models.CharField(max_length=20, blank=True, null=True, unique=True)

    def get_ranking(self):
        return list(User.objects.all().order_by('-points')).index(User.objects.get(username=self.username))