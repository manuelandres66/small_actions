from django.urls import path
from . import views

urlpatterns = [
    path('become', views.become, name='become')
]