from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.conf import settings

from .froms import ReportForm
from .models import Report

# Create your views here.

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