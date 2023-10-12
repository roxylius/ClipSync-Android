import { StyleSheet, View, Text } from 'react-native';


//recieves navigator from clipboard.js
const Offline = () => {

    return (
        <View style={styles.topNav}>
            <Text style={styles.text}>Offline</Text>
        </View >);
};

const styles = new StyleSheet.create({
    topNav: {
        left: 0,
        right: 0,
        bottom: 0,
        height: 60,
        backgroundColor: "red",
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 25,
    }
});

export default Offline;