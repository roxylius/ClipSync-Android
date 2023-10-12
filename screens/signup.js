import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Linking, StatusBar } from 'react-native';
import { SERVER_URL } from '../assets/constants.js';
import { useIsConnected } from 'react-native-offline';


//components
import ButtonThemed from './components/button.js';
import Input from './components/input.js';
import Offline from './components/offline.js';

const Signup = ({ navigation }) => {
    //set statusbar color to color of container default color
    useEffect(() => {
        StatusBar.setBackgroundColor("black");

        const interval = setInterval(() => {
            StatusBar.setBackgroundColor("black");
        }, 10000);

        return () => clearInterval(interval);
    })

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState({
        statusCode: '',
        message: ''
    });


    //const internet status function
    const isOnline = useIsConnected();


    const handleSignup = async (release) => {

        if (name == '' || email == '' || password == '') {
            //timeout on button progress
            setTimeout(release, 30);

            setAuth({ statusCode: '401', message: 'Enter The Missing User Field!' });
        }
        else {
            //timeout on button progress
            setTimeout(release, 10000);

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
            }).then(response => {
                setAuth(prevVal => ({ ...prevVal, statusCode: response.status }));
                return response.json();
            })
                .then(data => {
                    setAuth(prevVal => ({ ...prevVal, message: data.message }));
                })
                .catch(err => console.log("error", err));
        }
    };

    useEffect(() => {
        if (auth.statusCode == '200') {
            console.log(auth);
            navigation.navigate('home');
        }
    }, [auth])

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
                {auth.statusCode == '200' ? null : <Text style={[styles.smallText, styles.smallTextAlert]}>{auth.message}</Text>}
                <ButtonThemed text='Signup' onPress={handleSignup} type='localAuth'
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
            {isOnline ? null : <Offline />}
        </View>
    );
}

const styles = StyleSheet.create({
    signup: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
    },
    loginform: {
        width: "80%"
    },
    heading: {
        color: '#ffffff',
        fontSize: 40,
        padding: 24
    },
    text: {
        color: '#f2f2f2',
        alignSelf: 'flex-start',
        fontSize: 25,
        paddingTop: '5%',
    },
    subheading: {
        color: 'grey',
        fontSize: 25,
        padding: 20,
    },
    smallText: {
        color: '#f2f2f2',
        alignSelf: 'center',
        fontSize: 15,
        paddingTop: '5%',
    },
    smallTextlink: {
        color: 'blue',
        textDecorationLine: 'underline'
    },
    smallTextAlert: {
        color: 'red'
    }
});



export default Signup;
