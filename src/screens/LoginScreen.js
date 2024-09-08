import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
import { useForm } from "react-hook-form";
import CustomInput from "../components/customInput";
import CustomButton from "../components/customButton";
import CustomSelect from "../components/customSelect";
import { Link } from "@react-navigation/native";

const cedulaRegex = /^[0-9]+$/;

const LoginScreen = () => {
  const { isLoading, login } = useContext(AuthContext);
  const { handleSubmit, control } = useForm();
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      if (response) {
        setError(response);
      }
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <Image
        style={styles.logo}
        source={require("../../assets/LOGO_APP_2.png")}
      />
      <CustomSelect
        control={control}
        name="nacionalidad"
        rules={{ required: "Este campo es requerido." }}
        items={[
          { label: "Venezolano (V)", value: "V" },
          { label: "Extranjero (E)", value: "E" },
        ]}
        placeholder="Seleccione su Nacionalidad"
      />
      <CustomInput
        name="cedula"
        control={control}
        placeholder={"Cédula de Identidad"}
        rules={{
          required: "La cédula es requerida.",
          minLength: {
            value: 1,
            message: "La cédula debe tener máximo 9 caracteres.",
          },
          maxLength: {
            value: 9,
            message: "La cédula debe tener máximo 9 caracteres.",
          },
          pattern: {
            value: cedulaRegex,
            message: "Solo se admiten números en este campo.",
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
            value: 8,
            message: "La contraseña debe tener al menos 8 caracteres.",
          },
          maxLength: {
            value: 32,
            message: "La contraseña debe tener máximo 32 caracteres.",
          },
        }}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <CustomButton text="Iniciar Sesión" onPress={handleSubmit(onSubmit)} />
      <Link style={styles.link} to={{ screen: "RecoveryScreen" }}>Recuperar Contraseña</Link>
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
    marginBottom: 10,
  },
  link:{
    marginTop: 10,
    color: "blue",
  }
});

export default LoginScreen;
