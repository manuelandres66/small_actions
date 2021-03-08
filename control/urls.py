from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='controlIndex'),
    path('api/places', views.places, name='apiPlaces'),
    path('api/delete', views.delete_place, name='apiDelete'),
    path('api/uploadphoto', views.upload_image, name='apiUpload'),
    path('api/deletephoto', views.delete_image, name="apiDeletePhoto"),
    path('api/uploadplace', views.upload_place, name='apiUploadPlace'),
    path('api/editplace', views.edit_place, name="apiEditPlace"),
    path('api/code', views.get_code, name='apiCode'),
    path('api/checknotify', views.check_notification, name='apiCheckNotify'),
    path('api/ban', views.ban, name="apiBan"),
    path('api/edit', views.to_edit, name="apiEdit"),
    path('report/', views.report_form, name='report'),
    path('photo', views.show_photo, name="showPhoto")
]