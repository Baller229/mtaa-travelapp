import React, { useState, useContext } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";
import listingApi from '../api/listings';
import AuthContext from "../auth/context";
import {
  Form,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import FormImagePicker from "../components/forms/FormImagePicker";
import DeleteButton from "../components/DeleteButton";

const validationSchema = Yup.object().shape({
  images: Yup.array().min(1, "Please select at least one image."),
});


function ListingEditScreen( { route } ) {
  const trip = route.params;
  const { user, setUser } = useContext(AuthContext);
  const [tripId, setTripId] = useState(trip.trip_id);

  const sendNotification = async () => {
    const result = await listingApi.notificationHandler(trip.custom_trip_name);
    if (!result.ok) {
      return alert("Something Went Wrong.");
    }
  };

  const removeTrip = async () => {
    const result = await listingApi.deleteTrip(trip.custom_trip_name, user.user_id);
    if (!result.ok) {
      return alert("Something Went Wrong.");
    }
    alert("Deleted ", trip.custom_trip_name);
  };

  const handleSubmit = async ( listing, trip )=> {
     const img = listing.images[0];
     const result = await listingApi.addListing({img}, tripId)
    if (!result.ok) {
      return alert("Could not save the listing.");
    }
    sendNotification();
    alert("Success");
  }

  return (
    <Screen style={styles.container}>
      <Form
        initialValues={{
     
          images: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="images" />
        <SubmitButton title="Add image" />
        <DeleteButton title="Delete Trip" onPress={removeTrip}/> 
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default ListingEditScreen;
