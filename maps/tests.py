from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile

from . import models

import json
import pathlib
import os
# Create your tests here.

small_gif = (
    b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x05\x04\x04\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
)


class htmltest(TestCase):
    def test_index(self):
        c = Client()
        response = c.get('/')
        self.assertEqual(response.status_code, 200)

    def test_points(self):
        c = Client()
        response = c.get('/points/')
        self.assertEqual(response.status_code, 200)

class apitest(TestCase):

    def setUp(self):
        uploaded = SimpleUploadedFile('test.gif', small_gif, content_type='image/gif')

        new_organization = models.Organization.objects.create(name="Manuels Organization", 
                        short_description="Lorem ipsum dolor sit amet consectetur adipiscing elit placerat",
                        quote="Hello My Friends",
                        circular_icon = uploaded,
                        image = uploaded)

        A1 = models.Help.objects.create(name="Cole", latitude=1.215, longitude=-77.276, short_description="Lorem ipsum dolor sit amet consectetur adipiscing.", 
        recomedations="Lorem ipsum dolor sit amet consectetur adipiscing..", organization=new_organization, category="Cole")

        A2 = models.Help.objects.create(name="Exito", latitude=1.215, longitude=-77.279, short_description="Lorem ipsum dolor sit amet consectetur adipiscing.", 
        recomedations="Lorem ipsum dolor sit amet consectetur adipiscing.", organization=new_organization, category="Exito")

        self.example = A1
        self.second_example = A2

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
                'rute' : "https://www.google.com/maps/dir//1.215,-77.276",
                'uuid' : f'/points/info/{self.example.uuid}'
            },
            {
                'name' : "Exito",
                'cordinates' : ['-77.279', '1.215'],
                'category' : "Exito",
                'organization' : "Manuels Organization",
                'description' : "Lorem ipsum dolor sit amet consectetur adipiscing.",
                'rute' : "https://www.google.com/maps/dir//1.215,-77.279",
                'uuid' : f'/points/info/{self.second_example.uuid}'
            }

        ])

    def test_info(self):
        c = Client()
        response = c.get(f'/points/info/{self.example.uuid}')
        self.assertEqual(response.status_code, 200)
        paths = (os.path.abspath(os.getcwd()) + "/media/organizations", os.path.abspath(os.getcwd()) + "/media/organizations/circle")

        for path in paths:
            filtered_files = [file for file in os.listdir(path) if file.endswith(".gif")]

            for file in filtered_files:
                path_to_file = os.path.join(path, file)
                os.remove(path_to_file)

    def test_search(self):
        c = Client()
        response = c.post('/api/search_helps', {'search' : 'Col'}, content_type='application/json')
        data = json.loads(response.content)
        self.assertEqual(data['results'], [{
            'name' : 'Cole',
            'organization' : 'Manuels Organization',
            'url' : f'/points/info/{self.example.uuid}'
        }])

