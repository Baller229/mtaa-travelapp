import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListingHistory from "../screens/ListingHistory";
import ListingEditScreen from "../screens/ListingEditScreen";

const Stack = createStackNavigator();

const HistoryNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="ListingHistory" component={ListingHistory}/>
        <Stack.Screen name="ListingEdit" component={ListingEditScreen}/>
    </Stack.Navigator>
);

export default HistoryNavigator;