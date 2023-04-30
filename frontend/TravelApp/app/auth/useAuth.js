import { useContext } from "react";
import jwtDecode from "jwt-decode";
import AuthContext from "./context";


export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = (authToken) => {
    const user = jwtDecode(authToken);
    setUser(user);
  };

  const logOut = () => {
    setUser(null);
  };
  
  return { user, logIn, logOut };
};