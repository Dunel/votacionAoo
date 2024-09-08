import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
import { useForm } from "react-hook-form";
import CustomInput from "../components/customInput";
import CustomButton from "../components/customButton";
import CustomSelect from "../components/customSelect";
import { recovery } from "../services/login.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const cedulaRegex = /^[0-9]+$/;

const RecoveryScreen = () => {
    const { isLoading } = useContext(AuthContext);
    const { handleSubmit, control } = useForm();
    const [errors, setErrors] = useState([]);
    const navigation = useNavigation();
  
    const onSubmit = async (data) => {
      try {
        const response = await recovery(data);
        //console.log(response);
        AsyncStorage.setItem("recoveryToken", response);
        navigation.replace("PasswordRecoveryScreen")
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
        <CustomSelect
          control={control}
          name="question"
          rules={{ required: "Este campo es requerido." }}
          items={[
            { label: "¿Cuál es tu comida favorita?", value: "question1" },
            { label: "¿Cuál es tu bebida favorita?", value: "question2" },
            {
              label: "¿Cuál es tu género musical favorito?",
              value: "question3",
            },
          ]}
          placeholder="Pregunta secreta"
        />
        <CustomInput
          name="answer"
          control={control}
          placeholder={"Respuesta secreta"}
          rules={{
            required: "La respuesta es requerida.",
            minLength: {
              value: 4,
              message: "La respuesta debe tener máximo 50 caracteres.",
            },
            maxLength: {
              value: 50,
              message: "La respuesta debe tener máximo 50 caracteres.",
            },
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

export default RecoveryScreen;
