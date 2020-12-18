from django.test import TestCase, Client

from . import models

import json
# Create your tests here.

class htmltest(TestCase):
    def test_index(self):
        c = Client()
        response = c.get('/')
        self.assertEqual(response.status_code, 200)

class apitest(TestCase):

    def setUp(self):
        new_organization = models.Organization.objects.create(name="Manuels Organization")
        A1 = models.Help.objects.create(name="Cole", latitude=1.215, longitude=-77.276, short_description="Lorem ipsum dolor sit amet consectetur adipiscing.", 
        recomedations="Lorem ipsum dolor sit amet consectetur adipiscing..", organization=new_organization, category="Cole")

        A2 = models.Help.objects.create(name="Exito", latitude=1.215, longitude=-77.279, short_description="Lorem ipsum dolor sit amet consectetur adipiscing.", 
        recomedations="Lorem ipsum dolor sit amet consectetur adipiscing.", organization=new_organization, category="Exito")

        print(A1.uuid, A2.uuid)

    def test_secend(self):
        c = Client()
        response = c.post('/api/all_helps', {'data' : 'all'}, content_type="application/json")
        data = json.loads(response.content)
        self.assertEqual(data['points'], [
            {
                'name' : "Cole",
                'cordinates' : ['-77.276', '1.215'],
                'category' : "Cole",
                'organization' : "Manuels Organization",
                'description' : "Lorem ipsum dolor sit amet consectetur adipiscing.",
                'rute' : "https://www.google.com/maps/dir//1.215,-77.276"
            },
            {
                'name' : "Exito",
                'cordinates' : ['-77.279', '1.215'],
                'category' : "Exito",
                'organization' : "Manuels Organization",
                'description' : "Lorem ipsum dolor sit amet consectetur adipiscing.",
                'rute' : "https://www.google.com/maps/dir//1.215,-77.279"
            }

        ])

