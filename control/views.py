from django.shortcuts import render, reverse
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.core.mail import send_mail
from django.conf import settings

from .froms import ReportForm, CreatePlace, CreatePhoto, EditInstagram, EditOrg
from .models import Report, Notification
from .decorators import allowed

from login.models import User
from maps.models import Help, HelpPhoto
from info.models import InstagramPublication, Organization

import json
import random
import string
# Create your views here.

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def index(request):
    return render(request, 'control/index.html')

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def show_photo(request):
    photo = HelpPhoto.objects.get(id=request.GET['id'])
    return HttpResponse(f'<img src="{photo.photo.url}">')

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def get_org(request):
    if request.method != 'GET':
        return JsonResponse({'error' : 'Invalid request'}, status=400)

    user = User.objects.get(username=request.user.username)
    org = user.organization

    response = {
        'name' : org.name,
        'phone_number' : org.phone_number,
        'image' : org.image.url,
        'circular_icon' : org.circular_icon.url,
        'short_description' : org.short_description,
        'quote' : org.quote,
        'instagram_photos' : [{'url' : ins.url, 'id' : ins.id} for ins in org.instagram_photos.all()],
        'id' : org.id
    }

    return JsonResponse(response, status=200)

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def edit_org(request):
    if request.method != 'POST':
        return JsonResponse({'error' : 'Invalid request'}, status=400)
    
    org = Organization.objects.get(pk=request.POST['id'])
    form = EditOrg(request.POST, request.FILES, instance=org)
    if form.is_valid():
        org.name = form.cleaned_data['name']
        org.phone_number = form.cleaned_data['phone_number']
        org.short_description = form.cleaned_data['short_description']
        org.quote = form.cleaned_data['quote']

        if form.cleaned_data['image'] != "undefined":
            org.image = form.cleaned_data['image'] 
        if form.cleaned_data['circular_icon'] != "undefined":
            org.circular_icon = form.cleaned_data['circular_icon'] 

        org.save()
        return JsonResponse({'mesagge' : 'All ok'}, status=200)

    return JsonResponse({'error' : 'Invalid form'}, status=400)

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def edit_instagram(request):
    if request.method != 'POST':
        return JsonResponse({'error' : 'Invalid request'}, status=400)
    
    form = EditInstagram(request.POST)
    if form.is_valid():
        post = InstagramPublication.objects.get(pk=request.POST['id'])
        post.url = form.cleaned_data['url']
        post.save()
        return JsonResponse({'message' : f'{post.id} saved'}, status=200)

    return JsonResponse({'error' : 'Invalid form'}, status=400)

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def to_edit(request):
    if request.method != 'POST':
        return JsonResponse({'error' : 'Invalid request'}, status=400)

    data = json.loads(request.body)
    if 'uuid' in data:
        place = Help.objects.get(uuid=data['uuid'])
        palce_info = {
            'organization' : place.organization.id,
            'latitude' : place.latitude,
            'longitude' : place.longitude,
            'mayor_category' : place.mayor_category,
            'category' : place.category.id,
            'sub_category' : place.sub_category.all()[0].id,
            #Util data
            'name' : place.name,
            'short_description' : place.short_description,
            'recomedations' : place.recomedations,
            'uuid' : place.uuid
        }

        photos_id = [photo.id for photo in place.photos.all()]
        return JsonResponse({'form' : palce_info, 'photosId' : photos_id}, status=200)

    
    return JsonResponse({'error' : 'No uuid especified'}, status=400)

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def get_code(request):
    if request.method != 'POST':
        return JsonResponse({'error' : 'Invalid request'}, status=400)

    data = json.loads(request.body)
    if 'uuid' in data:
        place = Help.objects.get(uuid=data['uuid'])

        notifications = Notification.objects.filter(help_point=place, discarted=False)
        notification_list = []

        for notification in notifications:
            photo_url = notification.user.photo.url if notification.user.photo != '' else '/static/maps/images/logo_small_icon_only_inverted.png' #Check user have photo

            notification_list.append({
                'id' : notification.id,
                'username' : notification.user.username,
                'photo' : photo_url
            })

        return JsonResponse({'code' : place.temporal_code, 'notifications' : notification_list}, status=200)

    return JsonResponse({'error' : 'No uuid especified'}, status=400)

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def check_notification(request):
    if request.method != 'POST':
        return JsonResponse({'error' : 'Invalid request'}, status=400)

    data = json.loads(request.body)
    if 'id' in data and 'aproved' in data:

        notify = Notification.objects.get(id=data['id'])
        if data['aproved'] == False:
            notify.user.points = notify.user.points - notify.points_earned #Rest the points earned
            notify.user.visited.remove(notify.help_point) #Delete visited place
            notify.user.save()

        notify.discarted = True
        notify.aproved = data['aproved']
        notify.save()

        return JsonResponse({'message' : 'ok'}, status=200)

    return JsonResponse({'error' : 'No id or aproved especified'}, status=400)

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def ban(request):
    if request.method != 'POST':
        return JsonResponse({'error' : 'Invalid request'}, status=400)

    data = json.loads(request.body)
    if 'id' in data:
        notify = Notification.objects.get(id=data['id'])
        notify.user.points = notify.user.points - notify.points_earned #Rest the points earned in case the account is recuperated
        notify.user.visited.remove(notify.help_point) #Delete visited place
        notify.user.is_active = False #Ban User
        notify.user.save()

        send_mail('Tu cuenta fue baneada de Small Actions',
            f"""Tu cuenta {notify.user.username} fue baneada por {notify.help_point.organization.name}.
            Si crees que se trata de un error comunicate a https://api.whatsapp.com/send?phone=573023986488""",
            settings.EMAIL_HOST_USER,
            [notify.user.email]
        ) #Send email to notify the ban

        notify.discarted = True
        notify.aproved = False
        notify.save()

        return JsonResponse({'message' : f'{notify.user.username} has been banned'}, status=200)

    return JsonResponse({'error' : 'No id aproved especified'}, status=400)

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def places(request):
    if request.method != 'GET':
        return JsonResponse({'error' : 'Invalid request'}, status=400)

    user = User.objects.get(username=request.user.username)
    organization = user.organization

    response = {'places' : []}
    for place in organization.help_points.all().order_by('-data_created'):
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
        help_to_delete = Help.objects.get(uuid=data['uuid'])
        for photo in help_to_delete.photos.all():
            photo.delete()
        help_to_delete.delete()
        return JsonResponse({'message' : 'sucecess'}, status=200)

    return JsonResponse({'error' : 'No data specified'}, status=400)

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

    return JsonResponse({'error' : 'Invalid Photo Form'}, status=400)

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def delete_image(request):
    if request.method != 'POST':
        return JsonResponse({'error' : 'Invalid request'}, status=400)
    
    data = json.loads(request.body)
    if 'id' in data and data['id'] != None:
        HelpPhoto.objects.get(id=data['id']).delete()
    
    return JsonResponse({'error' : 'No id or id null'}, status=400)

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def get_info(request):
    if request.method != 'POST':
        return JsonResponse({'error' : 'Invalid request'}, status=400)
    
    data = json.loads(request.body)
    if 'uuid' in data:
        place = Help.objects.get(uuid=data['uuid'])
        notifications = Notification.objects.filter(help_point=place, aproved=True)

        points = 0 #To sum points earnad
        for notify in notifications:
            points += notify.points_earned

        response = {
            'views' : place.views,
            'visited' : len(notifications),
            'comments' : len(place.comments.all()),
            'notifications' : len(Notification.objects.filter(help_point=place)), #Not aproved necessary
            'pointsGenerated' : points
        }
        return JsonResponse(response, status=200)
    
    return JsonResponse({'error' : 'no data specified'}, status=400)


