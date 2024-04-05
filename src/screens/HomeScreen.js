import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userInfo, setIsLoading, logout } = useContext(AuthContext);
  const [elections, setElections] = useState([]);

  const fetchElections = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://192.168.11.118:3000/api/election",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      console.log("cargando elecciones")
      setElections(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      logout();
    }
  };

  const renderElectionItem = ({ item }) => {
    const userVoted =
      item.votes &&
      item.votes.some((vote) => vote.userCedula == userInfo.cedula);
    return (
      <View style={styles.electionItem}>
        <Text style={styles.electionTitle}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text>Inicio: {new Date(item.startDate).toLocaleDateString()}</Text>
        <Text>Fin: {new Date(item.endDate).toLocaleDateString()}</Text>
        <Button
          title="IR A LA VOTACIÓN"
          color="blue"
          disabled={!item.active || userVoted || !item.active}
          onPress={() => navigation.navigate("VOTACION", { votingId: item.id })}
        />
      </View>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchElections();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoText}>Cedula: {userInfo.cedula}</Text>
        <Text style={styles.userInfoText}>
          Nombre: {userInfo.nombre.toUpperCase()}
        </Text>
        <Text style={styles.userInfoText}>
          Apellido: {userInfo.apellido.toUpperCase()}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <FlatList
          data={elections}
          renderItem={renderElectionItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
      <View style={styles.buttonContainer}>
        {userInfo.role === 2 && (
          <Button
            title="Administración"
            color="#FCBE17"
            onPress={() => navigation.navigate("ADMINISTRACION")}
          />
        )}
        <Button title="Cerrar Sesión" color="red" onPress={logout} />
      </View>
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
  contentContainer: {
    flex: 1,
    width: "100%",
    marginBottom: 10,
  },
  flatListContent: {
    flexGrow: 1,
  },
  electionItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "100%",
  },
  electionTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default HomeScreen;
