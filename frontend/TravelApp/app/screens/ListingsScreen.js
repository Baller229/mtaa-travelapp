import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import Card from "../components/Card";
import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import listingsApi from "../api/listings";
import AppText from "../components/Text";
import Button from '../components/Button';
import useApi from "../hooks/useApi";


function ListingsScreen({ navigation }) {
  const getListingsApi = useApi(listingsApi.getListings)

  useEffect(() => {
    getListingsApi.request();
  }, []);

  return (
    <Screen style={styles.screen}>
      {getListingsApi.error && <>
        <AppText>Could not retrieve the listings.</AppText>
        <Button title="Retry" onPress={getListingsApi.request}></Button>
      </>}
      <FlatList
        data={getListingsApi.data}
        keyExtractor={(listing) => listing.id.toString()}
        renderItem={({ item }) => (
          <Card
            title={item.trip_name} 
            subTitle={"$" + item.trip_price}
            image={item.trip_urls[0]}
            onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: colors.light,
  },
});

export default ListingsScreen;
