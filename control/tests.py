from django.test import TestCase, Client
from django.shortcuts import reverse

from login.models import User
from .models import Report

# Create your tests here.

class ControlTest(TestCase):
    def test_report(self):
        User.objects.create_user(username="PEPE", password="hola1234", email='pepeemail@gmail.com')

        c = Client()
        c.login(username="PEPE", password="hola1234")
        response = c.get(reverse('report'))
        self.assertEqual(response.status_code, 200)

        response = c.post(reverse('report'), {'organization_or_user' : 'O', 
        'name_of_reported' : 'Small Actions', 'category_of_problem' : 'IfEn',
        'decription_of_the_problem' : 'I dont like them :('})

        self.assertEqual(len(Report.objects.all()), 1)

