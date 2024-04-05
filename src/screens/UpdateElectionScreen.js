import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useForm } from "react-hook-form";
import CustomInput from "../components/customInput";
import CustomButton from "../components/customButton";
import axios from "axios";
import DatePicker from "react-native-neat-date-picker";
import { AuthContext } from "../context/AuthContext";

const UpdateElectionScreen = () => {
  const { handleSubmit, control, setValue } = useForm();
  const { userInfo, setIsLoading, logout } = useContext(AuthContext);
  const [showDatePickerRange, setShowDatePickerRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [elections, setElections] = useState([]);

  useEffect(() => {
    fetchElections();
  }, []);
  const handleSelectElection = (item) => {
    setValue("title", item.title);
    setValue("description", item.description);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
  };

  const fetchElections = async () => {
    try {
      const response = await axios.get(
        "http://192.168.11.118:3000/api/election",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setElections(response.data);
    } catch (error) {
      console.error("Error al obtener las elecciones:", error);
      Alert.alert("Error", "Ocurrió un error al cargar las elecciones.");
    }
  };

  const renderElectionItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.electionItem}
        onPress={() => {
          handleSelectElection(item);
        }}
      >
        <Text style={styles.electionTitle}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text>Inicio: {new Date(item.startDate).toLocaleDateString()}</Text>
        <Text>Fin: {new Date(item.endDate).toLocaleDateString()}</Text>
      </TouchableOpacity>
    );
  };

  const openDatePickerRange = () => setShowDatePickerRange(true);

  const onCancelRange = () => setShowDatePickerRange(false);

  const onConfirmRange = (output) => {
    setShowDatePickerRange(false);
    setStartDate(output.startDate);
    setEndDate(output.endDate);
  };

  const onSubmit = async (data) => {
    const requestData = {
      startDate,
      endDate,
      ...data, // Otros datos del formulario
    };

    try {
      const res = await axios.put(
        `http://api.example.com/elections/${selectedElection.id}`,
        requestData
      );
      console.log(res.data);
      Alert.alert(
        "Elección Actualizada",
        "La elección ha sido actualizada exitosamente."
      );
    } catch (error) {
      console.error("Error al actualizar elección:", error);
      Alert.alert("Error", "Ocurrió un error al actualizar la elección.");
    }
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
          text={"Seleccionar rango de fechas"}
          onPress={openDatePickerRange}
        />
        <DatePicker
          isVisible={showDatePickerRange}
          mode={"range"}
          onCancel={onCancelRange}
          onConfirm={onConfirmRange}
        />
        <Text>{startDate && `${new Date(startDate).toLocaleDateString()} ~ ${new Date(endDate).toLocaleDateString()}`}</Text>
        <CustomButton text="ACTUALIZAR" onPress={handleSubmit(onSubmit)} />
      </View>
      <View style={styles.electionsContainer}>
        <Text style={styles.headerText}>Seleccione la elección a editar:</Text>
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
  electionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  flatListContent: {
    flexGrow: 1,
  },
});

export default UpdateElectionScreen;
