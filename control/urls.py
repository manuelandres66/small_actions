from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='controlIndex'),
    path('api/places', views.places, name='apiPlaces'),
    path('api/delete', views.delete_place, name='apiDelete'),
    path('report/', views.report_form, name='report')
]