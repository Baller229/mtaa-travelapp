import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from playground import routing as playground_routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "travelapp.settings")

django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            playground_routing.websocket_urlpatterns
        )
    ),
})