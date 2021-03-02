from django.shortcuts import render, reverse
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse

from .froms import ReportForm, CreatePlace, CreatePhoto
from .models import Report
from .decorators import allowed

from login.models import User
from maps.models import Help, HelpPhoto

import json
# Create your views here.

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def index(request):
    return render(request, 'control/index.html')

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def places(request):
    if request.method != 'GET':
        return JsonResponse({'error' : 'Invalid request'}, status=400)

    user = User.objects.get(username=request.user.username)
    organization = user.organization

    response = {'places' : []}
    for place in organization.help_points.all().order_by('data_created'):
        response['places'].append({
            'name' : place.name,
            'image' : place.photos.all()[0].photo.url,
            'url' : reverse('info', kwargs={'uuid' : place.uuid}),
            'uuid' : place.uuid,
            'hover' : False
        })

    return JsonResponse(response, status=200)

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def delete_place(request):
    if request.method != 'POST':
        return JsonResponse({'error' : 'Invalid request'}, status=400)
        
    data = json.loads(request.body)

    if 'uuid' in data and data['uuid'] != '':
        Help.objects.get(uuid=data['uuid']).delete()
        return JsonResponse({'message' : 'sucecess'}, status=200)

    return JsonResponse({'error' : 'no data specified'}, status=400)

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def upload_image(request):
    if request.method != 'POST':
        return JsonResponse({'error' : 'Invalid request'}, status=400)
    
    form = CreatePhoto(request.POST, request.FILES)
    if form.is_valid():
        new_photo = HelpPhoto.objects.create(
            photo=form.cleaned_data['photo']
        )
        return JsonResponse({'id' : new_photo.id}, status=200)

    return JsonResponse({'error' : 'Invalid Form'}, status=400)


@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def upload_place(request):
    if request.method != 'POST':
        return JsonResponse({'error' : 'Invalid request'}, status=400)

    user = User.objects.get(username=request.user.username)

    form = CreatePlace(request.POST)
    if form.is_valid():
        mayor = form.cleaned_data['mayor_category']
        points_for_completed = 150 if mayor == 'D' else 200 #If volunteer 200 points, if donation 150

        Help.objects.create(
            latitude =              form.cleaned_data['latitude'],
            longitude =             form.cleaned_data['longitude'],
            name =                  form.cleaned_data['name'],
            short_description =     form.cleaned_data['short_description'],
            recomedations =         form.cleaned_data['recomedations'],
            organization =          user.organization,
            photo =                 form.cleaned_data['photo'],
            points_for_completed=   points_for_completed,
            mayor_category =        mayor,
            category =              form.cleaned_data['category'],
            sub_category =          form.cleaned_data['sub_category']
        )

        return JsonResponse({'message' : 'All ok'}, status=200)

    return JsonResponse({'error' : 'Invalid Form'}, status=400)



@login_required(login_url='/account/login')
def report_form(request):
    form = ReportForm()
    message = ''

    if request.method == 'POST':
        form = ReportForm(request.POST)
        if form.is_valid():
            new_report = Report.objects.create(
                user_that_report=           request.user,
                organization_or_user=       form.cleaned_data['organization_or_user'],
                name_of_reported=           form.cleaned_data['name_of_reported'],
                category_of_problem=        form.cleaned_data['category_of_problem'],
                decription_of_the_problem = form.cleaned_data['decription_of_the_problem']
            )

            send_mail('New Report',
                f"Report number: {new_report.id}",
                settings.EMAIL_HOST_USER,
                [settings.EMAIL_HOST_USER]
            )

            message = 'Reporte Registrado'



    return render(request, 'control/report.html', {'form' : ReportForm, 'message' : message})