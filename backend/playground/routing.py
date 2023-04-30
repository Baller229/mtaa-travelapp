from django.urls import re_path

from playground import consumers

websocket_urlpatterns = [ 
    # WS
    re_path(r'^ws/chat/(?P<user_id>\d+)/(?P<recipient_id>\d+)/$', consumers.ChatConsumer.as_asgi())
]