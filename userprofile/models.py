from django.db import models

# Create your models here.

class Role(models.Model):
    title=models.CharField(max_length=255)

    def __str__(self):
        return self.title


class UserProfile(models.Model):
    walletaddress=models.CharField(max_length=42)
    role=models.ForeignKey(Role, on_delete=models.CASCADE)
    created_at=models.DateTimeField(auto_now_add=True)

  
