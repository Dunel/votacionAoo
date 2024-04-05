import axios from "axios";
import { getData } from "./storage";

export const fetchUserData = async (setUserData, setError, setIsAdmin, navigation) => {
  try {
    const token = await getData("token");

    if (!token) {
      navigation.navigate("Login");
      return;
    }

    const adminRoute = "http://192.168.11.118:3000/api/verify-token/admin";
    const userRoute = "http://192.168.11.118:3000/api/verify-token";

    let response;
    try {
      response = await axios.post(
        adminRoute,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setIsAdmin(true);
    } catch (adminError) {
      try {
        response = await axios.post(
          userRoute,
          {},
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
      } catch (userError) {
        setError(userError);
        return;
      }
    }

    setUserData(response.data);
  } catch (error) {
    setError(error);
  }
};
