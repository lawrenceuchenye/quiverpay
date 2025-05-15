from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Airtime,Data,Electricity,Transaction
from .serializers import AirtimeSerializer,DataSerializer,ElectricitySerializer

import json 
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
"success":False,
"data":[]
    })



@api_view(["POST"])
def getWalletAirtimeTx(request,*args,**kwargs):
    data=request.data
    airtime_txs=Airtime.objects.filter(issuedBy=data['walletAddr'])
    if(len(airtime_txs) > 0):
        return Response({ "success":True,"data":json.dumps(AirtimeSerializer(airtime_txs,many=True).data) })
    return Response({
"success":False,
"data":[]
    })


@api_view(["POST"])
def getWalletDataTx(request,*args,**kwargs):
    data=request.data
    data_txs=Data.objects.filter(issuedBy=data['walletAddr'])
    if(len(data_txs) > 0):
        return Response({ "success":True,"data":json.dumps(DataSerializer(data_txs,many=True).data) })
    return Response({
"success":False,
"data":[]
    })


@api_view(["POST"])
def getWalletElectricityTx(request,*args,**kwargs):
    data=request.data
    data_txs=Electricity.objects.filter(issuedBy=data['walletAddr'])
    if(len(data_txs) > 0):
        return Response({ "success":True,"data":json.dumps(ElectricitySerializer(data_txs,many=True).data) })
    return Response({
"success":False,
    })

@api_view(["GET"])
def getOpenTransactions(requet,*args,**kwargs):
    openAirtimeTxs=AirtimeSerializer(Airtime.objects.filter(isOpen=True).all(),many=True).data
    openDataTxs=DataSerializer(Data.objects.filter(isOpen=True).all(),many=True).data
    openElectricityTxs=ElectricitySerializer(Electricity.objects.filter(isOpen=True).all(),many=True).data
      
    return Response({
        "openTxs":[openAirtimeTxs,openDataTxs,openElectricityTxs],
        "totalOpenTxs":len(openAirtimeTxs)+len(openElectricityTxs)+len(openElectricityTxs)
    })








