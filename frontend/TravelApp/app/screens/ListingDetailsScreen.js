import React, { useContext, useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions, ActivityIndicator, StatusBar, ScrollView, Alert } from "react-native";
import Carousel from "react-native-snap-carousel";
import MapView, { Marker } from 'react-native-maps';
import colors from "../config/colors";
import listingsApi from "../api/listings";
import ListItem from "../components/lists/ListItem";
import AppText from "../components/Text";
import Button from '../components/Button';
import routes from "../navigation/routes";
import Text from "../components/Text";
import AppButton from "../components/Button";
import AuthContext from "../auth/context";

function ListingDetailsScreen({ navigation, route }) {
  const listing = route.params;
  const tripname = listing.trip_name;
  const { user , setUser } = useContext(AuthContext);
  let [isLoading, setIsLoading] = useState(true);
  let [error, setError] = useState();
  let [response, setResponse] = useState();

  const buyDestination = async ()=> {
    const tripname = response[0].trip_name;
    const currentUser = user.user_id;
    const result = await listingsApi.addReservation(tripname, currentUser);
    if (!result.ok) {
      return alert("Something Went Wrong.")
    }
    Alert.alert("Reserved", "Go to history page", [
      { text: "History", onPress: () => navigation.navigate(routes.HISTORY) },
    ]);
  }

  const getTripDetails = async ()=> {
    const result =  await listingsApi.tripDetails(tripname)

    if (!result.ok) {
      setIsLoading(false);
      setError(error);
    }
    setIsLoading(false);
    setResponse(result.data);
  }

  useEffect(() => {
      getTripDetails();
  }, []);

  const renderImage = ({ item }) => (
    <Image style={styles.image} source={{ uri: item }} />
  );

  const getContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" />;
    }
    
    if (error) {
      return <Text>{error}</Text>
    }
    
   if (response && response.length > 0)
    { 
      return (
        <ScrollView>
          {listing.error && (
            <>
              <AppText>Could not retrieve the listings.</AppText>
              <Button title="Retry" onPress={listing.request}></Button>
            </>
          )}
          <Carousel
            data={response[0].trip_urls}
            renderItem={renderImage}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width}
          />
          <View style={styles.detailsContainer}>   
              <>
                <Text style={styles.title}>{response[0].trip_name}</Text>
                <Text style={styles.price}>${response[0].trip_price}</Text>
              </>
            <View style={styles.userContainer}>
              <ListItem
                title="Description"
                subTitle={response[0].trip_specs}
              />
            </View>
              <View style={styles.userContainer}>
              <Text style={styles.title}>Map</Text>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: response[0].latitude,
                  longitude: response[0].longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{ 
                    latitude: response[0].latitude,
                    longitude: response[0].longitude 
                  }}
                  title={response[0].trip_name}      
                />
              </MapView>
             </View>
             <View style={styles.userContainer}>
                  <AppButton title="Buy" onPress={buyDestination}/>
             </View>
          </View>
        </ScrollView>
      );
    }
  };

  return (
    <View style={styles.container}>
      {getContent()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,   
  },
  image: {
    width: "100%",
    height: 300,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  userContainer: {
    marginVertical: 40, 
  },
    map: {
      width: 375,
      height: 300
    },
});

export default ListingDetailsScreen;