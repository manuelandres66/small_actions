from django.urls import path
from . import views

urlpatterns = [
    path('organizations', views.search, name='searchOrganization'),
    path('become', views.become, name='become'),
    path('about_us', views.about_us, name="aboutus"),
    path('terms_and_conditions', views.terms, name="terms"),
    path('organization/<int:pk>', views.organization, name='org'),
    path('categories/', views.choose_category, name='choose'),
    path('categories/<str:category>', views.category, name='category'),

    path('api/organizations', views.api_search, name='apiSearchOrg'),
    path('api/orgpoints', views.api_org, name='apiHelpOrg'),
    path('api/category', views.api_category, name='apiCategory')
]