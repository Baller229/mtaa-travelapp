# Generated by Django 4.1.7 on 2023-04-16 07:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0003_reserveddestinations_custom_trip_name_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='DestinationImages',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('trip_image', models.ImageField(upload_to='destination_images/')),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='playground.destinations')),
            ],
        ),
    ]
