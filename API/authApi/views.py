from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from .serializers import UserModelSerializer, CertificationSerializer, BookingSerializer
from .models.user import Certifications, Booking
import os
from .models.user import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings
from .google_calendar import *
from rest_framework.parsers import JSONParser
import json
# Create your views here.
# @api_view(['POST'])
# def register(request):

#     serializer = UserSerializer(data=request.data)

#     if serializer.is_valid():
#         serializer.save()
        
#         user = User.objects.get(username=serializer.data['username'])
#         user.set_password(serializer.data['password'])
#         user.save()
#         token=Token.objects.create(user=user)
#         return Response({'token':token.key,'user':serializer.data},status=status.HTTP_201_CREATED)

#     return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register(request):
    print(f"request: {request} request.data: {request.data}")

    serializer = UserModelSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        token = Token.objects.create(user=user)

        return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_certification(request):

    serializer = CertificationSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def view_certifications(request, user_id):
    certifications = Certifications.objects.filter(tutor_id=user_id)
    serializer = CertificationSerializer(certifications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User,email=request.data['email'])
    if not user.check_password(request.data['password']):
        return Response({'error':'Invalid Password'},status=status.HTTP_400_BAD_REQUEST)
    
    token,created = Token.objects.get_or_create(user=user)
    # email_to = user.email
    serializer = UserModelSerializer(instance=user)
    # subject = 'Login Notification'
    # message = 'You have successfully logged in.'
    # email_from = settings.EMAIL_HOST_USER
    # html = render_to_string('emails/login.html', {'user': user})
    # send_mail(subject, message, email_from, [email_to], html_message=html)
    
    return Response({'token':token.key,'user':serializer.data},status=status.HTTP_200_OK)
    
# @api_view(['POST'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# def profile(request):
#     # print(request.user)
#     # return Response('You are login with {}'.format(request.user.username),status=status.HTTP_200_OK)
#     serializer = UserSerializer(instance=request.user)
#     return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user(request):
    serializer = UserModelSerializer(instance=request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user
    serializer = UserModelSerializer(instance=user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_photo(request):
    user = request.user
    if 'photo' in request.data and request.data['photo'] != user.photo.name:
        if user.photo:
            if os.path.isfile(user.photo.path):
                os.remove(user.photo.path)
    serializer = UserModelSerializer(instance=user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_photo(request):
    user = request.user
    if user.photo:
        if os.path.isfile(user.photo.path):
            os.remove(user.photo.path)
        user.photo = None
        user.save()
        serializer = UserModelSerializer(instance=user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({'error': 'No photo found'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getUsers(request):
    users = User.objects.filter(role=0)
    serializer = UserModelSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])

def getTutors(request):
    tutors = User.objects.filter(role=1, is_visible=True)
    serializer = UserModelSerializer(tutors, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response('You are logout',status=status.HTTP_200_OK)

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_visible(request):
    user = request.user
    user.is_visible = request.data.get('is_visible', user.is_visible)
    user.save()
    serializer = UserModelSerializer(instance=user)
    return Response(serializer.data, status=status.HTTP_200_OK)
    

@api_view(['GET'])
def oauth2callback(request):
    print(f'request 155 views {request}')
    state = request.session.get('state')
    print(f'state 155 views {state}')
    flow = InstalledAppFlow.from_client_secrets_file(settings.GOOGLE_CREDENTIALS_FILE, SCOPES, state=state)
    flow.redirect_uri = settings.GOOGLE_OAUTH2_CALLBACK_URL

    authorization_response = request.build_absolute_uri()
    print(f'authorization_response: {authorization_response}')

    flow.fetch_token(authorization_response=authorization_response)

    creds = flow.credentials
    token_path = settings.GOOGLE_CREDENTIALS_DIR / 'token.json'
    with open(token_path, 'w') as token:
        token.write(creds.to_json())

    return redirect('/api/google-calendar/events')

@api_view(['GET'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
def google_calendar_events(request):
    print(f'view 170 {request}')
    try:
    #     auth_url_or_events = list_upcomming_events(request)
    #     if isinstance(auth_url_or_events, str):  
    #         return redirect(auth_url_or_events)
    #     return Response(auth_url_or_events, status=status.HTTP_200_OK)
    # except Exception as e:
    #     return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        events = list_upcomming_events(request)
        if isinstance(events, str):
            print(f'view 174 events isins {events}')
            return redirect(events)
        return Response(events, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
def google_calendar_create_event(request):
    print(f'view 197 {request.data}')
    try:
        if request.data is None:
            raise ValueError("No data provided")
        
        summary = request.data.get('summary')
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')
        timezone = request.data.get('timezone')
        attendees = request.data.get('attendees')

        print(f'HIIIIIIIIIII')
        print(f'{summary}')
        print(f'{start_time} {end_time}')
        print(f'{timezone}')
        print(f'{attendees}')
        event = create_event(summary,start_time, end_time, timezone, attendees)

        if not event:
            raise ValueError("Failed to create event with Google Calendar API")

        user_id = request.data.get('user_id')
        tutor_id = request.data.get('tutor_id')
        link = event.get('hangoutLink')

        print(f'{user_id}')
        print(f'{tutor_id}')
        print(f'{link}')

        booking_data = {
            'user_id': user_id,
            'tutor_id': tutor_id,
            'summary': summary,
            'start_time': start_time,
            'end_time': end_time,
            'timezone': timezone,
            'attendees': attendees,
            'meeting_link': link
        }

        serializer = BookingSerializer(data=booking_data)

        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(event, status=status.HTTP_201_CREATED)
    except Exception as e:
        print("ERROR")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PUT'])
def google_calendar_update_event(request, event_id):
    try:
        summary = request.data.get('summary')
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')

        updated_event = update_event(event_id, summary, start_time, end_time)
        return Response(updated_event, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def google_calendar_delete_event(request, event_id):
    try:
        delete_event(event_id)
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def view_meetings(request, id):
    meetings = Booking.objects.filter(tutor_id=id)
    if not meetings.exists():
        meetings = Booking.objects.filter(user_id=id)
    serializer = BookingSerializer(meetings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)