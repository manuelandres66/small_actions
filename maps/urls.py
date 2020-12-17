from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('api/all_helps', views.all_helps, name="apiPHelps")
]