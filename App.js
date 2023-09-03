import { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, SafeAreaView, TextInput, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";


//routes or elements of stack
import Signup from './screens/signup';
import Clipboard from './screens/clipboard';
import Login from './screens/login';
import Settings from './screens/settings';


const Stack = createNativeStackNavigator();

const App = () => {

  //handle if user already logged in
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    // Check if the user is logged in by reading from AsyncStorage
    const checkLoginStatus = async () => {
      const userId = await AsyncStorage.getItem("id");
      console.log(userId);
      if (!userId) {
        setIsLogin(false);
        console.log("Not logged in, redirecting to signup screen");
      }
    };

    checkLoginStatus();
  }, []); // Make sure to include navigation in the dependency array


  return (
    <NavigationContainer >
      <SafeAreaProvider >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLogin ? <Stack.Screen name="home" component={Clipboard} /> : <Stack.Screen name="signup" component={Signup} />}
          {!isLogin ? <Stack.Screen name="home" component={Clipboard} /> : <Stack.Screen name="signup" component={Signup} />}
          {/* <Stack.Screen name="home" component={Clipboard} /> */}
          {/* <Stack.Screen name="signup" component={Signup} /> */}
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="settings" component={Settings} />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

export default App;