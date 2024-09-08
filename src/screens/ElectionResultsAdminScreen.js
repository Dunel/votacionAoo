import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const ElectionResultsAdminScreen = () => {
  const navigation = useNavigation();
  const { userInfo } = useContext(AuthContext);
  const [elections, setElections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [candidateWinner, setCandidateWinner] = useState(null);
  const [votesTotal, setVotesTotal] = useState(0);
  const [votesNull, setVotesNull] = useState(0);
  const [elecInscritos, setElecInscritos] = useState(0);
  const [dataCandidates, setDataCandidates] = useState(null);

  useEffect(() => {
    fetchElections();
  }, []);

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

  const handleSelectElection = async (item) => {
    setSelected(item);
    fetchElectorsCount({ type: item.type, typeId: item.typeId });
    try {
      const res = await axios.get(
        `https://node.appcorezulia.lat/api/election/results/${item.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      console.log(item);
      setDataCandidates(res.data);
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
      console.error("Error fetching election results:", error);
      Alert.alert("Error", "Failed to load election results.");
    }
  };

  const fetchElections = async () => {
    try {
      const res = await axios.get(
        `https://node.appcorezulia.lat/api/election/admin`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setElections(res.data);
    } catch (error) {
      console.error("Error fetching elections:", error);
      Alert.alert("Error", "Failed to load elections.");
    }
  };

  const renderElectionItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectElection(item)}>
      <View style={styles.electionItem}>
        <Text style={styles.electionTitle}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text>Inicio: {new Date(item.startDate).toLocaleDateString()}</Text>
        <Text>Fin: {new Date(item.endDate).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCandidateItem = ({ item }) => {
    const isWinner = item === candidateWinner;
    const votePercentage =
      votesTotal === 0
        ? 0
        : ((item._count.votes / votesTotal) * 100).toFixed(2);
    return (
      <TouchableOpacity style={styles.candidateItem}>
        <Image
          source={item.image ? { uri: item.image } : null}
          style={styles.candidateImage}
        />
        <View style={styles.candidateInfo}>
          <Text style={[styles.candidateName, isWinner && styles.winner]}>
            {item.name}
          </Text>
          <Text style={styles.candidateVotes}>Votos: {item._count.votes}</Text>
          <Text style={styles.votePercentage}>
            Porcentaje de votos: {votePercentage}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const porcentajeVotosEfectuados = (
    (votesTotal / elecInscritos) *
    100
  ).toFixed(2);
  return (
    <View style={styles.container}>
      {selected && (
        <View style={styles.resultsContainer}>
          <Text style={styles.title}>{selected.title}</Text>
          <Text style={styles.description}>{selected.description}</Text>
          <Text style={styles.votesTotal}>
            Electores Inscritos: {elecInscritos}
          </Text>
          <Text style={styles.votesTotal}>Votos Efectuados: {votesTotal}</Text>
          <Text style={styles.votesTotal}>Votos Nulos: {votesNull}</Text>
          <Text style={styles.votesTotal}>
            Participación: {porcentajeVotosEfectuados}%
          </Text>
          {dataCandidates && (
            <FlatList
              data={dataCandidates.candidates}
              renderItem={renderCandidateItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.flatListContent}
            />
          )}
        </View>
      )}
      <View style={styles.electionsContainer}>
        <Text style={styles.headerText}>
          Seleccione una elección a escrutar:
        </Text>
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
    marginTop: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  electionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  electionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resultsContainer: {
    flex: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
  },
  votesTotal: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  candidateItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "100%",
  },
  candidateImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  winner: {
    color: "green",
  },
  candidateVotes: {
    fontSize: 14,
  },
  votePercentage: {
    fontSize: 14,
  },
  flatListContent: {
    flexGrow: 1,
  },
});

export default ElectionResultsAdminScreen;
