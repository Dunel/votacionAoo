import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Button,
  ScrollView,
  Text,
} from "react-native";
import { useForm } from "react-hook-form";
import CustomInput from "../components/customInput";
import CustomButton from "../components/customButton";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import CustomSelect from "../components/customSelect";
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomInputNat from "../components/customInputNat";

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*./=\\])[A-Za-z\d@#$%&*./=\\]{8,}$/;

const UpdateVoterScreen = () => {
  const { handleSubmit, control, setValue, watch } = useForm();
  const navigation = useNavigation();
  const route = useRoute();
  const { userInfo } = useContext(AuthContext);
  const { cedula } = route.params;
  const [date, setDate] = useState(new Date(""));
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [showInputs, setShowInputs] = useState(false);
  const pwd = watch("password");

  const formattedDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchEstados = async () => {
    try {
      const res = await axios.get(
        `https://node.appcorezulia.lat/api/venezuela/estados`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      //console.log(res.data);
      setEstados(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMunicipios = async (estado) => {
    try {
      if (estado == "") {
        setParroquias([]);
        setMunicipios([]);
        return;
      }

      const res = await axios.get(
        `https://node.appcorezulia.lat/api/venezuela/estados/${estado}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setParroquias([]);
      setMunicipios(res.data);
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const handleParroquias = async (municipio) => {
    try {
      const res = await axios.get(
        `https://node.appcorezulia.lat/api/venezuela/municipio/${municipio}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      //console.log(res.data);
      //setParroquias([])
      setParroquias(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCedula = async (data) => {
    try {
      const res = await axios.get(
        `https://node.appcorezulia.lat/api/user/${data}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      const foundVoterData = res.data;
      //console.log(foundVoterData);
      setValue("cedula", foundVoterData.cedula);
      setValue("fullname", foundVoterData.fullname);
      setValue("nacionalidad", foundVoterData.nacionalidad);
      setValue("birthdate", formattedDate(foundVoterData.birthdate));
      setDate(foundVoterData.birthdate)
      setValue("estadoId", foundVoterData.estadoId);
      setValue("municipioId", foundVoterData.municipioId);
      setValue("parroquiaId", foundVoterData.parroquiaId);
      setValue("question", foundVoterData.question);
      setValue("answer", foundVoterData.answer);
    } catch (error) {
      console.error("Error al buscar votante:", error.response.data);
      Alert.alert("Error al buscar votante:", error.response.data.message);
    }
  };

  const dateValidator = (value) => {
    const dateFormatRegex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (!value.match(dateFormatRegex)) {
      return "Ingrese una fecha válida en el formato DD/MM/YYYY";
    }

    const [day, month, year] = value.split("/");

    // Crear la fecha en la zona horaria local
    const selectedDate = new Date(`${year}-${month}-${day}T00:00:00`);
    const offset = -4; // GMT -4 para Venezuela
    const localTime = selectedDate.getTime();
    const localOffset = selectedDate.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const caracasTime = new Date(utc + 3600000 * offset);

    // Calcular la fecha mínima para tener al menos 18 años
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 18);

    if (caracasTime > minDate) {
      return "Debes tener al menos 18 años para registrarte";
    }
    setDate(caracasTime); 
    return true;
  };

  const onSubmit = async (data) => {
    try {
      const user = {
        ...data,
        birthdate: date,
      }
      const res = await axios.put(
        `https://node.appcorezulia.lat/api/user/`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      Alert.alert("VOTANTE MODIFICADO.", "", [{ text: "OK" }]);
      navigation.goBack();
    } catch (error) {
      console.log(error.response.data);
      Alert.alert("ERROR AL MODIFICAR.", "" + error.response.status, [
        { text: "OK" },
      ]);
    }
  };

  useEffect(() => {
    fetchEstados();
    fetchCedula(cedula);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.Title}>{cedula}</Text>
        <CustomSelect
          name="nacionalidad"
          control={control}
          items={[
            { label: "Venezolano (V)", value: "V" },
            { label: "Extranjero (E)", value: "E" },
          ]}
          placeholder="Seleccione su Nacionalidad"
        />
        <CustomInput
          name="fullname"
          control={control}
          placeholder={"Nombre Completo"}
          rules={{
            required: "El nombre completo es requerido",
            minLength: {
              value: 5,
              message: "El nombre debe tener maximo 50 caracteres.",
            },
            maxLength: {
              value: 50,
              message: "El nombre debe tener maximo 50 caracteres.",
            },
          }}
        />
        <CustomInputNat
          name="birthdate"
          control={control}
          placeholder={"Fecha de Nacimiento (DD/MM/YYYY)"}
          rules={{
            required: "La fecha de nacimiento es requerida",
            pattern: {
              value: /^[0-9/]*$/,
              message: "Ingrese una fecha válida en el formato DD/MM/YYYY",
            },
            validate: dateValidator,
          }}
          onChangeText={dateValidator}
        />
        <CustomSelect
          control={control}
          name="estadoId"
          rules={{ required: "Este campo es requerido." }}
          items={estados.map((e) => ({
            label: e.estado,
            value: e.id,
          }))}
          placeholder="Estado de Residencia"
          onStateChange={handleMunicipios}
        />
        <CustomSelect
          control={control}
          name="municipioId"
          rules={{ required: "Este campo es requerido." }}
          items={municipios.map((e) => ({
            label: e.municipio,
            value: e.id,
          }))}
          placeholder="Municipio de Residencia"
          onStateChange={handleParroquias}
        />
        <CustomSelect
          control={control}
          name="parroquiaId"
          rules={{ required: "Este campo es requerido." }}
          items={parroquias.map((e) => ({
            label: e.parroquia,
            value: e.id,
          }))}
          placeholder="Parroquia de Residencia"
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
        <CustomButton
          text="Modificar Votante"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 50,
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  Title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
});

export default UpdateVoterScreen;
