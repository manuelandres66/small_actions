from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import Help

import json
# Create your views here.

def index(request):
    return render(request, 'maps/index.html')

def info_point(request, uuid):
    help_point = Help.objects.get(uuid=uuid)

    ctx = {'point' : help_point}
    return render(request, 'maps/info.html', ctx)

def all_helps(request):
    if request.method != "POST":
        return JsonResponse({'error' : 'The request must be POST'}, status=400)
    data = json.loads(request.body)

    if 'data' in data and data['data'] == 'all':
        points_response = []
        all_helps = Help.objects.all()
        latitude_sum = 0
        longitude_sum = 0

        for single in all_helps:
            point = {
                'name' : single.name,
                'cordinates' : [single.longitude, single.latitude],
                'category' : single.category,
                'organization' : single.organization.name,
                'description' : single.short_description,
                'rute' : f"https://www.google.com/maps/dir//{single.latitude},{single.longitude}",
                'uuid' : single.uuid
            }
            points_response.append(point)
            latitude_sum += single.latitude
            longitude_sum += single.longitude

        if len(all_helps) > 0:
            latitude_avarage = float("{0:.3f}".format(latitude_sum / len(all_helps)))
            longitude_avarage = float("{0:.3f}".format(longitude_sum / len(all_helps)))
        else:
            latitude_avarage, longitude_avarage = 0, -78

        response = {
            'latitude' : latitude_avarage,
            'longitude' : longitude_avarage,
            'points' : points_response
        }

        return JsonResponse(response, status=200)
    
    return JsonResponse({'error' : 'no data especified'}, status=400)

    