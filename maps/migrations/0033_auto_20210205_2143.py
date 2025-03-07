# Generated by Django 3.1.5 on 2021-02-06 02:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0032_auto_20210205_2135'),
    ]

    operations = [
        migrations.CreateModel(
            name='SubCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codigo', models.CharField(max_length=7, unique=True)),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.RemoveField(
            model_name='help',
            name='sub_category',
        ),
        migrations.AddField(
            model_name='help',
            name='sub_category',
            field=models.ManyToManyField(to='maps.SubCategory'),
        ),
    ]
