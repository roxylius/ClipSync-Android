// import * as clipboard from 'expo-clipboard';
import io from 'socket.io-client';
import { SERVER_URL } from './assets/constants';
import { AppState } from 'react-native';

//local imports
import Clipsync from './clipboardModule';

//create a socket connection
const socket = io.connect(SERVER_URL);

const MyHeadlessTask = async () => {
    if (AppState.currentState === 'background') {
        console.log('[background] App is Background!');

        if (!socket.connected) {
            socket.io.on('ping', () => {
                console.log('[background] socket is working and receiving packets of data!');
            });

            socket.io.on('error', (error) => {
                console.log('[background] Error in socket connection: ', error);
                socket.connect();
            });

            socket.on('connect', () => {
                console.log('[background] successfully connected to socket!');
            });

            await socket.connect();
        }

        // clipboard event listener
        Clipsync.getClipboardContent(
            (content) => {
                console.log('Clipboard content:', content);
            },
            (error) => {
                console.error('Error getting clipboard content:', error);
            }
        );
        // console.log("text in clipboard :", text)

        // // Stringify the text before storing it in AsyncStorage
        // const stringifiedText = JSON.stringify(text);

        // const storedClipboard = await AsyncStorage.getItem('clipboard');

        // if (stringifiedText !== storedClipboard) {
        //     // Clipboard has changed
        //     console.log('Clipboard changed: ', text);

        //     // Save the new clipboard content as a string
        //     await AsyncStorage.setItem('clipboard', stringifiedText);
        // }
    }
};

export default MyHeadlessTask;

