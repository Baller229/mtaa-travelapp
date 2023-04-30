from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Destinations, DestinationDates, ReservedDestinations, User
from rest_framework import status
from django.shortcuts import get_object_or_404
from .forms import DestinationSerializer, DateSerializer, ReservedDestinationsSerializer, PaymentSerializer, HistorySerializer, UpdateDestinationsSerializer, DestinationImagesSerializer, UserSerializer
from .notifications import send_push_notification
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
# ===================================================================
#   GET api/destinations VIEW
#   vypise trip_name, trip_city, trip_price vsetkych destinacii
# ===================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def destinations_list(request):
    destinations = Destinations.objects.all()
    serializer = DestinationSerializer(destinations, many=True, context={'request': request})
    return Response(serializer.data)

# ===================================================================
#   POST api/destinations/specs VIEW
#   vypise specifikaciu konkretnej destinacie
# ===================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
@swagger_auto_schema(request_body=DestinationSerializer)
def specs_list(request):
    trip_name = request.data.get('trip_name')
    destinations = Destinations.objects.filter(trip_name=trip_name)
    serializer = DestinationSerializer(destinations, many=True, context={'request': request})
    return Response(serializer.data)
    
# ===================================================================
#   GET api/{trip_name}/dates VIEW
#   vypise mi vsetky datumy konkretnej destinacie
# ===================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def date_list(request, trip_name):
    try:
        destination = Destinations.objects.get(trip_name=trip_name)
        dates = DestinationDates.objects.filter(trip_id=destination)
        serializer = DateSerializer(dates, many=True)
        return Response(serializer.data)
    except Destinations.DoesNotExist:
        return Response({'error': 'Destination not found'}, status=404)
    
# ===================================================================
#   POST api/reserve/ VIEW
#   ulozi do tabulky novu rezervaciu trip_id, user_id
# ===================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def add_reserved_destination(request):
    try:
        trip_name = request.data.get('trip_name')
        persons_no = request.data.get('persons_no')
        user_id = request.data.get('user_id')
        user = get_object_or_404(User, pk=user_id)
        trip = Destinations.objects.get(trip_name=trip_name)
        reserved_destination = ReservedDestinations.objects.create(
            persons_no=persons_no,
            user=user,
            trip=trip,
            custom_trip_name = trip_name,
        )
        serializer = ReservedDestinationsSerializer(reserved_destination)
        return Response({'message': 'successfully added reservations'})
    except Exception as e:
        return Response({'error': str(e)})
    
# ========================================================
#   GET api/<int:pk>/payment/ VIEW
#   vrati trip_name a trip_price aktualne zakupenej 
#   destinacie
# ========================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def payment_list(request, pk):
    try:
        reserved_dest = ReservedDestinations.objects.filter(user_id=pk).latest('id')
        serializer = PaymentSerializer(reserved_dest.trip)
        return Response(serializer.data)
    except ReservedDestinations.DoesNotExist:
        return Response({'message': 'User has no reserved destinations.'}, status=status.HTTP_404_NOT_FOUND)

# ========================================================
#   POST api/history/ VIEW
#   vrati trip_name, trip_price vsetkych zakupenych destinacii
# ========================================================    

@api_view(['POST'])
@permission_classes([AllowAny])
def history_list(request):
    try:
        id = request.data.get('user_id')
        reserved_dest = ReservedDestinations.objects.filter(user_id=id)
        serializer = HistorySerializer(reserved_dest, many=True)
        return Response(serializer.data)
    except ReservedDestinations.DoesNotExist:
        return Response({'message': 'User has no reserved destinations.'}, status=status.HTTP_404_NOT_FOUND)
    
# ========================================================
#   DELETE api/removereservation/
#   vymaze polozku v ReservedDestinations
# ========================================================    
@api_view(['DELETE'])
@permission_classes([AllowAny])
def add_remove_destination(request):
    try:
        id = request.data.get('user_id')
        trip_name = request.data.get('trip')
        user_reservation = get_object_or_404(ReservedDestinations, user=id, trip__trip_name=trip_name)
        user_reservation.delete()
        return Response({'message': f'Reservation for user {id} and trip {trip_name} deleted.'})
    except ReservedDestinations.DoesNotExist:
        return Response({'error': 'Reservation not found.'}, status=404)

