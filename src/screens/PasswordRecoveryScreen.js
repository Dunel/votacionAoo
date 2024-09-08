import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
import { useForm } from "react-hook-form";
import CustomInput from "../components/customInput";
import CustomButton from "../components/customButton";
import { Passwordrecovery } from "../services/login.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*./=\\])[A-Za-z\d@#$%&*./=\\]{8,}$/;
const cedulaRegex = /^[0-9]+$/;

const PasswordRecoveryScreen = () => {
    const { isLoading } = useContext(AuthContext);
    const { handleSubmit, control, watch } = useForm();
    const [errors, setErrors] = useState([]);
    const navigation = useNavigation();
    const pwd = watch("password");
  
    const onSubmit = async (data) => {
      try {
        let token = await AsyncStorage.getItem("recoveryToken");
        console.log(new Date())
        const response = await Passwordrecovery(data, token);
        console.log(response);
        AsyncStorage.removeItem("recoveryToken");
        Alert.alert("RECUPERACIÓN FINALIZADA.", "", [{ text: "OK" }]);
        navigation.popToTop();
      } catch (error) {
        //console.error(error);
        if (Array.isArray(error)) {
          setErrors(error);
        } else {
          setErrors([error]);
        }
        console.log("error: ", error);
      }
    };
  
    return (
      <View style={styles.container}>
        <Spinner visible={isLoading} />
        <CustomInput
          name="password"
          control={control}
          placeholder={"Contraseña"}
          secureTextEntry
          rules={{
            required: "La contraseña es requerida.",
            minLength: {
              value: 7,
              message: "La contraseña debe tener almenos 8 caracteres.",
            },
            maxLength: {
              value: 32,
              message: "La contraseña debe tener maximo 32 caracteres.",
            },
            pattern: {
              value: passwordRegex,
              message:
                "La contraseña debe tener al menos 8 caracteres e incluir al menos una letra mayúscula, un dígito y un carácter especial entre los siguientes: @, #, $, %, &, *, ., /, =",
            },
          }}
        />
        <CustomInput
          name="password2"
          control={control}
          placeholder={"Confirmar contraseña"}
          secureTextEntry
          rules={{
            validate: (value) => value === pwd || "Password do not match",
          }}
        />
        {errors.length > 0 && (
          <View>
            {errors.map((error, index) => (
              <Text key={index} style={styles.error}>
                {error.message}
              </Text>
            ))}
          </View>
        )}
        <CustomButton text="Recuperar Contraseña" onPress={handleSubmit(onSubmit)} />
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 5,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default PasswordRecoveryScreen;
