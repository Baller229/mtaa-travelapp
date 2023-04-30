import React, { useContext, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, ActivityIndicator, StatusBar } from "react-native";

import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import listingsApi from "../api/listings";
import AuthContext from "../auth/context";
import CardHistory from "../components/CardHistory";

function ListingChat({ navigation }) {
  const scrollViewRef = useRef(null);
  const { user , setUser } = useContext(AuthContext);
  const [usersData, setUsersData] = useState();
  const [meData, setMeData] = useState();
  let [isLoading, setIsLoading] = useState(true);
  const [scrolling, setScrolling] = useState(false);
  
  const getUsers = async ()=> {
    const result =  await listingsApi.getListingsUsers(user.user_id)
    if (!result.ok) {
      return alert("Check the internet connection.");
    }
    setUsersData(result.data);
  }

  const getMe = async ()=> {
    const result =  await listingsApi.getCurrentUser(user.user_id)
    if (!result.ok) {
      return alert("Check the internet connection.");
    }
    setMeData(result.data);
    setIsLoading(false);
  }

  useEffect(() => {
    getUsers();
    getMe();
  }, []);

  const getContent = () => {

    if (isLoading) {
      return <ActivityIndicator size="large" />;
    }

    if(usersData !== undefined)
    {
      return (
          <FlatList
            data={usersData}
            keyExtractor={(listing) => listing.id.toString()}
            renderItem={({ item }) => (
              <CardHistory
                title={item.username} 
                subTitle={item.is_active ? "active" : "offline"}
                onPress={() => navigation.navigate(routes.CHAT, {
                               currentUser: meData.id,
                               targetUser: item.id
                        })}
              />
            )}
            onRefresh={() => {
              getUsers();
              getMe();
            }}
            refreshing={isLoading}
          />
      );
    }
  };

  return ( 
    <Screen style={styles.screen}>
      {getContent()}
      <StatusBar style="auto" />
    </Screen>  
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: colors.light,
  },
});

export default ListingChat;
