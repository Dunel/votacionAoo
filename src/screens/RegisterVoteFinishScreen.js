import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";

const RegisteredVoteScreen = () => {
  const navigation = useNavigation();
  const { userInfo } = useContext(AuthContext);
  const route = useRoute();
  const { candidate, votingId } = route.params;
  const [data, setData] = useState([]);
  const captureRef = useRef();

  const handleSalir = () => {
    navigation.popToTop();
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://node.appcorezulia.lat/api/election/${votingId}`,
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
      console.log(error.response.data);
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

  return (
    <View style={styles.container}>
      <ViewShot
        style={styles.viewShot}
        ref={captureRef}
        options={{ fileName: data.title, format: "png", quality: 0.9 }}
      >
        <View style={styles.SubContainer}>
          <Text style={styles.message}>
            {candidate
              ? "¡FELICIDADES! TU VOTO HA SIDO REGISTRADO."
              : "TU VOTO HA SIDO REGISTRADO NULO."}
          </Text>
          <Text style={styles.electionName}>
            {data.title ? data.title : ""}
          </Text>
          <Text style={styles.electionDescription}>
            {data.description ? data.description : ""}
          </Text>
          <View style={styles.candidateInfo}>
            <Image
              source={
                candidate
                  ? candidate.image
                    ? { uri: candidate.image }
                    : null
                  : require("../../assets/NULO.png")
              }
              style={styles.candidateImage}
            />
            <Text style={styles.candidateName}>
              {candidate.name ? candidate.name : "NULO"}
            </Text>
          </View>
        </View>
      </ViewShot>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSalir}>
          <Text style={styles.buttonText}>SALIR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCapture}>
          <Text style={styles.buttonText}>COMPARTIR CAP</Text>
        </TouchableOpacity>
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
  SubContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  viewShot: {
    flex: 1,
    width: SCREEN_WIDTH,
    alignSelf: "stretch",
  },
  message: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
  },
  electionName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  electionDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  candidateInfo: {
    alignItems: "center",
  },
  candidateImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
const SCREEN_WIDTH = Dimensions.get("screen").width;

export default RegisteredVoteScreen;
