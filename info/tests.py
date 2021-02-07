from django.test import TestCase, Client
from django.shortcuts import reverse
from django.core.files.uploadedfile import SimpleUploadedFile

from .models import Organization
from .forms import NewOrganization
from maps.models import Help, Category, SubCategory

import json
# Create your tests here.

small_gif = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x05\x04\x04\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'

class InfoTest(TestCase):

    def test_become(self):
        c = Client()
        response = c.get(reverse('become'))

        self.assertEqual(response.status_code, 200)

    def test_choose(self):
        c = Client()
        response = c.get(reverse('choose')) 
        self.assertEqual(response.status_code, 200)


class OrgTest(TestCase):

    def setUp(self):
        sub_cate = SubCategory.objects.create(code='DFfFrit', name='Ficcion Sub Categry')
        second_sub_cate = SubCategory.objects.create(code='DFfSecn', name='Second Sub Cate')
        cate = Category.objects.create(code='DFf', name='Ficcion')
        cate.sub_categories.add(sub_cate)
        cate.sub_categories.add(second_sub_cate)

        uploaded = SimpleUploadedFile('test.gif', small_gif, content_type='image/gif')
        new_org = Organization.objects.create(name="Manuels Organization", 
                short_description="Lorem ipsum dolor sit amet consectetur adipiscing elit placerat",
                quote="Hello My Friends",
                circular_icon = uploaded,
                image = uploaded)

        second_org = Organization.objects.create(name="Manuels test Organization", 
                short_description="Lorem ipsum dolor sit amet consectetur adipiscing elit placerat",
                quote="Hello My Friends",
                circular_icon = uploaded,
                image = uploaded)


        self.help = Help.objects.create(name="Cole", latitude=1.215, longitude=-77.276, short_description="Lorem ipsum dolor sit amet consectetur adipiscing.", 
        recomedations="Lorem ipsum dolor sit amet consectetur adipiscing..", organization=new_org, category=cate, temporal_code='AAD-458-JJU')
        self.help.sub_category.add(sub_cate)

    def test_orgs(self):
        c = Client()
        response = c.get(reverse('searchOrganization'))
        self.assertEqual(response.status_code, 200)

    def test_apiorgs(self):
        c = Client()
        response = c.post(reverse('apiSearchOrg'), {'search' : 'M'}, content_type="application/json")
        data = json.loads(response.content)

        self.assertEqual(data['results'], [
            {
                'name' : 'Manuels Organization',
                'number_points': 1,
                'url' :  reverse('org', kwargs={'pk' : 1})
            }, 
            {
                'name' : 'Manuels test Organization',
                'number_points': 0,
                'url' :  reverse('org', kwargs={'pk' : 2})
            }
        ])

    def test_org(self):
        c = Client()
        response = c.get(reverse('org', kwargs={'pk' : 1}))
        self.assertEqual(response.status_code, 200)

    def test_apiorg(self):
        c = Client()
        response = c.post(reverse('apiHelpOrg'), {'id' : 1}, content_type="application/json")
        data = json.loads(response.content)

        self.assertEqual(data['points'], [{
            'name' : 'Cole',
            'coordinates' : ['-77.27600000','1.21500000'],
            'rute' : reverse('go', kwargs={'uuid' : self.help.uuid}),
            'uuid' : reverse('info', kwargs={'uuid' : self.help.uuid})
        }])

    def test_category(self):
        c = Client()
        response = c.get(reverse('category', kwargs={'category' : 'donate'}))
        self.assertEqual(response.status_code, 200)

    def test_apicategory(self):
        c = Client()
        response = c.post(reverse('apiCategory'), {'category' : 'D'}, content_type="application/json")
        data = json.loads(response.content)

        self.assertEqual(data['D'], {'DFf' : {
            'DFfFrit' : [{
                'name' : 'Cole',
                'coordinates' : ['-77.27600000','1.21500000'],
                'rute' : reverse('go', kwargs={'uuid' : self.help.uuid}),
                'uuid' : reverse('info', kwargs={'uuid' : self.help.uuid})
            }],
            'DFfSecn' : []
        }})




        

