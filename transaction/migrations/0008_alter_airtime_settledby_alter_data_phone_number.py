# Generated by Django 4.2.11 on 2025-05-14 01:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transaction', '0007_alter_airtime_fiat_amount_alter_airtime_usdc_amount_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='airtime',
            name='settledBy',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='data',
            name='phone_number',
            field=models.CharField(max_length=255),
        ),
    ]
