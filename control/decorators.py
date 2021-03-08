from django.shortcuts import redirect, reverse

def allowed(allowed_roles=[]):
    def decorator(view_func):
        def wrapper_func(request, *args, **kwargs):

            group = None
            if request.user.groups.exists() and len(request.user.groups.all()) > 1:
                group = request.user.groups.all()[1].name
            
            if group in allowed_roles:
                return view_func(request, *args, **kwargs)
            
            return redirect(reverse('login'))

        return wrapper_func
    return decorator