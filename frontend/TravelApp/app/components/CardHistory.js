import React from "react";
import { View, StyleSheet, Image } from "react-native";

import Text from "./Text";
import colors from "../config/colors";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

function CardHistory({ title, subTitle, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.card}>
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subTitle} numberOfLines={2}>
          {subTitle}
        </Text>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginBottom: 20,
   
    overflow: "hidden",
  },
  detailsContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  image: {
    width: "100%",
    height: 200,
  },
  subTitle: {
    color: colors.danger,
    fontWeight: "bold",
  },
  title: {
    // marginBottom: 7,
  },
});

export default CardHistory;
