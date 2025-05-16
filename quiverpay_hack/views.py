from django.shortcuts import render
import os
from django.conf import settings
from django.views.generic import View
from django.http import HttpResponse

def SPA_view(request):
    return render(request,"index.html")


class ReactAppView(View):
    def get(self, request):
        try:
            with open(os.path.join(settings.BASE_DIR, 'quiverpay', 'dist', 'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse("Build not found. Please run npm run build.", status=501)