from django.urls import path
from . import views
from playground import consumers

# URLConf
urlpatterns = [
    
    #1 GET
    path('destinations/', views.destinations_list),
    #2 POST
    path('destinations/specs/', views.specs_list),
    #3 GET
    path('<str:trip_name>/dates/', views.date_list),
    #4 POST
    path('reserve/', views.add_reserved_destination),
    #5 GET
    path('<int:pk>/payment/', views.payment_list),
    #6 POST
    path('history/', views.history_list),
    #7 DELETE
    path('removereservation/', views.add_remove_destination),
    #8 PUT
    path('destinations/image/', views.add_destination_image),
    #9 POST
    path('users/all/', views.all_users),
    #10 POST
    path('users/current/', views.current_user),
    #11 PUT
    path('notification/token/', views.notification_token),
    #12 POST
    path('sendNotification/', views.send_test_notification_to_all_users),
]
