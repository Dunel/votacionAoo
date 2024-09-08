import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  Keyboard,
} from "react-native";
import { useForm } from "react-hook-form";
import CustomInput from "../components/customInput";
import CustomButton from "../components/customButton";
import axios from "axios";
import DatePicker from "react-native-neat-date-picker";
import { AuthContext } from "../context/AuthContext";
import CustomSelect from "../components/customSelect";
import { useNavigation } from "@react-navigation/native";
import {
  fetchEstados,
  fetchMunicipios,
  fetchParroquias,
} from "../services/venezuela.service";

const UpdateElectionScreen = () => {
  const { handleSubmit, control, setValue } = useForm();
  const navigation = useNavigation();
  const { userInfo } = useContext(AuthContext);
  const [showDatePickerRange, setShowDatePickerRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [elections, setElections] = useState([]);
  const [selected, setSelected] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [Estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [selectedPlaceType, setSelectedPlaceType] = useState(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  useEffect(() => {
    fetchElections();
    estados();
  }, []);
  const handleSelectElection = (item) => {
    //console.log(item);
    setValue("title", item.title);
    setValue("description", item.description ? item.description : "");
    setValue("active", item.active);
    setValue("type", item.type);
    handlePlaceTypeChange(item.type);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setSelected(item.id);
    setShowButton(true);
  };

  const fetchElections = async () => {
    try {
      const response = await axios.get(
        `https://node.appcorezulia.lat/api/election/admin`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setElections(response.data);
    } catch (error) {
      //console.error("Error al obtener las elecciones:", error);
      Alert.alert("Error", "Ocurrió un error al cargar las elecciones.");
    }
  };

  const openDatePickerRange = () => {
    Keyboard.dismiss();
    setShowDatePickerRange(true);
  };

  const onCancelRange = () => setShowDatePickerRange(false);

  const handleDelete = async (itemId) => {
    try {
      const response = await axios.delete(
        `https://node.appcorezulia.lat/api/election/${itemId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      fetchElections();
      Alert.alert(
        "ELECCIÓN ELIMINADA",
        ""
      );
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const onConfirmRange = (output) => {
    setShowDatePickerRange(false);
    setStartDate(output.startDate);
    setEndDate(output.endDate);
  };

  const onSubmit = async (data) => {
    const requestData = {
      typeId: selectedPlaceId,
      startDate,
      endDate,
      id: selected,
      ...data,
    };
    console.log(requestData);
    try {
      const res = await axios.put(
        `https://node.appcorezulia.lat/api/election`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      //console.log(res.data);
      Alert.alert(
        "ELECCIÓN MODIFICADA",
        ""
      );
      fetchElections();
    } catch (error) {
      console.error("Error al actualizar elección:", error.response.data);
      Alert.alert("Error", "Ocurrió un error al actualizar la elección.");
    }
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

  const handlePlaceTypeChange = (value) => {
    setValue("estadoId", 0);
    setMunicipios([]);
    setParroquias([]);
    setSelectedPlaceType(value);
    setSelectedPlaceId(0);
  };

  const renderElectionItem = ({ item }) => {
    return (
      <View style={styles.electionItem}>
        <View style={styles.electionTitleContainer}>
          <Text style={styles.electionTitle}>{item.title}</Text>
          <TouchableOpacity
            onPress={() => {
              handleSelectElection(item);
            }}
          >
            <Text style={styles.electionTitle}>✏️</Text>
          </TouchableOpacity>
        </View>
        <Text>{item.description}</Text>
        <Text>Inicio: {new Date(item.startDate).toLocaleDateString()}</Text>
        <View style={styles.electionTitleContainer}>
          <Text>Fin: {new Date(item.endDate).toLocaleDateString()}</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "¿ESTÁ SEGURO DE ELIMINAR LA ELECCIÓN?",
                "NO SE PODRÁ DESHACER LA ACCIÓN",
                [
                  {
                    text: "ATRÁS",
                    onPress: () => null,
                    style: "cancel",
                  },
                  { text: "ELIMINAR", onPress: () => handleDelete(item.id) },
                ]
              )
            }
          >
            <Text style={styles.electionTitle}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <CustomInput
          name="title"
          control={control}
          placeholder={"Título"}
          rules={{
            required: "El título es requerido.",
          }}
        />
        <CustomInput
          name="description"
          control={control}
          placeholder={"Descripción (Opcional)"}
        />
        {/* Date Range */}
        <CustomButton
          text={"Seleccionar ambas fechas"}
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
          name="active"
          control={control}
          rules={{ required: "Se requiere este campo" }}
          items={[
            { label: "Activa", value: "active" },
            { label: "Inactiva", value: "inactive" },
          ]}
          placeholder="Estado de la elección"
        />
        <CustomSelect
          name="type"
          control={control}
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
            name="estadoId"
            control={control}
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
            name="municipioId"
            control={control}
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
            name="parroquiaId"
            control={control}
            rules={{ required: "Este campo es requerido." }}
            items={parroquias.map((e) => ({
              label: e.parroquia,
              value: e.id,
            }))}
            placeholder="Parroquia de Residencia"
            onStateChange={(value) => setSelectedPlaceId(value)}
          />
        )}
        <Button
          title="OPCIONES CANDIDATAS"
          color="green"
          disabled={!showButton}
          onPress={() =>
            navigation.navigate("PostulationScreen", { electionId: selected })
          }
        />
        <View style={styles.buttonUpdate}>
          <Button
            disabled={!showButton}
            color={"blue"}
            title="MODIFICAR"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
      <View style={styles.electionsContainer}>
        <Text style={styles.headerText}>
          Seleccione la elección a modificar:
        </Text>
        <FlatList
          data={elections}
          renderItem={renderElectionItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  electionsContainer: {
    flex: 1,
    marginTop: 20,
  },
  formContainer: {
    marginTop: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 0,
  },
  electionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  electionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  electionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  flatListContent: {
    flexGrow: 1,
  },
  buttonUpdate: {
    marginTop: 10,
  },
});

export default UpdateElectionScreen;
