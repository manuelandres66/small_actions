# Generated by Django 3.1.4 on 2020-12-17 17:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0003_auto_20201216_1752'),
    ]

    operations = [
        migrations.AlterField(
            model_name='help',
            name='name',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='organization',
            name='name',
            field=models.CharField(max_length=20),
        ),
    ]
