from rest_framework import serializers
from django.contrib.auth.models import User
from .models import user

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id','username','email','password']
        
class UserModelSerializer(serializers.ModelSerializer):
    # certifications = CertificationSerializer(many=True, read_only=True)
    class Meta:
        model = user.User
        fields = ['id', 'first_name', 'last_name', 'email', 'password', 'role', 'study_area', 'booking', 'specialties', 'hourly_rate', 'experience', 'availability', 'photo', 'messages', 'is_visible', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        users = user.User(**validated_data)
        users.set_password(password)
        users.save()
        return users
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            isinstance.set_password(password)
        instance.save()
        return instance
    
class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = user.Certifications
        fields = ['id', 'tutor_id', 'name', 'route_file', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']