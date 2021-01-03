from django.test import TestCase, Client
from django.contrib.auth import logout, authenticate, login

from django.shortcuts import reverse
# Create your tests here.
from .models import User

import json

class htmltest(TestCase):
    def test_login(self):
        c = Client()
        response = c.get(reverse('login'))
        self.assertEqual(response.status_code, 200)

    def test_logout(self):
        c = Client()
        response = c.get(reverse('logout'))
        code = response.status_code == 301 or response.status_code == 302
        self.assertTrue(code)

    def test_register(self):
        c = Client()
        response = c.get(reverse('register'))
        self.assertEqual(response.status_code, 200)


class UserTest(TestCase):
    def setUp(self):
        self.pepe = User.objects.create_user(username="PEPE", password="hola1234")

    def test_login(self):
        c = Client()
        login = c.login(username="PEPE", password="hola1234")
        self.assertTrue(login)

    def test_change_password(self):
        user = User.objects.get(username="PEPE")
        user.set_password('hola12345')
        user.save()

        c = Client()
        login = c.login(username="PEPE", password="hola1234") #Not Old Password
        self.assertFalse(login)

        login = c.login(username="PEPE", password="hola12345")
        self.assertTrue(login)

    def test_ranking_new(self):
        c = Client()
        c.login(username="PEPE", password="hola1234")
        response = c.get(reverse('ranking'))
        self.assertEqual(response.status_code, 200)

    def test_account(self):
        c = Client()
        c.login(username="PEPE", password="hola1234")
        response = c.get(reverse('account'))
        self.assertEqual(response.status_code, 200)

class ApiTest(TestCase):
    def setUp(self):
        User.objects.create_user(username="PEPE", password="hola1234", points=0)
        User.objects.create_user(username="PEPE2", password="hola1234", points=1)
        User.objects.create_user(username="PEPE3", password="hola1234", points=2)
        User.objects.create_user(username="PEPE4", password="hola1234", points=3)
        User.objects.create_user(username="PEPE5", password="hola1234", points=4)
        User.objects.create_user(username="PEPE6", password="hola1234", points=5)

    def test_api(self):
        c = Client()
        response = c.post(reverse('RankingAPI'), {'start' : 1, 'end' : 3}, content_type="application/json")
        data = json.loads(response.content)

        self.assertEqual(data['people'], [
            {
                'ranking' : 1,
                'username' : "PEPE6",
                'points' : 5
            },
            {
                'ranking' : 2,
                'username' : "PEPE5",
                'points' : 4
            },
            {
                'ranking' : 3,
                'username' : "PEPE4",
                'points' : 3
            }
        ])

