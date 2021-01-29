# Generated by Django 3.1.5 on 2021-01-29 15:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0009_user_dark_mode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='latitude',
            field=models.DecimalField(blank=True, decimal_places=8, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='longitude',
            field=models.DecimalField(blank=True, decimal_places=8, max_digits=11, null=True),
        ),
    ]
