

from django.urls import path
from .views import  RegisterUserWallet

urlpatterns = [
    path("create_user/",RegisterUserWallet)
]
