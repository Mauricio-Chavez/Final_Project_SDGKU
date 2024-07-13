from django.urls import path
from . import views

from django.conf.urls.static import static
from django.conf import settings

from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    path('register', views.register),
    path('login', views.login),
    path('profile', views.profile),
    path('user', views.user),
    path('upload_certification', views.upload_certification),
    path('view_certifications/<int:user_id>', views.view_certifications),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)