# Generated by Django 3.1.5 on 2021-01-29 02:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('info', '0001_initial'),
        ('maps', '0016_comment_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='help',
            name='organization',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='help_points', to='info.organization'),
        ),
        migrations.DeleteModel(
            name='Organization',
        ),
    ]
