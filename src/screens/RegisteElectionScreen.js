import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Alert, Text, Button, Keyboard } from "react-native";
import { useForm } from "react-hook-form";
import CustomInput from "../components/customInput";
import CustomButton from "../components/customButton";
import axios from "axios";
import DatePicker from "react-native-neat-date-picker";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import CustomSelect from "../components/customSelect";
import {
  fetchEstados,
  fetchMunicipios,
  fetchParroquias,
} from "../services/venezuela.service";

const RegisterElectionScreen = () => {
  const { handleSubmit, control, setValue } = useForm();
  const navigation = useNavigation();
  const { userInfo } = useContext(AuthContext);
  const [showDatePickerRange, setShowDatePickerRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [Estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [selectedPlaceType, setSelectedPlaceType] = useState(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  const openDatePickerRange = () => {
    Keyboard.dismiss();
    setShowDatePickerRange(true)
  };

  const onCancelRange = () => setShowDatePickerRange(false);

  const onConfirmRange = (output) => {
    console.log(output);
    setShowDatePickerRange(false);
    setStartDate(output.startDate);
    setEndDate(output.endDate);
  };

  const estados = async () => {
    try {
      const estados = await fetchEstados(userInfo.token);
      setEstados(estados);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMunicipios = async (estadoId) => {
    try {
      if (!estadoId) {
        setParroquias([]);
        setMunicipios([]);
        return;
      }

      const municipios = await fetchMunicipios(estadoId, userInfo.token);
      setParroquias([]);
      setMunicipios(municipios);
    } catch (error) {
      console.log(error);
    }
  };

  const handleParroquias = async (municipioId) => {
    try {
      const parroquias = await fetchParroquias(municipioId, userInfo.token);
      setParroquias(parroquias);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    const requestData = {
      startDate,
      endDate,
      ...data,
      typeId: selectedPlaceId,
    };
    try {
      if (!startDate || !endDate) {
        return Alert.alert(
          "Error de fecha",
          "Debe registrar una fecha valida."
        );
      }
      const res = await axios.post(
        `https://node.appcorezulia.lat/api/election`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      navigation.replace("PostulationsRegisterScreen", { electionId: res.data.id });
    } catch (error) {
      console.log(error.response.data);
      Alert.alert("Error", "Ocurrió un error al registrar la elección.");
    }
  };

  useEffect(() => {
    estados();
  }, []);

  const handlePlaceTypeChange = (value) => {
    setValue("estadoId", 0);
    setMunicipios([]);
    setParroquias([]);
    setSelectedPlaceType(value);
    setSelectedPlaceId(0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <CustomInput
          name="title"
          control={control}
          placeholder={"Título"}
          rules={{
            required: "El título es requerido.",
            minLength: {
              value: 5,
              message: "El titulo debe tener minimo 5 caracteres.",
            },
            maxLength: {
              value: 24,
              message: "El titulo debe tener maximo 50 caracteres.",
            },
          }}
        />
        <CustomInput
          name="description"
          control={control}
          placeholder={"Descripción (Opcional)"}
        />
        {/* Date Range */}
        <CustomButton
          text={"SELECCIONAR AMBAS FECHAS"}
          onPress={openDatePickerRange}
        />
        <DatePicker
          isVisible={showDatePickerRange}
          mode={"range"}
          onCancel={onCancelRange}
          onConfirm={onConfirmRange}
        />
        <Text>
          {startDate &&
            `${new Date(startDate).toLocaleDateString()} ~ ${new Date(
              endDate
            ).toLocaleDateString()}`}
        </Text>
        <CustomSelect
          control={control}
          name="active"
          rules={{ required: "Este campo es requerido." }}
          items={[
            { label: "Activa", value: "active" },
            { label: "Inactiva", value: "inactive" },
          ]}
          placeholder="Estado de la elección"
        />
        <CustomSelect
          control={control}
          name="type"
          rules={{ required: "Este campo es requerido." }}
          items={[
            { label: "País", value: "pais" },
            { label: "Estado", value: "estado" },
            { label: "Municipio", value: "municipio" },
            { label: "Parroquia", value: "parroquia" },
          ]}
          placeholder="Lugar de la elección"
          onStateChange={handlePlaceTypeChange}
        />
        {(selectedPlaceType === "estado" ||
          selectedPlaceType === "municipio" ||
          selectedPlaceType === "parroquia") && (
          <CustomSelect
            control={control}
            name="estadoId"
            rules={{ required: "Este campo es requerido." }}
            items={Estados.map((e) => ({
              label: e.estado,
              value: e.id,
            }))}
            placeholder="Estado de Residencia"
            onStateChange={
              selectedPlaceType === "estado"
                ? (value) => setSelectedPlaceId(value)
                : handleMunicipios
            }
          />
        )}
        {(selectedPlaceType === "municipio" ||
          selectedPlaceType === "parroquia") && (
          <CustomSelect
            control={control}
            name="municipioId"
            rules={{ required: "Este campo es requerido." }}
            items={municipios.map((e) => ({
              label: e.municipio,
              value: e.id,
            }))}
            placeholder="Municipio de Residencia"
            onStateChange={
              selectedPlaceType === "municipio"
                ? (value) => setSelectedPlaceId(value)
                : handleParroquias
            }
          />
        )}
        {selectedPlaceType === "parroquia" && (
          <CustomSelect
            control={control}
            name="parroquiaId"
            rules={{ required: "Este campo es requerido." }}
            items={parroquias.map((e) => ({
              label: e.parroquia,
              value: e.id,
            }))}
            placeholder="Parroquia de Residencia"
            onStateChange={(value) => setSelectedPlaceId(value)}
          />
        )}
      </View>
      <View style={styles.bottomButtons}>
        <Button title="Atrás" onPress={() => navigation.goBack()} />
        <Button title="Siguiente" onPress={handleSubmit(onSubmit)} />
      </View>
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
  optionsContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  bottomButtons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default RegisterElectionScreen;
