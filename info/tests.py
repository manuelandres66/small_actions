from django.test import TestCase, Client
from django.shortcuts import reverse

from maps.models import Organization
from .forms import NewOrganization
# Create your tests here.


class InfoTest(TestCase):


    def test_become(self):
        c = Client()
        response = c.get(reverse('become'))

        self.assertEqual(response.status_code, 200)


        

