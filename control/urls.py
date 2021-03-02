from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='controlIndex'),
    path('api/places', views.places, name='apiPlaces'),
    path('api/delete', views.delete_place, name='apiDelete'),
    path('api/uploadphoto', views.upload_image, name='apiUpload'),
    path('api/uploadplace', views.upload_place, name='apiUploadPlace'),
    path('report/', views.report_form, name='report')
]