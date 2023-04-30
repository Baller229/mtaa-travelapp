import requests
import json

def send_push_notification(expo_push_token, message):
    url = "https://exp.host/--/api/v2/push/send"

    data = {
        "to": expo_push_token,
        "title": "Travel App",
        "body": message,
        "sound": "default",
    }

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
    }

    response = requests.post(url, data=json.dumps(data), headers=headers)

    return response
