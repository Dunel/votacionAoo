import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  FlatList,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import * as Sharing from "expo-sharing";

const ElectionResultsScreen = () => {
  const navigation = useNavigation();
  const { userInfo } = useContext(AuthContext);
  const route = useRoute();
  const { election } = route.params;
  const [data, setData] = useState([]);
  const [candidateWinner, setCandidateWinner] = useState(0);
  const [votesTotal, setVotesTotal] = useState(0);
  const [votesNull, setVotesNull] = useState(0);
  const [elecInscritos, setElecInscritos] = useState(0);
  const captureRef = useRef();

  const fetchElectorsCount = async (data) => {
    try {
      const res = await axios.post(
        `https://node.appcorezulia.lat/api/user/stats/count/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setElecInscritos(res.data);
    } catch (error) {
      console.error("Error contando:", error.response.data);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://node.appcorezulia.lat/api/election/result/${election}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      fetchElectorsCount({ type: res.data.type, typeId: res.data.typeId });
      setData(res.data);

      let maxVotes = 0;
      let allVotes = 0;
      let winner = null;
      res.data.candidates.forEach((candidate) => {
        const votes = candidate._count ? candidate._count.votes : 0;
        allVotes += votes;
        if (votes > maxVotes) {
          maxVotes = votes;
          winner = candidate;
        }
      });
      setVotesTotal(res.data._count.votes);
      setVotesNull(res.data._count.votes - allVotes);
      setCandidateWinner(winner);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Ocurrió un error al carga de la elección.");
      navigation.goBack();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCapture = async () => {
    try {
      const captureURI = await captureRef.current.capture();
      //console.log("Captura de pantalla guardada en:", captureURI);

      // Compartir la captura de pantalla
      await Sharing.shareAsync(captureURI, {
        mimeType: "image/png",
        dialogTitle: "Compartir captura de pantalla",
      });
    } catch (error) {
      console.error("Error al capturar la pantalla:", error);
    }
  };

  const renderCandidateItem = ({ item }) => {
    const isWinner = item === candidateWinner;
    const votePercentage =
      votesTotal === 0
        ? 0
        : ((item._count.votes / votesTotal) * 100).toFixed(2);
    return (
      <TouchableOpacity style={styles.CandidateItem}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image ? { uri: item.image } : null}
            style={styles.candidateImage}
          />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.WinnerContainer}>
          <Text style={[styles.candidateName, isWinner && styles.winner]}>
            {item.name}
          </Text>
            {isWinner && <Text>⭐</Text>}
          </View>
          <Text style={styles.candidateVotes}>Votos: {item._count.votes}</Text>
          <Text style={styles.votePercentage}>
            Porcentaje de votos: {votePercentage}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const porcentajeVotosEfectuados =
    elecInscritos === 0 ? 0 : ((votesTotal / elecInscritos) * 100).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.votingInfo}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.description}>{data.description}</Text>
        <Text style={styles.votesTotal}>
          Electores Inscritos: {elecInscritos}
        </Text>
        <Text style={styles.votesTotal}>Votos Efectuados: {votesTotal}</Text>
        <Text style={styles.votesTotal}>Votos Nulos: {votesNull}</Text>
        <Text style={styles.votesTotal}>
          Participación: {porcentajeVotosEfectuados}%
        </Text>
        {candidateWinner ? (
          <Text style={styles.candidateName}>
            ⭐ {candidateWinner.name} fue la Opción Candidata ganadora.
          </Text>
        ) : null}
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
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
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
    marginTop: 10,
  },
  candidateVotes: {
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
  textContainer: {
    flex: 1,
  },
  WinnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  winner: {
    color: "green",
  },
  votesTotal: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
});
const SCREEN_WIDTH = Dimensions.get("screen").width;

export default ElectionResultsScreen;
