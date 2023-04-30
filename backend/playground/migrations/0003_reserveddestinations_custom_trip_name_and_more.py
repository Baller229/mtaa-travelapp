# Generated by Django 4.1.7 on 2023-03-30 13:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0002_destinations_review_reserveddestinations_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='reserveddestinations',
            name='custom_trip_name',
            field=models.CharField(default='trip', max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='reserveddestinations',
            name='trip',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='playground.destinations'),
        ),
        migrations.AlterField(
            model_name='reserveddestinations',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
    ]