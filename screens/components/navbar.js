import { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';

//local assets
const app_logo = require('../../assets/images/new_logo.png');
const settings_logo = require('../../assets/images/setting.png');
const back_logo = require('../../assets/images/back.png');


//recieves navigator from clipboard.js
const Navbar = ({ navigator, route }) => {

    //stores screen name 
    const [screenName, setScreenName] = useState('');

    //sets screen name value from route prop
    useEffect(() => {
        console.log("route.name: ", route.name);
        setScreenName(route.name);
    }, []);

    //handle settings route
    const handleSettings = () => {
        console.log("settings image clicked");
        if (route.name === 'home')
            navigator.navigate("settings");
        else
            navigator.navigate('home');
    }

    //handle home route

    return (
        <View style={styles.topNav}>
            <Image source={app_logo} alt="app logo" style={styles.app_logo} />
            <Pressable onPress={handleSettings}>
                <Image source={screenName === 'home' ? settings_logo : back_logo} alt="app logo" style={styles.settings_logo} />
            </Pressable>
        </View >);
};

const styles = new StyleSheet.create({
    topNav: {
        left: 0,
        right: 0,
        top: 0,
        height: 80,
        backgroundColor: "#181818",
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "white"
    },
    app_logo: {
        width: 150,
        height: 60,
        marginLeft: 10
    },
    settings_logo: {
        width: 35,
        height: 35,
        marginRight: 10
    }
});

export default Navbar;