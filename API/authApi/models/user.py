from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.db.models import JSONField


class CustomUserManager(BaseUserManager):
  def create_user(self, username, email, password=None, **extra_fields):
    if not email:
      raise ValueError('Please provide an email address')
    if not username:
      raise ValueError('Please provide a username')
    
    email = self.normalize_email(email)
    user = self.model(username=username, email=email, **extra_fields)
    user.set_password(password)
    user.save(using=self._db)

    return user
  
  def create_superuser(self, username, email, password=None, **extra_fields):
    extra_fields.setdefault('is_staff', True)
    extra_fields.setdefault('is_superuser', True)
    extra_fields.setdefault('role', 2)
      
    return self.create_user(username, email, password, **extra_fields)
      

class User(AbstractUser, PermissionsMixin):
  username = models.CharField(max_length=250, unique=True)
  first_name = models.CharField(max_length=250)
  last_name = models.CharField(max_length=250)
  email = models.EmailField(max_length=250, unique=True)
  password = models.CharField(max_length=128)
  role = models.IntegerField(default=0)
  study_area = models.CharField(max_length=255, null=True, blank=True)
  booking = models.DateField(null=True, blank=True)
  specialties = models.TextField(null=True, blank=True)
  hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
  experience = models.TextField(null=True, blank=True)
  availability = JSONField(null=True, blank=True)
  messages = models.ForeignKey('Message', on_delete=models.CASCADE, null=True, blank=True)

  objects = CustomUserManager()

  USERNAME_FIELD = 'username'
  REQUIRED_FIELDS = ['first_name', 'last_name', 'email']

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def save(self, *args, **kwargs):
    if self.role == 2:
      self.is_staff = True
      self.is_superuser = True
    else:
      self.is_staff = False
      self.is_superuser = False
    super().save(*args, **kwargs)

  def __str__(self):
    return self.username
  

class Message(models.Model):
  content = models.TextField()
  sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
  receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.content[:20]