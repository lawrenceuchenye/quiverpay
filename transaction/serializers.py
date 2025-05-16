from rest_framework import serializers
from .models import Airtime,Data,Electricity

class AirtimeSerializer(serializers.ModelSerializer):
    type=serializers.SerializerMethodField(read_only=True)

    class Meta:
        model=Airtime
        fields=["network","fiat_amount","usdc_amount","amount","type","issuedBy","orderId"]

    def get_type(self,obj):
        return "Airtime"


class DataSerializer(serializers.ModelSerializer):
    type=serializers.SerializerMethodField(read_only=True)

    class Meta:
        model=Data        
        fields=["network","fiat_amount","usdc_amount","amount","type","plan","issuedBy","orderId"]

      
    def get_type(self,obj):
        return "Data"
    

class ElectricitySerializer(serializers.ModelSerializer):
    type=serializers.SerializerMethodField(read_only=True)

    class Meta:
        model=Electricity
        fields=["fiat_amount","usdc_amount","amount","type","meter_owner","meter_number","issuedBy","orderId"]

    def get_type(self,obj):
        return "Electricity"