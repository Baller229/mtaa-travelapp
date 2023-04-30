from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.conf import settings
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.http import JsonResponse, HttpResponse
from rest_framework.renderers import JSONRenderer
from rest_framework.schemas.openapi import SchemaGenerator
from rest_framework.request import Request
import yaml

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('playground.urls')),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

schema_view = get_schema_view(
    openapi.Info(
        title="Tvoj Django Projekt API",
        default_version='v1',
        description="Popis tvojho API",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="tvoj_email@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
)

urlpatterns += [
    # ...
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    # ...
]

