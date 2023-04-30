import React, { useContext } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import { ListItem } from "../components/lists";
import colors from "../config/colors";
import Icon from "../components/Icon";
import Screen from "../components/Screen";
import AuthContext from "../auth/context";


function AccountScreen(props) {
  const { user , setUser } = useContext(AuthContext);
  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          subTitle="developed by: pato & juro"
        />
      </View>
      <View style={styles.container}>

      </View>
      <ListItem
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor="#FF899E" />}
        onPress={() => setUser(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;
