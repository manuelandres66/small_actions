# Generated by Django 3.1.5 on 2021-02-27 15:17

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0040_category_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='help',
            name='data_created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
