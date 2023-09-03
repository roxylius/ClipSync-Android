import { StyleSheet, TextInput } from "react-native";

const Input = ({ text, handleText, ifpass }) => {

    //if the input is not for password entry
    if (ifpass != true)
        return (<TextInput
            style={styles.input}
            onChangeText={handleText}
            value={text}
            autoCorrect={false}
        />);
    else
        return (<TextInput
            style={styles.input}
            onChangeText={handleText}
            value={text}
            autoCorrect={false}
            secureTextEntry={true}
        />);
};

const styles = StyleSheet.create({
    input: {
        borderStyle: 'solid',
        borderWidth: 2,
        width: '100%',
        marginTop: '2.5%',
        padding: '4.5%',
        borderColor: "#242424",
        color: 'white',
        borderRadius: 10
    }
})

export default Input;