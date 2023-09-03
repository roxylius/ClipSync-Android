import { StyleSheet } from "react-native";
import { ThemedButton, AwesomeButton } from "react-native-really-awesome-button";
import { FontAwesome } from '@expo/vector-icons';

function ButtonThemed({ text, onPress, type, fontFamily }) {
    if (type == 'google' || type == 'github') {
        // console.log(true);
        return <ThemedButton name="bruce" type="secondary" before={<FontAwesome name={type} size={30} style={styles.icon} />} style={styles.button} width={260} textSize={25} onPress={onPress} >{text}</ThemedButton>
    }
    else {
        // console.log(false)
        return <ThemedButton name="bruce" type="secondary" style={styles.button} textFontFamily={fontFamily} width={260} textSize={25} onPress={onPress} >{text}</ThemedButton>
    }

};

const styles = StyleSheet.create({
    button: {
        marginTop: '8%',
        alignSelf: "center",
        // borderStyle: 'solid',
        // borderWidth: 2,
        // borderColor: 'pink'

    },
    icon: {
        paddingRight: '9%'
    }
});

export default ButtonThemed;