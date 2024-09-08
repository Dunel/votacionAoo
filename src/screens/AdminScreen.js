import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const AdminScreen = () => {
  const navigation = useNavigation();
  const { userInfo, setIsLoading, logout } = useContext(AuthContext);

  const handleRegistrarVotante = () => {
    navigation.navigate("RegisterVoterScreen");
  };

  const handleActualizarVotante = () => {
    navigation.navigate("ModifyVoterScreen");
  };

  const handleElectionsResults = () => {
    //VER RESULTADOS
    navigation.navigate("ElectionResultsAdminScreen");
  };

  const handleRegistrarEleccion = () => {
    navigation.navigate("RegisterElectionScreen");
  };

  const handleModificarEleccion = () => {
    navigation.navigate("UpdateElectionScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <Text style={styles.title}>Menú de Votantes</Text>
        <View style={styles.option}>
          <Button title="Registrar Votante" onPress={handleRegistrarVotante} />
        </View>
        <View style={styles.option}>
          <Button title="Modificar Votante" onPress={handleActualizarVotante} />
        </View>

        <Text style={styles.title}>Menú de Elecciones</Text>
        <View style={styles.option}>
          <Button
            title="Registrar Elección"
            onPress={handleRegistrarEleccion}
          />
        </View>
        <View style={styles.option}>
          <Button
            title="Modificar Elección"
            onPress={handleModificarEleccion}
          />
        </View>
        <View style={styles.option}>
          <Button
            title="Ver elecciones en tiempo real"
            onPress={handleElectionsResults}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="atrás"
          color="#FCBE17"
          onPress={() => navigation.goBack()}
        />
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
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: 'center'
  },
  optionsContainer: {
    flex: 1,
  },
  option: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default AdminScreen;
