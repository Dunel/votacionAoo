import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useRoute, useNavigation } from "@react-navigation/native";

const VotingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { votingId } = route.params;
  const [data, setData] = useState([]);
  const { userInfo, logout } = useContext(AuthContext);
  const [timeLeft, setTimeLeft] = useState(30); // Tiempo en segundos (30 minutos)

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://192.168.11.118:3000/api/election/${votingId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      console.log("ESTA ES LA DATA: ", res.data.title);
      setData(res.data);
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleCandidatePress(null);
    }
  }, [timeLeft]);

  const handleCandidatePress = async (cadidateid) => {
    try {
      const response = await axios.post(
        "http://192.168.11.118:3000/api/vote/create",
        {
          candidateId: cadidateid,
          electionId: votingId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      if (!cadidateid) {
        Alert.alert("Su voto se considera nulo.", "Tiempo de espera agotado.", [
          { text: "OK" },
        ]);
      } else {
        Alert.alert("Su voto se ha registrado exitosamente.", "", [
          { text: "OK" },
        ]);
      }
      navigation.navigate("ELECCIONES");
    } catch (error) {
      console.log(error);
      logout();
    }
  };
  useEffect(() => {
    const backAction = () => {
      Alert.alert("¿Seguro que quieres salir?", "Su voto se anulará!", [
        {
          text: "Mantener aquí.",
          onPress: () => null,
          style: "cancel",
        },
        { text: "SI", onPress: () => handleCandidatePress(null) },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const renderCandidateItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleCandidatePress(item.id)}
      style={styles.CandidateItem}
    >
      <View style={styles.partyImageContainer}>
        <Image source={{ uri: item.partyImage }} style={styles.partyImage} />
      </View>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.candidateImage} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.candidateName}>{item.name}</Text>
        <Text style={styles.candidateParty}>{item.party}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.votingInfo}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.description}>{data.description}</Text>
        <Text style={styles.timeLeft}>Tiempo restante: {timeLeft}</Text>
      </View>
      <View style={styles.contentContainer}>
        <FlatList
          data={data.candidates}
          renderItem={renderCandidateItem}
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
  votingInfo: {
    marginBottom: 20,
  },
  title: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  timeLeft: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    color: "red",
  },
  candidateImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  candidateParty: {
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    marginBottom: 10,
  },
  flatListContent: {
    flexGrow: 1,
  },
  CandidateItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "100%",
  },
  CandidateTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  imageContainer: {
    marginRight: 10,
  },
  partyImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  partyImage: {
    flex: 1,
    width: null,
    height: null,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
  },
});

export default VotingScreen;
