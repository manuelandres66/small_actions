from django.shortcuts import render
from django.conf import settings
from django.core.mail import send_mail

from .forms import NewOrganization
from maps.models import Organization
# Create your views here.
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