# Generated by Django 3.1.5 on 2021-02-04 16:51

from django.db import migrations, models
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0025_auto_20210203_1039'),
    ]

    operations = [
        migrations.RenameField(
            model_name='help',
            old_name='style',
            new_name='mayor_category',
        ),
        migrations.AddField(
            model_name='help',
            name='sub_category',
            field=multiselectfield.db.fields.MultiSelectField(choices=[('DAl', 'Alimentos'), ('DBb', 'Atículos para Bebés'), ('DRp', 'Ropa'), ('DCn', 'Cocina'), ('DCl', 'Colchones y Frazadas'), ('DMu', 'Muebles'), ('DTc', 'Tecnología'), ('DRc', 'Recreación'), ('DLb', 'Libros'), ('DSl', 'Salud'), ('DOt', 'Otros'), ('VNi', 'Ayuda con Niños'), ('VAd', 'Adultos Mayores'), ('VFa', 'Familia'), ('VCo', 'Comedores'), ('VEd', 'Educacion'), ('VSl', 'Salud'), ('VDs', 'Personas con Discapacidad'), ('VIn', 'Indigencia'), ('VRs', 'Reinserción Social'), ('VPr', 'Profesional'), ('VAm', 'Medio Ambiente'), ('VOt', 'Otros Voluntariados')], default='DLchPol', max_length=7),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='help',
            name='category',
            field=models.CharField(choices=[('DAl', 'Alimentos'), ('DBb', 'Atículos para Bebés'), ('DRp', 'Ropa'), ('DCn', 'Cocina'), ('DCl', 'Colchones y Frazadas'), ('DMu', 'Muebles'), ('DTc', 'Tecnología'), ('DRc', 'Recreación'), ('DLb', 'Libros'), ('DSl', 'Salud'), ('DOt', 'Otros'), ('VNi', 'Ayuda con Niños'), ('VAd', 'Adultos Mayores'), ('VFa', 'Familia'), ('VCo', 'Comedores'), ('VEd', 'Educacion'), ('VSl', 'Salud'), ('VDs', 'Personas con Discapacidad'), ('VIn', 'Indigencia'), ('VRs', 'Reinserción Social'), ('VPr', 'Profesional'), ('VAm', 'Medio Ambiente'), ('VOt', 'Otros Voluntariados')], default='DAl', max_length=3),
        ),
        migrations.AlterField(
            model_name='help',
            name='name',
            field=models.CharField(max_length=20),
        ),
    ]
