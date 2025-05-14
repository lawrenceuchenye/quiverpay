

from django.urls import path
from .views import createTx

urlpatterns = [
    path("create_tx/",createTx)
]
