# Generated by Django 3.1.5 on 2021-03-10 15:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('info', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='InstagramPublication',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField()),
            ],
        ),
        migrations.AddField(
            model_name='organization',
            name='instagram_photos',
            field=models.ManyToManyField(to='info.InstagramPublication'),
        ),
    ]
