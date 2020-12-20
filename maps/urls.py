from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),

    path('points/', views.points, name="SerchPoints"),
    path('points/info/<str:uuid>', views.info_point, name="info"),

    path('api/all_helps', views.all_helps, name="apiPHelps"),
    path('api/search_helps', views.search_helps, name="apiSearchHelps")
]