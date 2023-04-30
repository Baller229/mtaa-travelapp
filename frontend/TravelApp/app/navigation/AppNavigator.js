import React, { useState, useContext, useEffect } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ListingsScreen from '../screens/ListingsScreen';
import ListingHistory from '../screens/ListingHistory';
import ListingChat from '../screens/ListingChat';
import ListingsEditScreen from '../screens/ListingEditScreen';
import AccountScreen from '../screens/AccountScreen';
import FeedNavigator from './FeedNavigator';
import HistoryNavigator from './HistoryNavigator';
import colors from "../config/colors";
import ChatNavigator from './ChatNavigator';
import AuthContext from "../auth/context";
import listingsApi from "../api/listings";
import * as Notifications from 'expo-notifications';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { user, setUser } = useContext(AuthContext);
  const [userToken, SetToken] = useState();
  
  const setUserToken = async () => {
    const result = await listingsApi.putNotificationToken(userToken, user.user_id);
    if (!result.ok) {
      return alert("Something Went Wrong.");
    }
  };
  
  useEffect(() => {
    registerForPushNotifications();
  }, []);
  
  useEffect(() => {
    if (userToken) {
      setUserToken();
    }
  }, [userToken]);
  
  const registerForPushNotifications = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          return;
        }
      }
  
      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;
      SetToken(token);
    } catch (error) {
      console.log("Error getting a push token", error);
    }
  };
  
  return (
    <Tab.Navigator>
        <Tab.Screen name="Feed" component={FeedNavigator}  options={{headerShown: false, tabBarIcon: ({focused}) => (
      <MaterialCommunityIcons
        name={"home"}
        color={focused ? colors.primary : "grey"}
        size={28}
      />
    )}} ></Tab.Screen>
        {/* <Tab.Screen name="ListingEdit" component={ListingsEditScreen}></Tab.Screen> */}
        <Tab.Screen name="Listings" component={HistoryNavigator} options={{headerShown: false, tabBarIcon: ({focused}) => (
      <MaterialCommunityIcons
        name={"history"}
        color={focused ? colors.primary : "grey"}
        size={28}
      />
    )}} ></Tab.Screen>

        <Tab.Screen name="Chats" component={ChatNavigator} options={{headerShown: false, tabBarIcon: ({focused}) => (
      <MaterialCommunityIcons
        name={"chat-processing-outline"}
        color={focused ? colors.primary : "grey"}
        size={28}
      />
    )}} ></Tab.Screen>

        <Tab.Screen name="Account" component={AccountScreen} options={{tabBarIcon: ({focused}) => (
      <MaterialCommunityIcons
        name={"account"}
        color={focused ? colors.primary : "grey"}
        size={28}
      />
    )}} ></Tab.Screen>
    </Tab.Navigator>
);
};

export default AppNavigator;