import { StyleSheet } from "react-native";
import { ThemedButton } from "react-native-really-awesome-button";
import { FontAwesome } from '@expo/vector-icons';

function ButtonThemed({ text, onPress, type, fontFamily }) {
    if (type == 'serverStatus') {
        return <ThemedButton name="bruce" type="secondary" textFontFamily={fontFamily} width={128} height={40} textSize={15} backgroundColor={'#7fffd4'} paddingHorizontal={0} progress onPress={onPress}  >{text}</ThemedButton>
    }
    else if (type == 'localAuth') {
        return <ThemedButton name="bruce" type="secondary" style={styles.button} textFontFamily={fontFamily} width={260} textSize={25} progress={true} progressLoadingTime={4000} onPress={onPress} >{text}</ThemedButton>
    }
    else if (type == 'google' || type == 'github') {
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
    },
    icon: {
        paddingRight: '9%'
    }
});

export default ButtonThemed;