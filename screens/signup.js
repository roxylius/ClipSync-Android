import { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TextInput,
    Button,
    Linking,
    StatusBar
} from 'react-native';
import { SERVER_URL } from '../assets/constants.js';

//components
import ButtonThemed from './components/button.js';
import Input from './components/input.js';
import { AwesomeButtonShare } from 'react-native-really-awesome-button';
import { FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';


const Signup = ({ navigation }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');

    const handleSignup = async () => {
        //set statusbar color to color of container default color
        StatusBar.setBackgroundColor('black');

        console.log(SERVER_URL);

        const url = await Linking.getInitialURL();
        console.log('Current URL:', url);
        console.log(JSON.stringify({ name, email, password }));
        fetch(SERVER_URL + '/api/signup', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        }).then(response => response.json())
            .then(data => console.log(data))
            .catch(err => console.log("error", err));
    };

    // const [loaded] = useFonts({
    //     JetBrainsMonoLight: require('../assets/fonts/JetBrainsMono-Light.ttf'),
    //     Roboto: require('../assets/fonts/Roboto-Light.ttf')
    // });

    // if (!loaded) {
    //     return null;
    // }


    return (
        <View style={styles.signup}>
            <Text style={styles.heading}>Create Account</Text>
            <View style={styles.loginform}>
                <Text style={styles.text}>Name</Text>
                <Input text={name} handleText={text => setName(text)} />
                <Text style={styles.text}>Email</Text>
                <Input text={email} handleText={text => setEmail(text)} />
                <Text style={styles.text}>Password</Text>
                <Input text={password} ifpass={true} handleText={text => setPassword(text)} />
                <ButtonThemed text='Signup' onPress={handleSignup} type='normal'
                // fontFamily={'JetBrainsMonoLight'} 
                />
                <Text style={styles.smallText}>Already have an account?⠀
                    <Text style={styles.smallTextlink} onPress={() => { navigation.navigate("login") }}>Login</Text>
                </Text>
            </View>
            {/* <Text style={styles.subheading}>⎯⎯⎯  or ⎯⎯⎯</Text>
            <View style={styles.oauth}>
                <ButtonThemed text='Google' onPress={handleSignup} type='google' />
                <ButtonThemed text='Github' onPress={handleSignup} type='github' />
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    signup: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
        // borderStyle: 'solid',
        // borderWidth: 2,
        // borderColor: 'green'
    },
    loginform: {
        // borderStyle: 'solid',
        // borderWidth: 2,
        // borderColor: 'blue',
        width: "80%"
    },
    heading: {
        color: '#ffffff',
        fontSize: 40,
        padding: 24,
        // fontFamily: 'Roboto',
        // borderStyle: 'solid',
        // borderWidth: 2,
        // borderColor: 'red'
    },
    text: {
        color: '#f2f2f2',
        alignSelf: 'flex-start',
        fontSize: 25,
        paddingTop: '5%',
        // fontFamily: 'Roboto'
    },
    subheading: {
        color: 'grey',
        fontSize: 25,
        padding: 20,
        // borderStyle: 'solid',
        // borderWidth: 2,
        // borderColor: 'red'
    },
    smallText: {
        color: '#f2f2f2',
        alignSelf: 'center',
        fontSize: 15,
        paddingTop: '5%',
        // fontFamily: 'Roboto'
    },
    smallTextlink: {
        color: 'blue',
        textDecorationLine: 'underline'
    }
});



export default Signup;
