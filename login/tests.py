from django.test import TestCase, Client
from django.contrib.auth import logout, authenticate, login

# Create your tests here.
from .models import User

class htmltest(TestCase):
    def test_login(self):
        c = Client()
        response = c.get('/login/')
        self.assertEqual(response.status_code, 200)

    def test_logout(self):
        c = Client()
        response = c.get('/login/logout')
        self.assertEqual(response.status_code, 301)


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
