import React, { useContext, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useForm } from "react-hook-form";
import CustomInput from "../components/customInput";
import CustomButton from "../components/customButton";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import CustomSelect from "../components/customSelect";
import { useNavigation } from "@react-navigation/native";

const cedulaRegex = /^[0-9]+$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*./=\\])[A-Za-z\d@#$%&*./=\\]{8,}$/;

const UpdateVoterScreen = () => {
  const { handleSubmit, control, setValue, watch } = useForm();
  const navigation = useNavigation();
  const { userInfo, setIsLoading, logout } = useContext(AuthContext);
  const pwd = watch("password");

  const handleSearchCedula = async (data) => {
    try {
      const res = await axios.get(
        `http://192.168.11.118:3000/api/user/${data.cedula}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      const foundVoterData = res.data;
      console.log(foundVoterData);
      if (foundVoterData) {
        setValue("nombre", foundVoterData.nombre);
        setValue("apellido", foundVoterData.apellido);
        setValue("nacionalidad", foundVoterData.nacionalidad);
      } else {
        Alert.alert(
          "Cédula no encontrada",
          "No se encontró un votante con la cédula proporcionada."
        );
      }
    } catch (error) {
      console.error("Error al buscar votante:", error);
      Alert.alert("Error", "Ocurrió un error al buscar el votante.");
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.put(`http://192.168.11.118:3000/api/user/${data.cedula}`,{
        data
      },{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      })
      Alert.alert("USUARIO ACTUALIZADO.", "", [
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
        name="cedula"
        control={control}
        placeholder={"Cédula"}
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
      <CustomButton
        text="Buscar Votante"
        onPress={handleSubmit(handleSearchCedula)}
      />
      <>
      <CustomInput
        name="nombre"
        control={control}
        placeholder={"Nombres"}
        rules={{
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
        <CustomSelect
        control={control}
        name="nacionalidad"
        items={[
          { label: "Venezolano (V)", value: "V" },
          { label: "Extranjero (E)", value: "E" },
        ]}
        placeholder="Seleccione su nacionalidad"
      />
        <CustomInput
          name="password"
          control={control}
          placeholder={"Contraseña"}
          secureTextEntry
          rules={{
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
        <CustomButton
          text="Actualizar Votante"
          onPress={handleSubmit(onSubmit)}
        />
      </>
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
});

export default UpdateVoterScreen;
