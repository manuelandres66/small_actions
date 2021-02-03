from django.urls import path
from . import views

urlpatterns = [
    path('organizations', views.search, name='searchOrganization'),
    path('become', views.become, name='become'),
    path('organization/<int:pk>', views.organization, name='org'),
    path('categories/', views.choose_category, name='choose'),

    path('api/organizations', views.api_search, name='apiSearchOrg'),
    path('api/orgpoints', views.api_org, name='apiHelpOrg')
]