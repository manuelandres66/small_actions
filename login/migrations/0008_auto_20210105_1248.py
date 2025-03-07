# Generated by Django 3.1.4 on 2021-01-05 17:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0007_auto_20210104_2022'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='latitude',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=8, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='longitude',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='random_string',
            field=models.CharField(blank=True, max_length=20, null=True, unique=True),
        ),
    ]
