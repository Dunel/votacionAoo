import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);

  const register = (name, email, password) => {
    setIsLoading(true);

    axios
      .post(`${BASE_URL}/register`, {
        name,
        email,
        password,
      })
      .then((res) => {
        let userInfo = res.data;
        setUserInfo(userInfo);
        AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
        setIsLoading(false);
        console.log(userInfo);
      })
      .catch((e) => {
        console.log(`register error ${e}`);
        setIsLoading(false);
      });
  };

  const login = async (data) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `http://192.168.11.118:3000/api/login`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let userInfo = res.data;
      setUserInfo(userInfo);
      AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      return "Usuario o contraseña incorrecta.";
    }
  };

  const logout = () => {
    setIsLoading(true);
    try {
      AsyncStorage.removeItem("userInfo");
      setUserInfo({});
      Alert.alert("Sesión finalizada.", "", [{ text: "OK" }]);
      setIsLoading(false);
    } catch (e) {
      console.log(`logout error ${e}`);
      setIsLoading(false);
    }
  };

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);

      let userInfo = await AsyncStorage.getItem("userInfo");
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        const response = await axios.post(
          `http://192.168.11.118:3000/api/verify-token/check`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        if (response.status === 200) {
          setUserInfo(userInfo);
        } else {
          console.log("1: La sesión ha expirado.");
          setSplashLoading(false);
          logout();
        }
      }

      setSplashLoading(false);
    } catch (error) {
      setSplashLoading(false);
      console.log("2: La sesión ha expirado..");

      logout();
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        splashLoading,
        setIsLoading,
        isLoggedIn,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
