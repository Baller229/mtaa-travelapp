import React, { useEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

const Chat = ({ route }) => {
  const { currentUser, targetUser } = route.params;
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = new WebSocket(`ws://192.168.1.191:8000/ws/chat/${targetUser}/${currentUser}/`);
    setSocket(newSocket);

    newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.old_messages) {
            const oldMessages = data.old_messages.map(msg => ({
                _id: msg.id,
                text: msg.content,
                createdAt: new Date(msg.timestamp),
                user: { _id: msg.sender }
            })).reverse();
            setMessages((prevMessages) => GiftedChat.append(prevMessages, oldMessages));
        } else {
            setMessages((prevMessages) => GiftedChat.append(prevMessages, {
                _id: Math.random().toString(),
                text: data.message,
                createdAt: new Date(),
                user: { _id: data.sender }
            }));
        }
    };

    newSocket.onclose = (event) => {
      console.log('WebSocket closed:', event);
    };

    return () => newSocket.close();
  }, [targetUser]);

  const onSend = (newMessages = []) => {
    socket.send(JSON.stringify({
        message: newMessages[0].text,
      sender: currentUser
    }));
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{ _id: currentUser }}
    />
  );
};

export default Chat;
