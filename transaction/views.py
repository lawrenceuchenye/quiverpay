from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Airtime,Data,Electricity,Transaction

from decimal import Decimal
# Create your views here.

@api_view(["POST"])
def createTx(request,*args,**kwargs):
    data=request.data
    if data["type"]=="Airtime":
        Airtime.objects.create(network=data["network"],fiat_amount=str(data["fiat_amount"]),usdc_amount=str(data["usdc_amount"]),issuedBy=data["issuer_address"],amount=int(data["amount"]),phone_number=data["phone_number"])
        return Response({ "success":True})
    
    if data["type"]=="Data":
        Data.objects.create(network=data["network"],plan=data["plan"],fiat_amount=str(data["fiat_amount"]),usdc_amount=str(data["usdc_amount"]),issuedBy=data["issuer_address"],amount=int(data["amount"]),phone_number=data["phone_number"])
        return Response({ "success":True})
    
    if data["type"]=="Electricity":
        Electricity.objects.create(provider=data["provider"],fiat_amount=str(data["fiat_amount"]),usdc_amount=str(data["usdc_amount"]),issuedBy=data["issuer_address"],amount=int(data["amount"]),meter_number=data["meter_number"],meter_owner=data["meter_owner"])
        return Response({ "success":True})
   
    return Response({
"success":True,
    })