@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def upload_place(request):
    if request.method != 'POST':
        return JsonResponse({'error' : 'Invalid request'}, status=400)

    user = User.objects.get(username=request.user.username)

    form = CreatePlace(data=request.POST)
    if form.is_valid():
        mayor = form.cleaned_data['mayor_category']
        points_for_completed = 150 if mayor == 'D' else 200 #If volunteer 200 points, if donation 150

        #Temporal random code
        letters = string.ascii_uppercase
        first = ''.join(random.choice(letters) for i in range(3))
        second = random.randint(111, 999)
        third = ''.join(random.choice(letters) for i in range(3))

        new_place = Help.objects.create(
            latitude =              form.cleaned_data['latitude'],
            longitude =             form.cleaned_data['longitude'],
            name =                  form.cleaned_data['name'],
            short_description =     form.cleaned_data['short_description'],
            recomedations =         form.cleaned_data['recomedations'],
            organization =          user.organization,
            points_for_completed=   points_for_completed,
            mayor_category =        mayor,
            category =              form.cleaned_data['category'],
            temporal_code =         f"{first}-{second}-{third}".upper()    
        )

        for photo in form.cleaned_data['photos']:
            new_place.photos.add(photo)

        for sub_cate in form.cleaned_data['sub_category']:
            new_place.sub_category.add(sub_cate)

        new_place.save()

        return JsonResponse({'message' : 'All ok'}, status=200)

    return JsonResponse({'error' : 'Invalid Form'}, status=400)

@login_required(login_url='/account/login')
@allowed(allowed_roles=['Organization'])
def edit_place(request):
    if request.method != 'POST':
        return JsonResponse({'error' : 'Invalid request'}, status=400)

    form = CreatePlace(data=request.POST)
    if form.is_valid():
        mayor = form.cleaned_data['mayor_category']
        points_for_completed = 150 if mayor == 'D' else 200 #If volunteer 200 points, if donation 150

        place = Help.objects.get(uuid=request.POST['uuid'])
        place.latitude = form.cleaned_data['latitude']
        place.longitude = form.cleaned_data['longitude']
        place.name = form.cleaned_data['name']
        place.short_description = form.cleaned_data['short_description']
        place.recomedations = form.cleaned_data['recomedations']
        place.mayor_category = mayor
        place.points_for_completed = points_for_completed
        place.category = form.cleaned_data['category']

        for photo in form.cleaned_data['photos']:
            place.photos.add(photo)

        for sub_cate in form.cleaned_data['sub_category']:
            place.sub_category.add(sub_cate)

        place.save()
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