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
  Button,
  BackHandler,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useRoute, useNavigation } from "@react-navigation/native";
import CustomInput from "../components/customInput";
import { useForm } from "react-hook-form";
import CustomButton from "../components/customButton";

const PostulationsRegisterScreen = () => {
  const { handleSubmit, control, setValue } = useForm();
  const route = useRoute();
  const navigation = useNavigation();
  const { electionId } = route.params;
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const { userInfo, logout } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://node.appcorezulia.lat/api/election/${electionId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setData(res.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleCandidatePress = (item) => {
    try {
      setValue("name", item.name);
      setValue("image", item.image ? item.image : "");
      setValue("party", item.party ? item.party : "");
      setValue("partyImage", item.partyImage ? item.partyImage : "");
      setSelected(item.id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateCandidate = async (item) => {
    try {
      const data = { ...item, electionId: electionId, id: selected };
      console.log("data: ", data);
      const res = await axios.put(
        `https://node.appcorezulia.lat/api/candidate/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      fetchData();
    } catch (error) {
      Alert.alert("Error actualizando candidato.", "", [{ text: "OK" }]);
      console.error(error.response.data);
    }
  };

  const handleAddCandidate = async (item) => {
    try {
      const data = { ...item, electionId: electionId };
      console.log(data);
      const res = await axios.post(
        `https://node.appcorezulia.lat/api/candidate/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      fetchData();
      handleResetForm();
    } catch (error) {
      Alert.alert("Error agregando candidato.", "", [{ text: "OK" }]);
      console.error(error.response.data);
    }
  };

  const handleResetForm = () => {
    setValue("name", "");
    setValue("image", "");
    setValue("party", "");
    setValue("partyimage", "");
    setSelected(false);
  };

  const handleDeleteCandidate = async (id) => {
    try {
      const res = await axios.delete(
        `https://node.appcorezulia.lat/api/candidate/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      fetchData();
      handleResetForm();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderCandidateItem = ({ item }) => (
    <>
      <View style={styles.CandidateItem}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image ? { uri: item.image } : null}
            style={styles.candidateImage}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.candidateName}>{item.name}</Text>
        </View>
        <View style={styles.userInfoContainer}>
          <TouchableOpacity
            onPress={() => handleCandidatePress(item)}
          >
            <Text style={[styles.userInfoText, styles.userInfoMargin]}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "¿ESTÁ SEGURO DE ELIMINAR LA OPCIÓN CANDIDATA?",
                "NO SE PODRÁ DESHACER LA ACCIÓN",
                [
                  {
                    text: "ATRÁS",
                    onPress: () => null,
                    style: "cancel",
                  },
                  {
                    text: "ELIMINAR",
                    onPress: () => handleDeleteCandidate(item.id),
                  },
                ]
              )}
          >
            <Text style={[styles.userInfoText, styles.userInfoMargin]}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.votingInfo}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.description}>{data.description}</Text>
      </View>
      <View style={styles.bottomButtons}>
        <Button title="+ Agregar opción" onPress={handleResetForm} />
      </View>
      <CustomInput
        name="name"
        control={control}
        placeholder={"Nombre Opción Candidata"}
        rules={{
          required: "El título es requerido.",
          minLength: {
            value: 5,
            message: "El título debe tener minimo 5 caracteres.",
          },
          maxLength: {
            value: 50,
            message: "El título debe tener máximo 50 caracteres.",
          },
        }}
      />
      <CustomInput
        name="image"
        control={control}
        placeholder={"URL Imagen Opción Candidata"}
        rules={{
          minLength: {
            value: 8,
            message: "La Imagen debe tener minimo 8 caracteres.",
          },
          maxLength: {
            value: 150,
            message: "La Imagen debe tener máximo 150 caracteres.",
          },
        }}
      />
      {selected ? (
        <>
          <CustomButton
            text="ACTUALIZAR"
            onPress={handleSubmit(handleUpdateCandidate)}
          />
        </>
      ) : (
        <CustomButton
          text="REGISTRAR OPCIÓN CANDIDATA"
          onPress={handleSubmit(handleAddCandidate)}
        />
      )}
      <View style={styles.contentContainer}>
        <FlatList
          data={data.candidates}
          renderItem={renderCandidateItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
      <CustomButton
          text="FINALIZAR REGISTRO"
          bgColor={"#FCBE17"}
          onPress={() => {
            Alert.alert("ELECCIÓN REGISTRADA.", "", [{ text: "OK" }])
            navigation.goBack()}
          }
        />
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
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
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
  bottomButtons: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  userInfoContainer: {
    flexDirection: "column",
  },
  userInfoMargin: {
    marginVertical: 7,
  },
});

export default PostulationsRegisterScreen;
