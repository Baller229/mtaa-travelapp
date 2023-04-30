import React, { useState } from "react";
import { StyleSheet, Image} from "react-native";
import * as Yup from "yup";
import authApi from '../api/auth';
import Screen from "../components/Screen";
import { Form, FormField, SubmitButton, ErrorMessage} from "../components/forms";

const validationSchema = Yup.object().shape({
  username: Yup.string().required().label("Username"),
  password: Yup.string().required().min(4).label("Password"),
});

function RegisterScreen({ navigation }) {
  const [registerFailed, setRegisterFailed] = useState(false);
  const [error, SetError] = useState();

  const handleSubmit = async ({username, password}) => {
   
    const result = await authApi.register(username, password);

    if(!result.ok)
    { 
      SetError(result.data.password);
      return setRegisterFailed(true);
    } 
    navigation.navigate('Login');
}
  return (
    <Screen style={styles.container}>
       <Image style={styles.logo} source={require("../assets/logoT.png")} />
      <Form
        initialValues={{ username: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
      <ErrorMessage error={error} visible={registerFailed}/>
        <FormField
          autoCorrect={false}
          icon="account"
          name="username"
          placeholder="username"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        <SubmitButton title="Register"/>
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    width: 75,
    height: 100,
    alignSelf: "center",
    marginTop: 60,
    marginBottom: 20,
  },
});

export default RegisterScreen;
