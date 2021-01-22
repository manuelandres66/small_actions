from django.test import TestCase, Client
from django.shortcuts import reverse
from django.core.files.uploadedfile import SimpleUploadedFile

from maps.models import Organization
from .forms import NewOrganization

import json
# Create your tests here.

small_gif = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x05\x04\x04\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'

class InfoTest(TestCase):

    def test_become(self):
        c = Client()
        response = c.get(reverse('become'))

        self.assertEqual(response.status_code, 200)


class OrgTest(TestCase):

    def setUp(self):
        uploaded = SimpleUploadedFile('test.gif', small_gif, content_type='image/gif')
        Organization.objects.create(name="Manuels Organization", 
                short_description="Lorem ipsum dolor sit amet consectetur adipiscing elit placerat",
                quote="Hello My Friends",
                circular_icon = uploaded,
                image = uploaded)

        Organization.objects.create(name="Manuels test Organization", 
                short_description="Lorem ipsum dolor sit amet consectetur adipiscing elit placerat",
                quote="Hello My Friends",
                circular_icon = uploaded,
                image = uploaded)

    def test_org(self):
        c = Client()
        response = c.get(reverse('searchOrganization'))
        self.assertEqual(response.status_code, 200)

    def test_apiorg(self):
        c = Client()
        response = c.post(reverse('apiSearchOrg'), {'search' : 'M'}, content_type="application/json")
        data = json.loads(response.content)
        self.assertEqual(data['results'], [
            {
                'name' : 'Manuels Organization',
                'number_points': 0,
                'url' : '/'
            }, 
            {
                'name' : 'Manuels test Organization',
                'number_points': 0,
                'url' : '/'
            }
        ])



        

