# Generated by Django 3.1.5 on 2021-02-04 16:53

from django.db import migrations
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0026_auto_20210204_1151'),
    ]

    operations = [
        migrations.AlterField(
            model_name='help',
            name='sub_category',
            field=multiselectfield.db.fields.MultiSelectField(choices=[('DLchPol', 'Leche en Polvo'), ('DLchEnt', 'Leche Entera'), ('DAlNoPe', 'No perecederos'), ('DAlPere', 'Perecederos'), ('DBbPana', 'Pañales'), ('DBbOtro', 'Otros (Cunas, etc)'), ('DRpNino', 'Para Niños'), ('DRpJove', 'Para Jóvenes'), ('DRpAdul', 'Para Adultos'), ('DCnArti', 'Artículos de Cocina'), ('DCnElec', 'Electrodomésticos'), ('DClColc', 'Colchones'), ('DClFraz', 'Frazadas'), ('DClSaba', 'Sábanas'), ('DMuBiAr', 'Bibliotecas y Armarios'), ('DMuCaCt', 'Camas y Catres'), ('DMuMeSi', 'Mesas y Sillas'), ('DMuOtro', 'Otros Muebles'), ('DTcCamr', 'Camaras de fotos/videos'), ('DTcComp', 'Computadoras'), ('DTcImpr', 'Impresoras'), ('DTcOtro', 'Otra Tecnologia'), ('DRcDepo', 'Articulos Deportivos'), ('DRcMusi', 'Instrumentos Musicales'), ('DRcJugt', 'Juguetes'), ('DRcArte', 'Material Artisticos'), ('DLbEscl', 'Escolares'), ('DLbInft', 'Infantiles'), ('DLbOtro', 'Otros Libros'), ('DSlMedi', 'Medicamentos'), ('DSlPrim', 'Primeros Auxilios'), ('DSlSang', 'Sangre'), ('DSlOtro', 'Otros Equipos Medicos'), ('DOtLimp', 'Limpieza'), ('DOtCstr', 'Material de Construccion'), ('DOtPint', 'Pintura'), ('DOtPelo', 'Cabello'), ('DotOtro', 'Otro Otro')], max_length=7),
        ),
    ]
