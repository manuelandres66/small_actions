from django.test import TestCase, Client
from django.shortcuts import reverse

from maps.models import Organization
# Create your tests here.
class SimpleTest(TestCase):

    def test_become(self):
        c = Client()
        response = c.post(reverse('become'), {
            'name' : 'Small Actions',
            'phone_number' : '+573023986488',
            'contact_name' : 'Manuel',
            'contact_phone_number' : '+573023986488',
            'short_description' : 'Lorem Impsum',
            'quote' : 'Ser mas para servir mejor'
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(Organization.objects.all()), 1) #New Organization created


