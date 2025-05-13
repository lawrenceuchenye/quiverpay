from django.db import models

# Create your models here.
class Type(models.Model):
    title=models.CharField(max_length=255)

    def __str__(self):
        return self.title
    

class Transaction(models.Model):
    type=models.ForeignKey(Type,on_delete=models.CASCADE)
    author=models.CharField(max_length=255)
    settledBy=models.CharField(max_length=255,null=True)
    amount_usdc=models.DecimalField(decimal_places=3,max_digits=20)
    amount_fiat=models.DecimalField(decimal_places=3,max_digits=20)
    isClaimed=models.BooleanField(default=False)

    def __str__(self):
        return self.type

    