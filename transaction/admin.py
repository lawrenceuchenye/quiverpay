from django.contrib import admin
from .models import Airtime,Data,Electricity,Transaction

# Register your models here.
admin.site.register(Airtime)
admin.site.register(Data)
admin.site.register(Electricity)
admin.site.register(Transaction)
