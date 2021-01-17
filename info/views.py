from django.shortcuts import render
from .forms import NewOrganization
# Create your views here.
def become(request):
    form = NewOrganization()
    if request.method == 'POST':
        form = NewOrganization(request.POST, request.FILES)
        if form.is_valid():
            pass
    return render(request, 'info/become.html', {'form' : form})