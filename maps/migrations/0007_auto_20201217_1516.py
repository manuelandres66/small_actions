# Generated by Django 3.1.4 on 2020-12-17 20:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0006_organization_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='help',
            name='description',
        ),
        migrations.AddField(
            model_name='help',
            name='recomedations',
            field=models.TextField(max_length=900, null=True),
        ),
        migrations.AlterField(
            model_name='organization',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='maps/static/maps/images/organizations'),
        ),
    ]
