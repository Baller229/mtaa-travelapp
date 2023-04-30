import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListingChat from "../screens/ListingChat";
import Chat from "../screens/Chat";

const Stack = createStackNavigator();

const ChatNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="ListingChat" component={ListingChat}/>
        <Stack.Screen name="Chat" component={Chat}/>
    </Stack.Navigator>
);

export default ChatNavigator;