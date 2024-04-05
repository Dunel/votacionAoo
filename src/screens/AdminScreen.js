import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const AdminScreen = () => {
  const navigation = useNavigation();
  const { userInfo, setIsLoading, logout } = useContext(AuthContext);

  const handleRegistrarVotante = () => {
    navigation.navigate("REGISTRO DE VOTANTE");
  };

  const handleActualizarVotante = () => {
    navigation.navigate("ACTUALIZACION DE VOTANTE");
  };

  const handleRegistrarEleccion = () => {
    navigation.navigate("REGISTRO DE ELECCION");
  };

  const handleModificarEleccion = () => {
    navigation.navigate("ACTUALIZACION DE ELECCION");
  };

  const handleAgregarCandidato = () => {
    alert("Pronto")
  };

  const handleModificarCandidato = () => {
    alert("Pronto")
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú de Administración</Text>
      <View style={styles.optionsContainer}>
        <View style={styles.option}>
          <Button title="Registrar Votante" onPress={handleRegistrarVotante} />
        </View>
        <View style={styles.option}>
          <Button title="Actualizar Votante" onPress={handleActualizarVotante} />
        </View>
        <View style={styles.option}>
          <Button title="Registrar Elección" onPress={handleRegistrarEleccion} />
        </View>
        <View style={styles.option}>
          <Button title="Modificar Elección" onPress={handleModificarEleccion} />
        </View>
        <View style={styles.option}>
          <Button title="Agregar Candidato" onPress={handleAgregarCandidato} />
        </View>
        <View style={styles.option}>
          <Button title="Modificar Candidato" onPress={handleModificarCandidato} />
        </View>
      </View>
      <View style={styles.bottomButtons}>
        <Button title="Ir atrás" color="#FCBE17" onPress={() => navigation.goBack()} />
        <Button title="Cerrar Sesión" color="red" onPress={logout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  option: {
    marginBottom: 10,
  },
  bottomButtons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default AdminScreen;
