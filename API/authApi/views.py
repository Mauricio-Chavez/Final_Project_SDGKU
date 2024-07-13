from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from .serializers import UserSerializer, UserModelSerializer, CertificationSerializer
from .models.user import Certifications
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import MultiPartParser, FormParser

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
    user = get_object_or_404(User,username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({'error':'Invalid Password'},status=status.HTTP_400_BAD_REQUEST)
    
    token,created = Token.objects.get_or_create(user=user)

    serializer = UserSerializer(instance=user)

    return Response({'token':token.key,'user':serializer.data},status=status.HTTP_200_OK)
    
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    # print(request.user)
    # return Response('You are login with {}'.format(request.user.username),status=status.HTTP_200_OK)
    serializer = UserSerializer(instance=request.user)
    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user(request):
    serializer = UserSerializer(instance=request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)
    
    