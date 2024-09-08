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
      //console.log(userInfo.token);
      setIsLoading(true);
      const response = await axios.get(
        userInfo.role == 2
          ? `https://node.appcorezulia.lat/api/election/admin`
          : `https://node.appcorezulia.lat/api/election`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setElections(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const renderElectionItem = ({ item }) => {
    const userVoted =
      item.votes &&
      item.votes.some((vote) => vote.userCedula == userInfo.cedula);
    const active = item.active == "active" ? true : false;
    const resultActive = new Date(item.endDate) < new Date();
    return (
      <View style={styles.electionItem}>
        <View style={styles.electionTitleContainer}>
          <Text style={styles.electionTitle}>{item.title}</Text>
          <Text style={styles.checkmark}>✅</Text>
        </View>
        <Text>{item.description}</Text>
        <Text>Inicio: {new Date(item.startDate).toLocaleDateString()}</Text>
        <Text>Fin: {new Date(item.endDate).toLocaleDateString()}</Text>
        {resultActive ? (
          <Button
            title="Ver resultados"
            color="brown"
            onPress={() =>
              navigation.navigate("ElectionResultsScreen", { election: item.id })
            }
          />
        ) : (
          <Button
            title="IR A LA VOTACIÓN"
            color="blue"
            disabled={!active || userVoted || !active}
            onPress={() =>
              navigation.navigate("VotingScreen", { votingId: item.id })
            }
          />
        )}
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
        <Text style={styles.userInfoText}>
          Cédula de identidad: {userInfo.cedula}
        </Text>
        <Text style={styles.userInfoText}>
          Nombre Completo: {userInfo.fullname.toUpperCase()}
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
            onPress={() => navigation.navigate("AdminScreen")}
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
  electionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
