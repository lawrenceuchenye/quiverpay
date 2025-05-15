

from django.urls import path
from .views import createTx,getWalletAirtimeTx,getWalletDataTx,getWalletElectricityTx,getOpenTransactions

urlpatterns = [
    path("create_tx/",createTx),
    path("wallet_airtime_tx/",getWalletAirtimeTx),
    path("wallet_data_tx/",getWalletDataTx),
    path("wallet_electricity_tx/",getWalletElectricityTx),
    path("get_open_txs/",getOpenTransactions)
]
