from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='controlIndex'),
    path('api/places', views.places, name='apiPlaces'),
    path('report/', views.report_form, name='report')
]