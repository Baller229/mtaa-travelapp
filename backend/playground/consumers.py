import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import Q
from .logger import dbg


Message = None
User = None

def get_models():
    global Message
    global User
    if Message is None or User is None:
        from django.apps import apps
        Message = apps.get_model('playground', 'Message')
        User = apps.get_model('playground', 'User')

class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        get_models()

# =====================================================================
#   CONNECT NEW CLIENT
# =====================================================================

    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.recipient_id = self.scope['url_route']['kwargs']['recipient_id']
        users_sorted = sorted([int(self.user_id), int(self.recipient_id)])
        self.room_group_name = f'chat_{users_sorted[0]}_{users_sorted[1]}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        dbg("group name:", self.room_group_name, "new client accepted")
        await self.accept()

        old_messages = await self.load_old_messages(self.user_id, self.recipient_id)
        print("Old messages:", old_messages)
        old_messages_serializable = [
            {
                'id': msg['id'],
                'sender': msg['sender'],
                'recipient': msg['recipient'],
                'content': msg['content'],
                'timestamp': msg['timestamp'].strftime('%Y-%m-%dT%H:%M:%S.%f%z')
            }
            for msg in old_messages
        ]
        await self.send(text_data=json.dumps({
            'old_messages': old_messages_serializable
        }))

# =====================================================================
#   DISCONNECT CLIENT
# =====================================================================

    async def disconnect(self, code):
        dbg(code, "client disconnected")

# =====================================================================
#   RECIEVE MESSAGE
# =====================================================================

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender_id = text_data_json['sender']
        dbg(message, self.user_id, sender_id, "recieve")

        # =====================================================================
        #   SAVE MESSAGE TO DATABASE WITH SENDER AND RECIPIENT ID
        # =====================================================================

        await self.save_message(sender_id, self.user_id, message)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender_id
            }
        )

# =====================================================================
#   SEND MESSAGE
# =====================================================================

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender
        }))

# =====================================================================
#   SAVE MESSAGE DATABASE VIEW
# =====================================================================

    @database_sync_to_async
    def save_message(self, sender_id, recipient_id, message):
        dbg("save_message")
        sender = User.objects.get(id=sender_id)
        recipient = User.objects.get(id=recipient_id)
        message = Message(sender=sender, recipient=recipient, content=message)
        message.save()

# =====================================================================
#   LOAD ALL PREVIOUS MESSAGES FROM DATABASE VIEW
# =====================================================================

    @database_sync_to_async
    def load_old_messages(self, user_id, recipient_id):
        messages = Message.objects.filter(
            (Q(sender__id=user_id) & Q(recipient__id=recipient_id)) | (Q(sender__id=recipient_id) & Q(recipient__id=user_id))
        ).order_by('timestamp')
        return [
            {
                'id': message.id,
                'message': message.content,
                'sender': message.sender.id,
                'recipient': message.recipient.id,
                'content': message.content,
                'timestamp': message.timestamp
            }
            for message in messages
        ]