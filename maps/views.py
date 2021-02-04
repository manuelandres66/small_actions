from django.shortcuts import render, reverse, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.core.cache import cache
from django.core.cache.utils import make_template_fragment_key

from .models import Help, Comment
from .forms import FromCode, CommentForm
from login.models import User

import json
import random
import string
# Create your views here.

def index(request):
    return render(request, 'maps/index.html')


def donate(request): 
    return render(request, 'maps/donate.html') 

def info_point(request, uuid):
    help_point = Help.objects.get(uuid=uuid)
    comments = help_point.comments.all().order_by('-date')
    form = CommentForm()

    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            new_comment = Comment.objects.create(
                comment= form.cleaned_data['comment'],
                user= request.user
            )
            help_point.comments.add(new_comment)
            help_point.save()
            return redirect(reverse('info', kwargs={'uuid' : uuid}))


    ctx = {'point' : help_point, 'comments' : comments, 'form' : form}
    return render(request, 'maps/info.html', ctx)

def points(request):
    return render(request, 'maps/points.html')


def go(request, uuid):
    help_point = Help.objects.get(uuid=uuid)
    form = FromCode()
    login_error = ''
    code_error = ''

    if request.method == 'POST':
        if request.user.is_authenticated: #Check user is log in
            form = FromCode(request.POST)
            if form.is_valid():
                code = f"{request.POST['first']}-{request.POST['second']}-{request.POST['third']}".upper() #make the code and upper to avoid erros

                if code == help_point.temporal_code:
                    #New Random Code
                    letters = string.ascii_uppercase
                    first = ''.join(random.choice(letters) for i in range(3))
                    second = random.randint(111, 999)
                    third = ''.join(random.choice(letters) for i in range(3))
                    
                    help_point.temporal_code = f"{first}-{second}-{third}".upper()
                    help_point.save()
                    old_ranking = request.user.get_ranking()

                    #Get Points
                    current_user = User.objects.get(username=request.user.username)
                    current_user.points += help_point.points_for_completed
                    current_user.visited.add(help_point)
                    current_user.save()
                    new_ranking = current_user.get_ranking()

                    #Cleand Cache
                    cache.delete(make_template_fragment_key('navbar'))

                    return redirect(reverse('congratulations') + f'?i={old_ranking - new_ranking}&p={help_point.points_for_completed}') #Redirect
                else:
                    code_error = 'Codigo Invalido'
        else:
            login_error = 'No estás autenticado, por favor inicia sesión'

    ctx = {'point' : help_point, 'form' : form, 'login_error' : login_error, 'error' : code_error}
    return render(request, 'maps/go.html', ctx)

def congratulations(request):
    improve = request.GET['i']
    points = request.GET['p']
    return render(request, 'maps/congratulations.html', {'ranking' : improve, 'points' : points})

#API
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
                'category' : single.get_category_display(),
                'organization' : single.organization.name,
                'description' : single.short_description,
                'rute' : reverse('go', kwargs={'uuid' : single.uuid}),
                'uuid' : reverse('info', kwargs={'uuid' : single.uuid})
            }
            points_response.append(point)
            latitude_sum += single.latitude
            longitude_sum += single.longitude

        check = request.user.is_authenticated and request.user.latitude != None and request.user.longitude != None

        if check:
            latitude_avarage = request.user.latitude
            longitude_avarage = request.user.longitude
        elif len(all_helps) > 0:
            latitude_avarage = float("{0:.8f}".format(latitude_sum / len(all_helps)))
            longitude_avarage = float("{0:.8f}".format(longitude_sum / len(all_helps)))
        else:
            latitude_avarage, longitude_avarage = -78, 0

        response = {
            'latitude' : latitude_avarage,
            'longitude' : longitude_avarage,
            'points' : points_response
        }

        if check:
            response['user'] = True

        return JsonResponse(response, status=200)
    
    return JsonResponse({'error' : 'no data specified'}, status=400)

def search_helps(request):
    if request.method != "POST":
        return JsonResponse({'error' : 'The request must be POST'}, status=400)

    data = json.loads(request.body)


    if 'search' in data:

        search = Help.objects.filter(name__contains=data['search'])
        search = search | Help.objects.filter(short_description__contains=data['search'])
        search = search | Help.objects.filter(recomedations__contains=data['search'])

        response = {'results' : []}
        for point in search[:7]:
            response['results'].append({
                'name': point.name,
                'organization' : point.organization.name,
                'url' : reverse('info', kwargs={'uuid' : point.uuid})
            })

        return JsonResponse(response, status=200)

    else:
        return JsonResponse({'error' : 'no search specified'}, status=400)

    