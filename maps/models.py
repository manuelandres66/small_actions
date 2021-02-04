from django.db import models
from shortuuidfield import ShortUUIDField
from multiselectfield import MultiSelectField

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
    categories = [
        #Donar
        ('DAl', 'Alimentos'),
        ('DBb', 'Artículos para Bebés'),
        ('DRp', 'Ropa'),
        ('DCn', 'Cocina'),
        ('DCl', 'Colchones y Frazadas'),
        ('DMu', 'Muebles'),
        ('DTc', 'Tecnología'),
        ('DRc', 'Recreación'),
        ('DLb', 'Libros'),
        ('DSl', 'Salud'),
        ('DOt', 'Otros'),

        #Voluntariado
        ('VNi', 'Ayuda con Niños'),
        ('VAd', 'Adultos Mayores'),
        ('VFa', 'Familia'),
        ('VCo', 'Comedores'),
        ('VEd', 'Educacion'),
        ('VSl', 'Salud'),
        ('VDs', 'Personas con Discapacidad'),
        ('VIn', 'Indigencia'),
        ('VRs', 'Reinserción Social'),
        ('VPr', 'Profesional'),
        ('VAm', 'Medio Ambiente'),
        ('VOt', 'Otros Voluntariados')

    ] 
    category = models.CharField(max_length=3, choices=categories, default='DAl')
    sub_categories = [
        #Donar

        #Alimentos
        ('DLchPol', 'Leche en Polvo'),
        ('DLchEnt', 'Leche Entera'),
        ('DAlNoPe', 'No perecederos'),
        ('DAlPere', 'Perecederos'),
        #Para bebes
        ('DBbPana', 'Pañales'),
        ('DBbOtro', 'Otros (Cunas, etc)'),
        #Ropa
        ('DRpNino', 'Para Niños'),
        ('DRpJove', 'Para Jóvenes'),
        ('DRpAdul', 'Para Adultos'),
        #Cocina
        ('DCnArti', 'Artículos de Cocina'),
        ('DCnElec', 'Electrodomésticos'),
        #Colchones y Frazadas
        ('DClColc', 'Colchones'),
        ('DClFraz', 'Frazadas'),
        ('DClSaba', 'Sábanas'),
        #Muebles
        ('DMuBiAr', 'Bibliotecas y Armarios'),
        ('DMuCaCt', 'Camas y Catres'),
        ('DMuMeSi', 'Mesas y Sillas'),
        ('DMuOtro', 'Otros Muebles'),
        #Tecnologia
        ('DTcCamr', 'Camaras de fotos/videos'),
        ('DTcComp', 'Computadoras'),
        ('DTcImpr', 'Impresoras'),
        ('DTcOtro', 'Otra Tecnologia'),
        #Recracion
        ('DRcDepo', 'Articulos Deportivos'),
        ('DRcMusi', "Instrumentos Musicales"),
        ('DRcJugt', 'Juguetes'),
        ('DRcArte', 'Material Artisticos'),
        #Libros,
        ('DLbEscl', "Escolares"),
        ('DLbInft', 'Infantiles'),
        ('DLbOtro', 'Otros Libros'),
        #Salud
        ('DSlMedi', 'Medicamentos'),
        ('DSlPrim', 'Primeros Auxilios'),
        ('DSlSang', 'Sangre'),
        ('DSlOtro', 'Otros Equipos Medicos'),
        #Otros
        ('DOtLimp', 'Limpieza'),
        ('DOtCstr', 'Material de Construccion'),
        ('DOtPint', 'Pintura'),
        ('DOtPelo', 'Cabello'),
        ('DotOtro', 'Otro Otro')
    ]
    sub_category = MultiSelectField(choices=sub_categories,
                                max_choices=6,
                                max_length=32)



    def __str__(self):
        return f"{self.organization}: {self.name}"
