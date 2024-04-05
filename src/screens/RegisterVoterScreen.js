import React, { useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useForm } from "react-hook-form";
import CustomInput from "../components/customInput";
import CustomSelect from "../components/customSelect";
import CustomButton from "../components/customButton";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*./=\\])[A-Za-z\d@#$%&*./=\\]{8,}$/;
const cedulaRegex = /^[0-9]+$/;


const RegisterVoterScreen = () => {
  const { userInfo, setIsLoading, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const { handleSubmit, control, watch } = useForm();
  const pwd = watch("password");

  const onSubmit = (data) => {
    try {
      const res = axios.post(
        "http://192.168.11.118:3000/api/user/create",
        {
          data,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      Alert.alert("USUARIO REGISTRADO.", "", [
        { text: "OK" },
      ]);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <CustomInput
        name="nombre"
        control={control}
        placeholder={"Nombres"}
        rules={{
          required: "El nombre es requerido",
          minLength: {
            value: 3,
            message: "El nombre debe tener maximo 24 caracteres.",
          },
          maxLength: {
            value: 24,
            message: "El nombre debe tener maximo 24 caracteres.",
          },
        }}
      />
      <CustomInput
        name="apellido"
        control={control}
        placeholder={"Apellidos"}
        rules={{
          required: "Los apellidos son requeridos.",
          minLength: {
            value: 3,
            message: "Los apellidos deben tener maximo 24 caracteres.",
          },
          maxLength: {
            value: 24,
            message: "Los nombres deben tener maximo 24 caracteres.",
          },
        }}
      />
      <CustomInput
        name="cedula"
        control={control}
        placeholder={"Cedula"}
        rules={{
          required: "La cedula es requerida.",
          minLength: {
            value: 3,
            message: "La cedula debe tener maximo 9 caracteres.",
          },
          maxLength: {
            value: 9,
            message: "La cedula debe tener maximo 32 caracteres.",
          },
          pattern: {
            value: cedulaRegex,
            message: "Solo se admiten numeros en este campo.",
          },
        }}
      />
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
      <CustomSelect
        control={control}
        name="nacionalidad"
        rules={{ required: "Este campo es requerido" }}
        items={[
          { label: "Venezolano (V)", value: "V" },
          { label: "Extranjero (E)", value: "E" },
        ]}
        placeholder="Seleccione su nacionalidad"
      />
      <CustomButton text="REGISTRAR" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginHorizontal: 30,
    flex: 1,
    padding: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  picker: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
  },
  errorContainer: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
  errorText: {
    color: "#721c24",
  },
});

export default RegisterVoterScreen;
