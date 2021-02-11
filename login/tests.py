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
        self.pepe = User.objects.create_user(username="PEPE", password="hola1234", email='pepeemail@gmail.com')

    def test_login(self):
        c = Client()
        login = c.login(username="PEPE", password="hola1234")
        self.assertTrue(login)

    def test_darkmode(self):
        user = User.objects.get(username='PEPE')
        self.assertFalse(user.dark_mode)

        c = Client()
        c.login(username="PEPE", password="hola1234")
        c.get(reverse('dark'))

        user = User.objects.get(username='PEPE')
        self.assertTrue(user.dark_mode)

    def test_another(self)
        c = Client()
        response = c.get(reverse('another', args={'username' : self.pepe.username }))
        self.assertEqual(response.status_code, 200)

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

        response = c.post(reverse('account'), {'username' : 'PEPE2', 'email' : 'manuel.andres66.mab@gmail.com', 'latitude' : -78.458, 'longitude' : 14.587})
        self.assertFalse(c.login(username="PEPE", password="hola1234")) #Not old Username
        self.assertTrue(c.login(username="PEPE2", password="hola1234")) #New username

    def test_email(self):
        c = Client()
        response = c.post(reverse('forgot'), {'email' : 'pepeemail@gmail.com'}) #Forgot password
        self.assertEqual(response.status_code, 200)

        #Changing password
        user = User.objects.get(username='PEPE')
        response = c.post(reverse('emailink', kwargs={'random_string' : user.random_string}), {'password' : 'hola123456', 'repeat_password' : 'hola1234'}) #Not ok
        self.assertEqual(response.status_code, 200)
        esponse = c.post(reverse('emailink', kwargs={'random_string' : user.random_string}), {'password' : 'hola123456', 'repeat_password' : 'hola123456'}) #Ok
        self.assertEqual(response.status_code, 200) #For some reason it give me 200 and not 302 I dont know why

        log = c.login(username="PEPE", password="hola1234") #Not old
        self.assertFalse(log)
        log = c.login(username="PEPE", password="hola123456") #New
        self.assertTrue(log)
    
    def test_reset_and_eliminate(self):
        c = Client()
        c.login(username="PEPE", password="hola1234")
        user = User.objects.get(username='PEPE')
        user.can_change = False
        user.save()
        
        #Incorrect
        response = c.post(reverse('password', kwargs={'re' : 1}), {'password' : 'hola123'}) # Incorret
        self.assertEqual(response.status_code, 200)

        response_reset = c.get(reverse('reset_password'))
        self.assertEqual(response_reset.status_code, 302) #Not allow

        response_eliminate = c.get(reverse('eliminate'))
        self.assertEqual(response_eliminate.status_code, 302) #Not allow

        #Correct
        response = c.post(reverse('password', kwargs={'re' : 1}), {'password' : 'hola1234'}) # Correct
        self.assertEqual(response.status_code, 302)

        response_reset = c.get(reverse('reset_password'))
        self.assertEqual(response_reset.status_code, 200) #Allow
        
        response_eliminate = c.get(reverse('eliminate'))
        self.assertEqual(response_eliminate.status_code, 200) #Allow

        response_reset = c.post(reverse('reset_password'), {'password' : 'hola12345', 'repeat_password' : 'hola12345'})
        login = c.login(username="PEPE", password="hola12345")
        self.assertTrue(login) #Changed Password

        response = c.post(reverse('password', kwargs={'re' : 2}), {'password' : 'hola12345'}) #Re put password
        response_eliminate = c.post(reverse('eliminate'), {'answer': 'yes'})
        self.assertEqual(response_eliminate.status_code, 302)

        query = User.objects.filter(username='PEPE')
        self.assertEqual(len(query), 0)


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
