import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect
from django.views.generic import TemplateView
from django.views.static import serve

# Import the frontend views
from irops_app.views import direct_serve_file, serve_static_file, test_view

# URL patterns
urlpatterns = [
    # Frontend views - direct file serving approach
    path('', lambda request: direct_serve_file(request), name='dashboard'),
    path('index.html', lambda request: direct_serve_file(request, 'index.html'), name='index'),
    path('login.html', lambda request: direct_serve_file(request, 'login.html'), name='login'),
    path('redirect.html', lambda request: direct_serve_file(request, 'redirect.html'), name='redirect'),
    path('test/', test_view, name='test'),
    # Static assets path
    re_path(r'^assets/(?P<path>.*)$', serve_static_file, name='serve_static'),
    
    # API URLs
    path('api/', include('irops_app.urls_api')),
    
    # Authentication endpoints
    path('api/auth/', include('irops_app.urls_auth')),
    
    # Admin URLs
    path('admin/', admin.site.urls),
    path('grappelli/', include('grappelli.urls')),
]

# Serve static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # Serve assets directory directly for the frontend
    urlpatterns += [
        re_path(r'^assets/(?P<path>.*)$', serve, {
            'document_root': os.path.join(settings.BASE_DIR, 'assets'),
        }),
    ]
