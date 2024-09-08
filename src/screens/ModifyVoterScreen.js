import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { useForm } from "react-hook-form";
import CustomInput from "../components/customInput";
import CustomButton from "../components/customButton";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const cedulaRegex = /^[0-9]+$/;

const ModifyVoterScreen = () => {
  const { handleSubmit, control, setValue, watch } = useForm();
  const navigation = useNavigation();
  const { userInfo } = useContext(AuthContext);
  const [showInputs, setShowInputs] = useState(false);
  const [voterdata, setVoterData] = useState([]);

  const handleSearchCedula = async (data) => {
    try {
      const res = await axios.get(
        `https://node.appcorezulia.lat/api/user/${data.cedula}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setVoterData(res.data);
      setShowInputs(true);
    } catch (error) {
      //console.error("Error al buscar votante:", error.response.data);
      setShowInputs(false);
      Alert.alert("ERROR:", "VOTANTE NO REGISTRADO EN NUESTRA BASE DE DATOS.");
    }
  };

  const onSubmit = async (data) => {
    try {
      if (data.cedula == 1) {
        Alert.alert(
          "ERROR.",
          "EL USUARIO INSTITUCIONAL NO PUEDE SER ELIMINADO.",
          [{ text: "OK" }]
        );
        return;
      }
      const res = await axios.delete(
        `https://node.appcorezulia.lat/api/user/${data.cedula}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      Alert.alert("VOTANTE ELIMINADO.", "", [{ text: "OK" }]);
      navigation.goBack();
    } catch (error) {
      //console.log("error: ", error.response.data);
      Alert.alert("ERROR.", "" + error.response.status, [{ text: "OK" }]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
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
        <CustomButton
          text="Buscar Votante"
          onPress={handleSubmit(handleSearchCedula)}
        />
        {showInputs && (
          <>
            <View style={styles.userInfoContainer}>
              <View style={styles.voterTitleContainer}>
                <Text style={styles.userInfoText}>
                  Cédula de identidad: {voterdata.cedula}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("UpdateVoterScreen", {
                      cedula: voterdata.cedula,
                    })
                  }
                >
                  <Text style={styles.userInfoText}>✏️</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.userInfoText}>
                Nombre Completo: {voterdata.fullname}
              </Text>
              <View style={styles.voterTitleContainer}>
                <Text style={styles.userInfoText}>
                  Fecha de nacimiento:{" "}
                  {new Date(voterdata.birthdate).toLocaleDateString()}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "¿ESTÁ SEGURO DE ELIMINAR EL VOTANTE? ",
                      "NO SE PODRÁ DESHACER LA ACCIÓN.",
                      [
                        {
                          text: "ATRÁS",
                          onPress: () => null,
                          style: "cancel",
                        },
                        {
                          text: "ELIMINAR",
                          onPress: () => onSubmit(voterdata),
                        },
                      ]
                    )
                  }
                >
                  <Text style={styles.electionTitle}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
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
  userInfoContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: "100%",
  },
  userInfoText: {
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  voterTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default ModifyVoterScreen;
