from django.urls import path
from . import views

urlpatterns = [
    path('', views.entry, name="login"),
    path('logout/', views.out, name="logout")
]