import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import { AuthContext } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import AdminScreen from '../screens/AdminScreen';
import VotingScreen from '../screens/VotingScreen';
import RegisterVoterScreen from '../screens/RegisterVoterScreen';
import UpdateVoterScreen from '../screens/UpdateVoterScreen';
import RegisterElectionScreen from '../screens/RegisteElectionScreen';
import UpdateElectionScreen from '../screens/UpdateElectionScreen';

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
              <Stack.Screen name="ELECCIONES" component={HomeScreen} />
              <Stack.Screen name="ADMINISTRACION" component={AdminScreen} />
              <Stack.Screen name="VOTACION" component={VotingScreen} options={{ headerShown: false }}/>
              <Stack.Screen name="REGISTRO DE VOTANTE" component={RegisterVoterScreen} />
              <Stack.Screen name="ACTUALIZACION DE VOTANTE" component={UpdateVoterScreen} />
              <Stack.Screen name="REGISTRO DE ELECCION" component={RegisterElectionScreen} />
              <Stack.Screen name="ACTUALIZACION DE ELECCION" component={UpdateElectionScreen} />
            </>
          ) : (
            <>
            <Stack.Screen name="ELECCIONES" component={HomeScreen} />
            <Stack.Screen name="VOTACION" component={VotingScreen} options={{ headerShown: false }}/>
            </>
          )
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
