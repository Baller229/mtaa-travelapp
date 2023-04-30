import React, { useContext, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, ActivityIndicator, StatusBar } from "react-native";

import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import listingsApi from "../api/listings";
import AppText from "../components/Text";
import Button from '../components/Button';
import AuthContext from "../auth/context";
import CardHistory from "../components/CardHistory";

function ListingHistory({ navigation }) {
  const scrollViewRef = useRef(null);
  const { user , setUser } = useContext(AuthContext);
  const [historyData, setHistoryData] = useState();
  let [isLoading, setIsLoading] = useState(true);
  let [isDisconnected, setIsDisconnected] = useState(false);
  
  const getHistory = async ()=> {
    const result =  await listingsApi.getListingsHistory(user.user_id)
    if (!result.ok) {
      setIsDisconnected(true);
      return alert("Check the internet connection.");
    }
    setIsDisconnected(false);
    setHistoryData(result.data);
    setIsLoading(false);
  }

  useEffect(() => {
    getHistory();
  }, []);

  const getContent = () => {

    if (isLoading) {
      if(isDisconnected) {
        return (
          <>
            <AppText>Could not retrieve the listings.</AppText>
            <Button title="Retry" onPress={getHistory}></Button>
          </>
        );
      }
      else
      {
        return <ActivityIndicator size="large" />;  
      }
    }

    if(historyData !== undefined)
    {
      return (
          <FlatList
            data={historyData}
            keyExtractor={(listing) => listing.trip_id.toString()}
            renderItem={({ item }) => (
              <CardHistory
                title={item.custom_trip_name} 
                subTitle={"$" + item.trip_price}
                onPress={() => navigation.navigate(routes.LISTING_EDIT, item)}
              />
            )}
            onRefresh={getHistory} 
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

export default ListingHistory;