import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import { AuthContext } from "../context/AuthContext";
import SplashScreen from "../screens/SplashScreen";
import AdminScreen from "../screens/AdminScreen";
import VotingScreen from "../screens/VotingScreen";
import RegisterVoterScreen from "../screens/RegisterVoterScreen";
import UpdateVoterScreen from "../screens/UpdateVoterScreen";
import RegisterElectionScreen from "../screens/RegisteElectionScreen";
import UpdateElectionScreen from "../screens/UpdateElectionScreen";
import DeleteElectionScreen from "../screens/DeleteElectionScreen";
import PostulationScreen from "../screens/PostulationScreen";
import PostulationsRegisterScreen from "../screens/PostulationsRegisterScreen";
import RegisteredVoteScreen from "../screens/RegisterVoteFinishScreen";
import ModifyVoterScreen from "../screens/ModifyVoterScreen";
import RecoveryScreen from "../screens/RecoveryScreen";
import PasswordRecoveryScreen from "../screens/PasswordRecoveryScreen";
import ElectionResultsScreen from "../screens/ElectionResultsScreen";
import ElectionResultsAdminScreen from "../screens/ElectionResultsAdminScreen";
import LogoTitle from "../components/logoTitle";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { userInfo, splashLoading } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {splashLoading ? (
          <Stack.Screen
            name="Splash Screen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        ) : userInfo.token ? (
          userInfo.role === 2 ? (
            <>
              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                  headerTitle: () => <LogoTitle />,
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
              <Stack.Screen
                name="AdminScreen"
                component={AdminScreen}
                options={{
                  title: "ADMINISTRACIÓN",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
              <Stack.Screen
                name="VotingScreen"
                component={VotingScreen}
                options={{
                  title: "VOTACIÓN",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                  headerShown: false
                }}
              />
              <Stack.Screen
                name="RegisterVoterScreen"
                component={RegisterVoterScreen}
                options={{
                  title: "REGISTRAR VOTANTE",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
              <Stack.Screen
                name="UpdateVoterScreen"
                component={UpdateVoterScreen}
                options={{
                  title: "MODIFICAR VOTANTE",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
              <Stack.Screen
                name="RegisterElectionScreen"
                component={RegisterElectionScreen}
                options={{
                  title: "REGISTRAR ELECCIÓN",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
              <Stack.Screen
                name="UpdateElectionScreen"
                component={UpdateElectionScreen}
                options={{
                  title: "MODIFICAR ELECCIÓN",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
              <Stack.Screen
                name="DeleteElectionScreen"
                component={DeleteElectionScreen}
                options={{
                  title: "ELIMINAR ELECCIÓN",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
              <Stack.Screen
                name="PostulationScreen"
                component={PostulationScreen}
                options={{
                  title: "OPCIONES CANDIDATAS",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
              <Stack.Screen
                name="PostulationsRegisterScreen"
                component={PostulationsRegisterScreen}
                options={{
                  title: "OPCIONES CANDIDATAS",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
              <Stack.Screen
                name="RegisteredVoteScreen"
                component={RegisteredVoteScreen}
                options={{
                  title: "VOTO REGISTRADO",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
              <Stack.Screen
                name="ModifyVoterScreen"
                component={ModifyVoterScreen}
                options={{
                  title: "MODIFICAR VOTANTE",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
              <Stack.Screen
                name="ElectionResultsScreen"
                component={ElectionResultsScreen}
                options={{
                  title: "VER RESULTADOS",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
              <Stack.Screen
                name="ElectionResultsAdminScreen"
                component={ElectionResultsAdminScreen}
                options={{
                  title: "VER RESULTADOS",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                  title: "ELECCIONES",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
              <Stack.Screen
                name="VotingScreen"
                component={VotingScreen}
                options={{
                  title: "VOTACIÓN",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                  headerShown: false
                }}
              />
              <Stack.Screen
                name="RegisteredVoteScreen"
                component={RegisteredVoteScreen}
                options={{
                  title: "VOTO REGISTRADO",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
              <Stack.Screen
                name="ElectionResultsScreen"
                component={ElectionResultsScreen}
                options={{
                  title: "VER RESULTADOS",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                }}
              />
            </>
          )
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RecoveryScreen"
              component={RecoveryScreen}
              options={{
                title: "RECUPERAR CONTRASEÑA",
                headerTitleStyle: {
                  fontWeight: "bold",
                  fontSize: 15,
                },
              }}
            />
            <Stack.Screen
              name="PasswordRecoveryScreen"
              component={PasswordRecoveryScreen}
              options={{
                title: "NUEVA CONTRASEÑA",
                headerTitleStyle: {
                  fontWeight: "bold",
                  fontSize: 15,
                },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
