from django.urls import path
from . import views

from django.conf.urls.static import static
from django.conf import settings

from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    path('register', views.register),
    path('login', views.login),
    path('user', views.user),
    path('upload_certification', views.upload_certification),
    path('view_certifications/<int:user_id>', views.view_certifications),
    path('update', views.update_user),
    path('logout', views.logout),
    path('users', views.getUsers),
    path('tutors', views.getTutors),
    path('visibility',views.update_visible),
    path('oauth2callback', views.oauth2callback, name='oauth2callback'),
    path('google-calendar/events', views.google_calendar_events, name='google_calendar_events'),
    path('google-calendar/create-event', views.google_calendar_create_event),
    path('google-calendar/update-event/<str:event_id>', views.google_calendar_update_event),
    path('google-calendar/delete-event/<str:event_id>', views.google_calendar_delete_event),
    path('meetings/<int:id>', views.view_meetings),
    path('updatephoto',views.update_photo),
    path('deletephoto',views.delete_photo),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
