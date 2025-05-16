from django.db import models

# Create your models here.

class Airtime(models.Model):
    network=models.CharField(max_length=255)
    fiat_amount=models.CharField(max_length=100)
    usdc_amount=models.CharField(max_length=100)
    phone_number=models.CharField(max_length=255,null=True)
    amount=models.IntegerField()
    issuedBy=models.CharField(max_length=255)
    settledBy=models.CharField(max_length=255,blank=True)
    isOpen=models.BooleanField(default=True)
    orderId=models.IntegerField(default=0)

class Data(models.Model):
    network=models.CharField(max_length=255)
    plan=models.CharField(max_length=255)
    phone_number=models.CharField(max_length=255)
    fiat_amount=models.CharField(max_length=100)
    usdc_amount=models.CharField(max_length=100)
    amount=models.IntegerField()
    issuedBy=models.CharField(max_length=255)
    settledBy=models.CharField(max_length=255,null=True,blank=True)
    isOpen=models.BooleanField(default=True)
    orderId=models.IntegerField(default=0)


class Electricity(models.Model):
    provider=models.CharField(max_length=255)
    meter_number=models.CharField(max_length=255)
    meter_owner=models.CharField(max_length=255)
    fiat_amount=models.CharField(max_length=100)
    usdc_amount=models.CharField(max_length=100)
    amount=models.IntegerField()
    issuedBy=models.CharField(max_length=255)
    settledBy=models.CharField(max_length=255,null=True,blank=True)
    isOpen=models.BooleanField(default=True)
    orderId=models.IntegerField(default=0)


class Transaction(models.Model):
    issuedByAddr=models.CharField(max_length=255)
    handledByAddr=models.CharField(max_length=255)
    type=models.CharField(max_length=255)
    handled_at=models.DateTimeField(auto_now_add=True)