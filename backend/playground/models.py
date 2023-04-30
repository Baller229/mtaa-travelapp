from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


# ==============================================================================
#   CUSTOM USER MODEL TABLE
# ==============================================================================

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(_("username"), unique=True, max_length=255)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    expo_push_token = models.CharField(max_length=200, null=True, blank=True)
    
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.username
    
# ==============================================================================
#   DESTINATIONS MODEL TABLE
# ==============================================================================

class Destinations(models.Model):
    trip_name = models.CharField(max_length=255)
    trip_city = models.CharField(max_length=255)
    trip_specs = models.CharField(max_length=1000)
    trip_price = models.DecimalField(max_digits=10, decimal_places=2)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)

# ==============================================================================
#   DESTINATION_DATES MODEL TABLE
# ==============================================================================

class DestinationDates(models.Model):
    trip_date = models.DateField()
    trip = models.ForeignKey(Destinations, on_delete=models.CASCADE)

# ==============================================================================
#   REVIEW MODEL TABLE
# ==============================================================================

class Review(models.Model):
    trip_review = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    trip = models.ForeignKey(Destinations, on_delete=models.CASCADE)

# ==============================================================================
#   RESERVED_DESTINATIONS MODEL TABLE
# ==============================================================================

class ReservedDestinations(models.Model):
    persons_no = models.IntegerField()
    custom_trip_name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    trip = models.ForeignKey(Destinations, on_delete=models.DO_NOTHING)

# ==============================================================================
#   RESERVED_DESTINATIONS MODEL TABLE
# ==============================================================================

class DestinationImages(models.Model):
    trip = models.ForeignKey(Destinations, on_delete=models.DO_NOTHING)
    trip_image = models.ImageField(upload_to='destination_images/')

# ==============================================================================

class Message(models.Model):
    id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.recipient}: {self.content}"