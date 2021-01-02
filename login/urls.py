from django.urls import path
from . import views

urlpatterns = [
    path('', views.account, name='account'),
    path('login', views.entry, name="login"),
    path('logout', views.out, name="logout"),
    path('register', views.register, name="register"),
    path('ranking', views.ranking, name="ranking"),
    path('api/ranking', views.ranking_api, name="RankingAPI")
] 