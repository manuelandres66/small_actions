from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile

from django.shortcuts import reverse
from . import models
from login.models import User

import json
import pathlib
import os
# Create your tests here.

small_gif = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x05\x04\x04\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'


class htmltest(TestCase): 
    def test_index(self):
        c = Client()
        response = c.get(reverse('index'))
        self.assertEqual(response.status_code, 200)

    def test_points(self):
        c = Client()
        response = c.get(reverse('SerchPoints'))
        self.assertEqual(response.status_code, 200)

    def test_cong(self):
        c = Client()
        response = c.get(reverse('congratulations'), {'p' : 150, 'i' : 45})
        self.assertEqual(response.status_code, 200)

    def test_donate(self):
        c = Client()
        response = c.get(reverse('donate'))
        self.assertEqual(response.status_code, 200)

class apitest(TestCase):

    maxDiff = None

    def setUp(self):
        uploaded = SimpleUploadedFile('test.gif', small_gif, content_type='image/gif')

        new_organization = models.Organization.objects.create(name="Manuels Organization", 
                        short_description="Lorem ipsum dolor sit amet consectetur adipiscing elit placerat",
                        quote="Hello My Friends",
                        circular_icon = uploaded,
                        image = uploaded)

        A1 = models.Help.objects.create(name="Cole", latitude=1.215, longitude=-77.276, short_description="Lorem ipsum dolor sit amet consectetur adipiscing.", 
        recomedations="Lorem ipsum dolor sit amet consectetur adipiscing..", organization=new_organization, category="Cole", temporal_code='AAD-458-JJU')

        A2 = models.Help.objects.create(name="Exito", latitude=1.215, longitude=-77.279, short_description="Lorem ipsum dolor sit amet consectetur adipiscing.", 
        recomedations="Lorem ipsum dolor sit amet consectetur adipiscing.", organization=new_organization, category="Exito", temporal_code='AAC-458-JJU')

        self.example = A1
        self.second_example = A2
        self.organization = new_organization
        self.user = User.objects.create_user(username="PEPE", password="hola1234")

    def test_secend(self):
        c = Client()
        response = c.post(reverse('apiPHelps'), {'data' : 'all'}, content_type="application/json")
        data = json.loads(response.content)
        self.assertEqual(data['points'], [
            {
                'name' : "Cole",
                'cordinates' : ['-77.276000', '1.215000'],
                'category' : "Cole",
                'organization' : "Manuels Organization",
                'description' : "Lorem ipsum dolor sit amet consectetur adipiscing.",
                'rute' : reverse('go', kwargs={'uuid' : self.example.uuid}),
                'uuid' : f'/points/info/{self.example.uuid}'
            },
            {
                'name' : "Exito",
                'cordinates' : ['-77.279000', '1.215000'],
                'category' : "Exito",
                'organization' : "Manuels Organization",
                'description' : "Lorem ipsum dolor sit amet consectetur adipiscing.",
                'rute' : reverse('go', kwargs={'uuid' : self.second_example.uuid}),
                'uuid' : f'/points/info/{self.second_example.uuid}'
            }

        ])

    def test_info(self):
        c = Client()
        response = c.get(reverse('info', kwargs={'uuid' : self.example.uuid}))
        self.assertEqual(response.status_code, 200)
        paths = (os.path.abspath(os.getcwd()) + "/media/organizations", os.path.abspath(os.getcwd()) + "/media/organizations/circle")

        for path in paths:
            filtered_files = [file for file in os.listdir(path) if file.endswith(".gif")]

            for file in filtered_files:
                path_to_file = os.path.join(path, file)
                os.remove(path_to_file)

    def test_search(self):
        c = Client()
        response = c.post(reverse('apiSearchHelps'), {'search' : 'Col'}, content_type='application/json')
        data = json.loads(response.content)
        self.assertEqual(data['results'], [{
            'name' : 'Cole',
            'organization' : 'Manuels Organization', 
            'url' : f'/points/info/{self.example.uuid}'
        }])

    def test_go(self):
        c = Client()
        c.login(username="PEPE", password="hola1234")
        response = c.post(reverse('go', kwargs={'uuid' : self.example.uuid}), {'first' : 'AAC', 'second' : '488', 'third': 'JJJ'})
        self.assertEqual(response.status_code, 200) #If not ok

        response = c.post(reverse('go', kwargs={'uuid' : self.example.uuid}), {'first' : 'AAD', 'second' : '458', 'third': 'JJU'})
        self.assertEqual(response.status_code, 302) #If ok

        new_points = User.objects.get(username=self.user.username).points
        self.assertEqual(new_points, 10)

    def test_comment(self):
        c = Client()
        c.login(username="PEPE", password="hola1234")
        response = c.post(reverse('info', kwargs={'uuid' : self.example.uuid}), {'comment' : 'este sitio es genial'})

        help_point = models.Help.objects.get(uuid=self.example.uuid)
        number_comments = len(help_point.comments.all())
        self.assertEqual(number_comments, 1)


    def test_places(self):
        user = User.objects.get(username='PEPE')

        user.visited.add(self.example)
        user.visited.add(self.second_example)
        user.save()

        c = Client()
        c.login(username="PEPE", password="hola1234")
        response = c.get(reverse('Apiplaces'))
        data = json.loads(response.content)
        self.assertEqual(data, {'places' : [
            {
                'name' : 'Cole',
                'latitude' : '1.215000',
                'longitude' : '-77.276000',
                'url' : reverse('info', kwargs={'uuid' : self.example.uuid})
            },
            {
                'name' : 'Exito',
                'latitude' : '1.215000',
                'longitude' : '-77.279000',
                'url' : reverse('info', kwargs={'uuid' : self.second_example.uuid})
            }
        ]})

