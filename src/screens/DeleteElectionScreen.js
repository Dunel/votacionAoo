import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";

const DeleteElectionScreen = () => {
  const navigation = useNavigation();
  const { userInfo, setIsLoading, logout } = useContext(AuthContext);
  const [elections, setElections] = useState([]);

  const fetchElections = async () => {
    try {
      const response = await axios.get(
        `https://node.appcorezulia.lat/api/election`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      return setElections(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      console.log({ id: itemId });
      const response = await axios.delete(
        `https://node.appcorezulia.lat/api/election/${itemId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );
      fetchElections();
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const renderElectionItem = ({ item }) => {
    /*const userVoted =
      item.votes &&
      item.votes.some((vote) => vote.userCedula == userInfo.cedula);
    const active = item.active == "active" ? true : false;*/
    return (
      <View style={styles.electionItem}>
        <Text style={styles.electionTitle}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text>Inicio: {new Date(item.startDate).toLocaleDateString()}</Text>
        <Text>Fin: {new Date(item.endDate).toLocaleDateString()}</Text>
        <Button
          title="Eiminar elección"
          color="#A90127"
          onPress={() => handleDelete(item.id)}
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
      <View style={styles.contentContainer}>
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

export default DeleteElectionScreen;
