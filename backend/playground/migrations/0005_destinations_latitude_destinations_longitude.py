# Generated by Django 4.1.7 on 2023-04-21 13:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0004_destinationimages'),
    ]

    operations = [
        migrations.AddField(
            model_name='destinations',
            name='latitude',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name='destinations',
            name='longitude',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True),
        ),
    ]