# ========================================================
#   PUT <int:pk>/<str:custom_trip_name>/<str:new_trip_name>/updatereservation/
#   Premenuje polozku custom_trip_name v ReservedDestinations 
# ========================================================      

@api_view(['PUT'])
@permission_classes([AllowAny])
def rename_destination(request, pk, custom_trip_name, new_trip_name):
    try:
        user = User.objects.get(pk=pk)
        reserved_destination = ReservedDestinations.objects.get(user=user, custom_trip_name=custom_trip_name)
        destination = Destinations.objects.get(trip_name=custom_trip_name)

        reserved_destination.custom_trip_name = new_trip_name
        destination.trip_name = new_trip_name

        reserved_destination.save()
        destination.save()

        serializer = UpdateDestinationsSerializer(reserved_destination)
        return Response(serializer.data)
    except ReservedDestinations.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Destinations.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

# ===================================================================
# POST api/destinations/image 
# prida obrazok ku konkretnej destinacii
# ===================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def add_destination_image(request):
    trip_id = request.data.get('trip')
    print(f"request: {request}, trip_id: {trip_id}")
    if trip_id is None:
        return Response({'error': 'No trip id provided.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        destination = Destinations.objects.get(id=trip_id)
    except Destinations.DoesNotExist:
        return Response({'error': f'Trip with id {trip_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = DestinationImagesSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(trip=destination)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ===================================================================
# POST api/users/all/
# vypise mi vsetkych pouzivatelov okrem prihlaseneho pouzivatela
# ===================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def all_users(request):
    user_id = request.data.get('user')
    
    if user_id is None:
        return Response(status=400, data={'error': 'User ID is missing.'})
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(status=404, data={'error': 'User not found.'})

    other_users = User.objects.exclude(id=user_id)
    serializer = UserSerializer(other_users, many=True)
    print("ALL USERS +++++++++++++++++++")
    return Response(serializer.data)
   

# ===================================================================
# POST api/users/current/
# vypise mi aktualneho prihlaseneho pouzivatela
# ===================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def current_user(request):
    user_id = request.data.get('user')
    
    if user_id is None:
        return Response(status=400, data={'error': 'User ID is missing.'})
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(status=404, data={'error': 'User not found.'})

    serializer = UserSerializer(user)
    return Response(serializer.data)

# ===================================================================
# PUT api/notification/token/
# ulozi mi expo notification token konkretnemu pouzivatelovi
# ===================================================================

@api_view(['PUT'])
@permission_classes([AllowAny])
def notification_token(request):
    if request.method == 'PUT':
        data = request.data
        user_id = data.get('user')
        token = data.get('token')

        if not user_id or not token:
            return Response({"error": "Missing user_id or token"}, status=400)

        try:
            user = User.objects.get(pk=user_id)
            user.expo_push_token = token
            user.save()
            return Response({"message": "Token saved successfully"}, status=200)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
    else:
        return Response({"error": "Invalid request method"}, status=405)
    
# ===================================================================
# PUT api/sendNotification/
# odosle notifikaciu vsetkym pouzivatelom, ktori maju expo no. token
# ===================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def send_test_notification_to_all_users(request):
    users = User.objects.filter(expo_push_token__isnull=False)
    tripName = request.data.get('trip')
    if users.exists():
        message = "Pridana fotka pre destinaciu " + str(tripName) + "!!!"
        for user in users:
            try:
                response = send_push_notification(user.expo_push_token, message)
                if response.status_code != 200:
                    print(f"Error sending notification to user {user.id}: {response.text}")
            except ValidationError as e:
                print(f"Invalid expo push token for user {user.id}: {str(e)}")
    else:
        return JsonResponse({'status': 404, 'message': 'No users with expo_push_token found.'})

    return JsonResponse({'status': 200, 'message': 'Notifications sent to all users.'})

# ===================================================================
# ===================================================================
