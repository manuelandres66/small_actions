# Generated by Django 3.1.4 on 2020-12-18 01:51

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0007_auto_20201217_1516'),
    ]

    operations = [
        migrations.AlterField(
            model_name='help',
            name='id',
            field=models.UUIDField(default=uuid.uuid1, editable=False, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='help',
            name='recomedations',
            field=models.TextField(blank=True, max_length=900, null=True),
        ),
    ]
