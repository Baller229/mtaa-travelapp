from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from rest_framework import serializers
from .models import Destinations, DestinationDates, ReservedDestinations, DestinationImages, User
from django.contrib.auth import get_user_model

user = get_user_model()

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        ref_name = 'DjoserUserCreateSerializer'
        model = user
        fields = ['id', 'username', 'password']

# ===================================================================
#   GET api/destinations SERIALIZER
# ====================================================================

class DestinationSerializer(serializers.ModelSerializer):
    trip_urls = serializers.SerializerMethodField()

    class Meta:
        model = Destinations
        fields = ['id', 'trip_name', 'trip_city', 'trip_specs', 'trip_price', 'latitude', 'longitude',  'trip_urls']

    def get_trip_urls(self, obj):
        images = obj.destinationimages_set.all()
        if images.exists():
            return [self.context['request'].build_absolute_uri(img.trip_image.url) for img in images]
        return []

# ===================================================================
#   GET api/destinations/specs SERIALIZER
# ===================================================================

class SpecsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destinations
        fields = ['id', 'trip_name', 'trip_city', 'trip_specs','trip_price', 'latitude', 'longitude', 'trip_urls']

    def get_trip_urls(self, obj):
        images = obj.destinationimages_set.all()
        if images.exists():
            return [self.context['request'].build_absolute_uri(img.trip_image.url) for img in images]
        return []

# ===================================================================
#   GET api/{trip_name}/dates SERIALIZER
# ===================================================================

class DateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationDates
        fields = ('trip_date',)

# ===================================================================
#   POST api/reserve/ 
#   SERIALIZER
# ===================================================================

class ReservedDestinationsSerializer(serializers.Serializer):
    persons_no = serializers.IntegerField()
    trip_id = serializers.IntegerField()
    user_id = serializers.IntegerField()
    custom_trip_name = serializers.CharField()

    def create(self, validated_data):
        return ReservedDestinations.objects.create(**validated_data)
    
# ===================================================================
#   GET api/<int:pk>/payment/ SERIALIZER
# ===================================================================

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destinations
        fields = ('trip_name', 'trip_price')

# ===================================================================
#   POST api/history/ SERIALIZER
# ===================================================================

class HistorySerializer(serializers.ModelSerializer):
    trip_price = serializers.DecimalField(source='trip.trip_price', max_digits=10, decimal_places=2)

    class Meta:
        model = ReservedDestinations
        fields = ('trip_id', 'custom_trip_name', 'trip_price')

    

# ===================================================================
#   PUT <int:pk>/<str:custom_trip_name>/<str:new_trip_name>/updatereservation/
#   SERIALIZER
# ===================================================================

class UpdateDestinationsSerializer(serializers.ModelSerializer):
   class Meta:
        model = ReservedDestinations    
        fields = ['id', 'persons_no', 'custom_trip_name', 'user', 'trip']

# ===================================================================

class DestinationImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationImages
        fields = ('trip', 'trip_image')

# ===================================================================

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'is_active']