from django.urls import path
from . import views

urlpatterns = [
    path('organizations', views.search, name='searchOrganization'),
    path('become', views.become, name='become'),

    path('api/organizations', views.api_search, name='apiSearchOrg')
]