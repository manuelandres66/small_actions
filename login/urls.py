from django.urls import path
from . import views

urlpatterns = [
    path('', views.account, name='account'),
    path('login', views.entry, name="login"),
    path('logout', views.out, name="logout"),
    path('register', views.register, name="register"),
    path('ranking', views.ranking, name="ranking"),

    path('password/<int:re>', views.repassword, name='password'),
    path('password/reset/', views.reset_password, name='reset_password'),
    path('password/eliminate', views.eliminate, name='eliminate'),

    path('api/ranking', views.ranking_api, name="RankingAPI"),
] 