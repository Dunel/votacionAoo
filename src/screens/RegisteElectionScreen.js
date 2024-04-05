import React, { useContext, useState } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { useForm } from "react-hook-form";
import CustomInput from "../components/customInput";
import CustomButton from "../components/customButton";
import axios from "axios";
import DatePicker from "react-native-neat-date-picker";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const RegisterElectionScreen = () => {
  const { handleSubmit, control } = useForm();
  const navigation = useNavigation();
  const { userInfo, setIsLoading, logout } = useContext(AuthContext);
  const [showDatePickerRange, setShowDatePickerRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const openDatePickerRange = () => setShowDatePickerRange(true);

  const onCancelRange = () => setShowDatePickerRange(false);

  const onConfirmRange = (output) => {
    console.log(output);
    setShowDatePickerRange(false);
    setStartDate(output.startDate);
    setEndDate(output.endDate);
  };

  const onSubmit = async (data) => {
    const requestData = {
      startDate,
      endDate,
      ...data,
    };
    try {
      const res = await axios.post(
        "http://192.168.11.118:3000/api/election/create",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      navigation.goBack();
      Alert.alert(
        "Elección Registrada",
        "La elección ha sido registrada exitosamente."
      );
    } catch (error) {
      console.error("Error al registrar elección:", error);
      Alert.alert("Error", "Ocurrió un error al registrar la elección.");
    }
  };

  return (
    <View style={styles.container}>
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
});

export default RegisterElectionScreen;
