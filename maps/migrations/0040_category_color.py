# Generated by Django 3.1.5 on 2021-02-08 00:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0039_auto_20210206_1114'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='color',
            field=models.CharField(default='#FFFFFF', max_length=7),
        ),
    ]
