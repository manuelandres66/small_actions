# Generated by Django 3.1.4 on 2021-01-06 23:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0008_auto_20210105_1248'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='dark_mode',
            field=models.BooleanField(default=False),
        ),
    ]
