import React, { useContext, useState } from "react";
import { StyleSheet, Image } from "react-native";
import * as Yup from "yup";
import jwtDecode from "jwt-decode";
import authApi from '../api/auth';
import Screen from "../components/Screen";
import { ErrorMessage, Form, FormField, SubmitButton } from "../components/forms";
import AuthContext from "../auth/context";
import useAuth from "../auth/useAuth";

const validationSchema = Yup.object().shape({
  username: Yup.string().required().min(2).label("Username"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen(props) {
  const auth = useAuth();
  const authContext = useContext(AuthContext);
  const [loginFailed, setLoginFailed] = useState(false);
 
  const handleSubmit = async ({username, password}) => {

    const result = await authApi.login(username, password);
    
    if(!result.ok)
    {
      return setLoginFailed(true);
    }
    setLoginFailed(false);
    auth.logIn(result.data.access);
}
  return (
    <Screen style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logoT.png")} />
      <Form
        initialValues={{ username: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <ErrorMessage error="Invalid email or password" visible={loginFailed}/>
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="account"
          name="username"
          placeholder="username"
          textContentType="username"
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
        <SubmitButton title="Login"/>
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

export default LoginScreen;
