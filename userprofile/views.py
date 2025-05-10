from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import UserProfile
from .serializers import UserProfileSerializer
from rest_framework.response import Response
from .models import Role,UserProfile
# Create your views here.


@api_view(["POST"])
def RegisterUserWallet(request,*args,**kwargs):
    data=request.data
    is_exists=UserProfile.objects.filter(walletaddress=data["walletAddr"])

    if len(is_exists)==1:
         print()
         return Response({
"success":True,"user_data":UserProfileSerializer(is_exists[0]).data,
    })
    user=UserProfile.objects.create(walletaddress=data["walletAddr"],role_id=0 if data["role"]=="REG-USER" else 1)
    return Response({
"success":True,"user_type":UserProfileSerializer(user).data
    })

    