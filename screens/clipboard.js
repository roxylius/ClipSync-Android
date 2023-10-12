import { Alert, StyleSheet, View, Text, Image, StatusBar, Pressable, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URL } from "../assets/constants";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import * as clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notification from 'expo-notifications';
import { useIsConnected } from 'react-native-offline';


//importing local assets 
import Clipsync from "../clipboardModule";
import ButtonThemed from './components/button.js';
import MobileIcon from '../assets/images/smartphone.png';
import LaptopIcon from '../assets/images/laptop.png';
import SendIcon from "../assets/images/send.png";
import Navbar from "./components/navbar";
import Offline from "./components/offline";

//etablishes a socket connection to the server 
const socket = io.connect(SERVER_URL);


const Clipboard = ({ navigation, route }) => {
    //sets status bar color same as the navbar 
    useEffect(() => {
        StatusBar.setBackgroundColor("#181818");
    })

    //const internet status function
    const isOnline = useIsConnected();

    //url to get user data 
    const userURL = SERVER_URL + '/api/user';

    //text for input
    const [text, setText] = useState('');

    //stores user data
    const [user, setUser] = useState({
        name: '',
        email: '',
        id: '',
        hasInfo: false
    });


    //stores all the copied message
    const [copiedMsg, setCopiedMsg] = useState('');

    //handle start and stop service
    const [start, setStart] = useState(false);
    const [countBtn, setCountBtn] = useState(0);


    //stores all the connected remote devices including itself in an array
    const [remoteDevices, setRemoteDevices] = useState([]);

    //stores my server status 
    const [serverStatus, setServerStatus] = useState('null');

    //if the internet is offline then server is unreachable
    useEffect(() => {
        if (isOnline === false) {
            setServerStatus('false');
            AsyncStorage.setItem('serverStatus', 'false');
        }

    }, [isOnline])

    //check my server status
    const checkServerStatus = async () => {
        try {
            //fetches the server 
            const reponse = await fetch(SERVER_URL);
            const statusCode = reponse.status;
            console.log("server status: ", statusCode);

            if (statusCode === 200) {
                AsyncStorage.setItem('serverStatus', 'true');
                setServerStatus('true');
            }
            else {
                AsyncStorage.setItem('serverStatus', 'false');
                setServerStatus('false');
            }

        }
        catch (error) {
            // Handle fetch error
            console.error('Error checking server status:', error.message);
            AsyncStorage.setItem('serverStatus', 'false');
            setServerStatus('false');
        }
    }

    //checks if the server status state and set to 'null' after 10min of check status action
    useEffect(() => {
        let timer;
        if (serverStatus === 'true' || 'false') {
            timer = setTimeout(() => {
                AsyncStorage.setItem('serverStatus', 'null');
                setServerStatus('null');
                console.log("timeout successfully");
            }, 2 * 60 * 1000); //2 minutes
        };

        return () => clearTimeout(timer);
    })


    //sets user data in local storage after redirecting to home
    useEffect(() => {
        if (user.name == '')
            handleUser();
        else
            console.log('Error: user still exist after logout')
    }, [])

    // ask for notification permission if no permission is given
    useEffect(() => {
        //function asking for notification permission
        const NotifPermission = async () => {
            const { status } = await Notification.requestPermissionsAsync();

            if (status !== 'granted')
                Alert.alert("failed to get permission");
        }
        NotifPermission();
    }, []);

    // //keep socket disconnected if the service hasn't started
    // useEffect(() => {
    //     if (start == false) {
    //         if(socket.connected)
    //             socket.close();
    //     }

    // }, [start])


    //function to get user data
    const handleUser = () => {
        fetch(userURL, {
            method: 'GET',
            credentials: 'include' //imp
        }).then(response => response.json())
            .then(async (data) => {
                console.log(data);
                setUser(prevVal => ({ ...prevVal, name: data.name, email: data.email, id: data._id, hasInfo: true }))

                //stores the user data in local AsyncStorage
                await AsyncStorage.setItem("id", data._id);
                await AsyncStorage.setItem("name", data.name);
                await AsyncStorage.setItem("email", data.email);

                console.log("clipboard.js user data added!");
            })
            .catch(err => console.log(err));

        setCountBtn(prevVal => prevVal + 1);
    };

    //event listener on userInfo
    useEffect(() => {
        //create a connection among devices with same account by joining same room socket   
        if (user.hasInfo === true) {
            if (countBtn === 1) {
                console.log("userInfo:", user);

                //send the device, user and socket info 
                socket.emit('join', { id: user.id, isMobile: true, device_id: socket.id });

            } else {

                console.log('socket connected');
                socket.connect();

                //socket.connect() is async but does't returns promise so you can't wait for it thus socket.id is not sent in socket.emit
                //send the device, user and socket info 
                setTimeout(() => {
                    console.log("id connection: ", user.id);
                    socket.emit('join', { id: user.id, isMobile: true, device_id: socket.id });
                }, 1000);

            }
        }
    }, [user.hasInfo, countBtn]);

    //react event listener listens for change in socket
    useEffect(() => {
        //only recieve copied text from synced devices
        socket.on("recieve_copied_message", async (data) => {
            console.log("This is copied message: ", data);
            await clipboard.setStringAsync(data.message);
        });

        //recieve the details of connected devices
        socket.on("connected_devices", async (data) => {
            console.log("data of devices recieved", data);

            //pushing the details of each device connected to the socket in array
            setRemoteDevices(prevVal => [...prevVal, data]);

            const user_id = await AsyncStorage.getItem("id");
            console.log(user_id);

            //sending personal device detail to the newly connected device to know about past socket connection
            socket.emit("existing_connection", { id: user_id, isMobile: true, device_id: socket.id });
        });



        //receives data about already connected devices to the socket
        socket.on("existing_connected_devices", (data) => {
            // setRemoteDevices()
            console.log("existing connection:", data);

            //add already connected device to socket to connected_devices array if they don't exist
            setRemoteDevices(prevVal => {
                //flag to check if device already exist in remote device array
                let isPresent = false;

                prevVal.forEach(device => {
                    if (device.device_id === data.device_id)
                        isPresent = true;
                });

                //if present in the array then return same array if not then add into array
                if (isPresent)
                    return prevVal;
                else {
                    return [...prevVal, data];
                }
            })
        });



        //recieve the device id of disconnected device
        socket.on("disconnect_remote_device", (data) => {

            //it filters the element with device_id same as socket_id then return the array remoteDevices
            setRemoteDevices(prevVal => prevVal.filter(device => device.device_id !== data.device_id));
            console.log("disconnect_remote_device: ", data.id);

        });


        //Fired when a ping packet is received from the server.
        socket.io.on("ping", () => {
            console.log("socket is working and recieving packets of data!");
        });

        //Fired upon a connection error.
        socket.io.on("error", async (error) => {
            console.log("Error in socket connection: ", error);
            await socket.connect();
        });

        //Fired upon a successful reconnection.
        socket.io.on("reconnect", (attempt) => {
            console.log("successfully connected to socket!");
        });


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    //handle clipboard change 
    const handleCliboardChange = async () => {
        const text = await clipboard.getStringAsync();
        await AsyncStorage.setItem('clipboard', text);
        setCopiedMsg(text);
    };

    //listen for clipboard changes
    useEffect(() => {
        const listener = clipboard.addClipboardListener(handleCliboardChange);

        return () => {
            listener.remove();
        }

    }, []);

    //emit the message via socket to all remote devices
    useEffect(() => {
        if (copiedMsg !== '') {

            //checks if user info is retrieved i.e. socket is connected 
            if (user.hasInfo === true) {
                socket.emit('copied_message', { message: copiedMsg, id: user.id }); //send the messages to devices on same id
            }
        }

    }, [copiedMsg]);

    const stopService = () => {
        //remove this device when disconnected from other remote device    
        socket.emit("disconnect_device", { id: user.id, device_id: socket.id });

        //it filters the element with device_id same as socket_id then return the array remoteDevices
        setRemoteDevices(prevVal => prevVal.filter(device => device.device_id === socket.id));

        //closes socket connection
        socket.close();
    };

    //handles starting and stopping socket service
    const handleService = () => {
        if (!start && isOnline) {
            handleUser();
            setStart(true);
            Clipsync.startService();
            console.log('service started');
        } else {
            stopService();
            setStart(false);
            Clipsync.stopService()
            console.log('service stopped');
        }
    }

    const handleSend = () => {
        setText('');
        setCopiedMsg(text);
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.clipboard}>
                <Navbar navigator={navigation} route={route} style={styles.navbar} />
                <View style={styles.server_status}>
                    <Text style={[styles.device_text, styles.status_text]}>Server Status: {serverStatus !== "null" ? ((serverStatus === 'true') ? 'Online🟢' : 'Offline🔴') : null}</Text>
                    {serverStatus === 'null' ? <ButtonThemed
                        text={'check Status'}
                        onPress={checkServerStatus}
                        type='serverStatus'
                    // fontFamily={"JetBrainsMonoLight"}
                    /> : null}
                </View>
                <ButtonThemed
                    text={start ? 'Stop Service' : 'Start Service'}
                    onPress={handleService}
                    type='normal'
                // fontFamily={"JetBrainsMonoLight"}
                />
                <View style={styles.sendInfo}>
                    <TextInput
                        style={styles.input_clip}
                        onChangeText={(e) => setText(e)}
                        value={text}
                        autoCorrect={false}
                    />
                    <Pressable onPress={handleSend}>
                        <Image source={SendIcon} alt="send logo" style={[styles.device_image, styles.input_send]} />
                    </Pressable>
                </View>
                <Text style={styles.heading}>Connected Devices</Text>

                <View className="connected-devices" style={styles.devicesContainer}>
                    {remoteDevices.length !== undefined ? remoteDevices.map((element, idx) => {

                        //connected device details
                        const id = element.device_id;
                        const isMobile = element.isMobile;
                        const device = isMobile ? "Mobile/Tablet" : "Laptop/Desktop";
                        const src = isMobile ? MobileIcon : LaptopIcon;

                        return (
                            <View className="device" key={idx} style={styles.device}>
                                <Image source={src} alt={device} style={styles.device_image} />
                                <Text style={styles.device_text}>{device}</Text>
                            </View >
                        );
                    }) : null
                    }
                </View>
                {isOnline === true ? null : <Offline />}
            </View >
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    clipboard: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#282828',
    },
    server_status: {
        display: "flex",
        flexDirection: 'row',
        position: 'absolute',
        top: 86,
        right: 2
    },
    status_text: {
        paddingTop: 6
    },
    heading: {
        color: 'white',
        fontSize: 30,
        // fontFamily: "helvetica",
        paddingTop: 20
    },
    device: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 20
    },
    device_image: {
        width: 50,
        height: 50,

    },
    device_text: {
        fontWeight: "bold",
        paddingLeft: 15,
        color: "white"
    },
    sendInfo: {
        display: 'flex',
        flexDirection: 'row',
        width: 250,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingRight: 20,
        paddingTop: 20,
        width: '100%'
    },
    input_clip: {
        borderStyle: 'solid',
        borderWidth: 2,
        width: '70%',
        marginTop: '2.5%',
        padding: '4.5%',
        borderColor: "grey",
        color: 'white',
        borderRadius: 10,
        marginRight: 6,
        marginLeft: 20
    },
    input_send: {
        marginTop: 7,
    }
})

export default Clipboard;