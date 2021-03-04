from django.db import models

from login.models import User
from maps.models import Help

# Create your models here.

class Report(models.Model):
    user_that_report = models.ForeignKey(User, on_delete=models.CASCADE)

    organization_or_user_options = [
        ('U', 'Usuario'),
        ('O', 'Organización')
    ]
    organization_or_user = models.CharField(max_length=1, choices=organization_or_user_options)
    name_of_reported = models.CharField(max_length=64)

    categories_options = [
        ('IfEn', 'Informacion Engañosa'),
        ('MaCa', 'Mal Categorizado'),
        ('CoSe', 'Contenido Sexual'),
        ('CoOf', 'Contenido Ofensivo'),
        ('CoPo', 'Contenido Politico'),
        ('AcIl', 'Actividades Ilegales'),
        ('Ment', 'Mentiras'),
        ('MaUb', 'Mala Ubicacion'),
        ('MaCo', 'No dan codigo'),
        ('Bane', 'Me bannearon sin motivo'),
        ('MaIn', 'Falta de informacion o informacion no clara'),
        ('Otro', 'Otro Motivo'),
    ]

    category_of_problem = models.CharField(max_length=4, choices=categories_options)
    decription_of_the_problem = models.TextField()

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    help_point = models.ForeignKey(Help, on_delete=models.CASCADE)
    aproved = models.BooleanField()
