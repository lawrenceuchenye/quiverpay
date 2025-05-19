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
    airtime_order = Airtime.objects.last()
    data_order = Data.objects.last()
    electricity_order = Electricity.objects.last()

    print(airtime_order,data_order,electricity_order)

    order_ids = []

    if airtime_order != None:
        order_ids.append(airtime_order.orderId)
    if data_order != None:
        order_ids.append(data_order.orderId)
    if electricity_order != None:
        order_ids.append(electricity_order.orderId)

    totalIds = max(order_ids) if len(order_ids) > 0 else -1
    data=request.data
    if data["type"]=="Airtime":
        Airtime.objects.create(network=data["network"],fiat_amount=str(data["fiat_amount"]),usdc_amount=str(data["usdc_amount"]),issuedBy=data["issuer_address"],amount=int(data["amount"]),phone_number=data["phone_number"],orderId=totalIds+1)
        return Response({ "success":True,"orderId":totalIds+1})
    
    if data["type"]=="Data":
        Data.objects.create(network=data["network"],plan=data["plan"],fiat_amount=str(data["fiat_amount"]),usdc_amount=str(data["usdc_amount"]),issuedBy=data["issuer_address"],amount=int(data["amount"]),phone_number=data["phone_number"],orderId=totalIds+1)
        return Response({ "success":True,"orderId":totalIds+1})
    
    if data["type"]=="Electricity":
        Electricity.objects.create(provider=data["provider"],fiat_amount=str(data["fiat_amount"]),usdc_amount=str(data["usdc_amount"]),issuedBy=data["issuer_address"],amount=int(data["amount"]),meter_number=data["meter_number"],meter_owner=data["meter_owner"],orderId=totalIds+1)
        return Response({ "success":True,"orderId":totalIds+1})
   
    return Response({
"success":False,
"data":[],
    })



@api_view(["POST"])
def getWalletAirtimeTx(request,*args,**kwargs):
    data=request.data
    print(data)
    airtime_txs=Airtime.objects.filter(issuedBy=data['walletAddr'])
    print(AirtimeSerializer(airtime_txs,many=True).data)
    if(len(airtime_txs) > 0):
        return Response({ "success":True,"data":AirtimeSerializer(airtime_txs,many=True).data })
    return Response({
"success":False,
"data":[]
    })


@api_view(["POST"])
def getWalletDataTx(request,*args,**kwargs):
    data=request.data
    data_txs=Data.objects.filter(issuedBy=data['walletAddr'])
    if(len(data_txs) > 0):
        return Response({ "success":True,"data":DataSerializer(data_txs,many=True).data })
    return Response({
"success":False,
"data":[]
    })


@api_view(["POST"])
def getWalletElectricityTx(request,*args,**kwargs):
    data=request.data
    data_txs=Electricity.objects.filter(issuedBy=data['walletAddr'])
    if(len(data_txs) > 0):
        return Response({ "success":True,"data":ElectricitySerializer(data_txs,many=True).data })
    return Response({
"success":False,
"data":[]
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




@api_view(["POST"])
def closeTx(request,*args,**kwargs):
    data=request.data
    print(data)
    if data["type"]=="Airtime":
        obj=Airtime.objects.get(orderId=data["id"])
        if data["isRefund"]:
            obj.isReFund=True
        if data["isFulfilled"]:
            obj.isFulFilled=True
        obj.isOpen=False
        obj.save()
        return Response({ "success":True})
    
    if data["type"]=="Data":
        obj=Data.objects.get(orderId=data["id"])
        if data["isRefund"]:
            obj.isReFund=True
        if data["isFulfilled"]:
            obj.isFulFilled=True
        obj.isOpen=False
        obj.save()
        return Response({ "success":True})
    
    if data["type"]=="Electricity":
        obj=Electricity.objects.get(orderId=data["id"])
        if data["isRefund"]:
            obj.isReFund=True
        if data["isFulfilled"]:
            obj.isFulFilled=True
        obj.isOpen=False
        obj.token=data["token"]
        obj.save()
        return Response({ "success":True})
   
    return Response({
"success":False
    })



@api_view(["POST"])
def getTxState(request,*args,**kwargs):
    data=request.data
    print(data)
    if data["type"]=="Airtime":
        obj=Airtime.objects.get(orderId=data["id"])
        print({ "success":True,"isFulFilled":obj.isFulFilled,"isRefund":obj.isReFund})
        return Response({ "success":True,"isFulFilled":obj.isFulFilled,"isRefund":obj.isReFund})
    
    if data["type"]=="Data":
        obj=Data.objects.get(orderId=data["id"])
        return Response({ "success":True,"isFulFilled":obj.isFulFilled,"isRefund":obj.isReFund})
    
    if data["type"]=="Electricity":
        obj=Electricity.objects.get(orderId=data["id"])
        return Response({ "success":True,"isFulFilled":obj.isFulFilled,"isRefund":obj.isReFund,"token":obj.token})
    
   
    return Response({
"success":False
    })



