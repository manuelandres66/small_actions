from django.shortcuts import render, reverse
from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from django.db.models import Count
from django.views.decorators.cache import cache_page

from .forms import NewOrganization
from .models import Organization

from maps.models import Help

import json
# Create your views here. 

def choose_category(request):
    return render(request, 'info/choose.html')

@cache_page(60 * 30)
def organization(request, pk):
    org = Organization.objects.get(pk=pk)
    places = len(org.help_points.all())
    return render(request, 'info/org.html', {'org' : org, 'places' : places})

def api_org(request):
    if request.method != "POST":
        return JsonResponse({'error' : 'The request must be POST'}, status=400)
    data = json.loads(request.body)

    if 'id' in data:
        points_response = []
        org = Organization.objects.get(pk=data['id'])
        all_helps = Help.objects.filter(organization=org)

        for single in all_helps:
            point = {
                'name' : single.name,
                'cordinates' : [single.longitude, single.latitude],
                'rute' : reverse('go', kwargs={'uuid' : single.uuid}),
                'uuid' : reverse('info', kwargs={'uuid' : single.uuid})
            }
            points_response.append(point)

        if request.user.is_authenticated and request.user.latitude != None and request.user.longitude != None:
            latitude = request.user.latitude
            longitude = request.user.longitude
            zoom = 14
        else:
            latitude = 0
            longitude = 0
            zoom = 1

        response = {
            'latitude' : latitude,
            'longitude' : longitude,
            'zoom' : zoom,
            'points' : points_response
        }

        return JsonResponse(response, status=200)


def search(request):
    photos = Organization.objects.annotate(p_count=Count('help_points')).order_by('-p_count')[:8]
    return render(request, 'info/search.html', {'photos' : photos})

def api_search(request): 
    if request.method != "POST":
        return JsonResponse({'error' : 'The request must be POST'}, status=400)
    data = json.loads(request.body)

    if 'search' in data:
        search = Organization.objects.filter(name__contains=data['search'])
        search = search | Organization.objects.filter(short_description__contains=data['search'])
        search = search | Organization.objects.filter(quote__contains=data['search'])

        response = {'results' : []}
        for organi in search[:8]:
            response['results'].append({
                'name': organi.name,
                'number_points' : organi.get_points(),
                'url' : reverse('org', kwargs={'pk' : organi.id})
            })

        return JsonResponse(response, status=200)
        
    else:
         return JsonResponse({'error' : 'no search specified'}, status=400)


def become(request):
    form = NewOrganization()
    message = ''
    if request.method == 'POST':
        form = NewOrganization(request.POST, request.FILES)
        if form.is_valid():
            new_organization = Organization.objects.create(
                name=                   form.cleaned_data['name'],
                phone_number=           form.cleaned_data['phone_number'],
                contact_name=           form.cleaned_data['contact_name'],
                contact_phone_number =  form.cleaned_data['contact_phone_number'],
                short_description =     form.cleaned_data['short_description'],
                quote =                 form.cleaned_data['quote'],
                circular_icon =         form.cleaned_data['circular_icon'],
                image =                 form.cleaned_data['image']
            )

            message = "Solicitud enviada, entre 1 a 7 dias le llegara un mensaje al teléfono de la persona acargo"

            send_mail(f'NEW ORGANIZATION!! {new_organization.name}',
                f"name: {new_organization.name}, contact phone: {new_organization.contact_phone_number}, id: {new_organization.id}",
                settings.EMAIL_HOST_USER,
                [settings.EMAIL_HOST_USER,],
            )


    return render(request, 'info/become.html', {'form' : form, 'message' : message})