from rest_framework import serializers
from .models import UserProfile
from datetime import datetime


def format_date(timestamp_str):
    # Parse the ISO format timestamp
    dt = datetime.fromisoformat(timestamp_str.rstrip('Z'))
    # Format it as D/M/YYYY
    return dt.strftime('%-d/%-m/%Y')  # For Unix/Linux


class UserProfileSerializer(serializers.ModelSerializer):
    reg_date=serializers.SerializerMethodField(read_only=True)

    class Meta:
        model=UserProfile
        fields=["walletaddress","role","reg_date"]


    def get_reg_date(self,obj):
        return obj.created_at.strftime('%-d/%-m/%Y')