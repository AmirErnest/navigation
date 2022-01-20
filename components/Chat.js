import React from "react";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
//used to determine the OS currently in use)
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';


import firebase from "firebase";
import "firebase/firestore";

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import CustomActions from './CustomActions';

import MapView from 'react-native-maps';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: ''
      },
      image: null,
      isConnected: false
    };
    //initialize the Firestore app
    if (!firebase.apps.length) {
      firebase.initializeApp({ // The web app's Firebase configuration
        apiKey: "AIzaSyC_ij7gGfUmYurOyxKCFdK2c18ah0q-5jc",
        authDomain: "navigation-ea9a6.firebaseapp.com",
        projectId: "navigation-ea9a6",
        storageBucket: "navigation-ea9a6.appspot.com",
        messagingSenderId: "475959884601",
        appId: "1:475959884601:web:2a4167ab3b31b795d786e8"
      });
    }

    //stores and retrieves the chat messages the users send
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  // add message to firestore
  addMessage() {
    const username = this.props.route.params.name;
    const message = this.state.messages[0];
    console.log("hereeeee", message)
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: {
        _id: this.state.uid,
        name: username,
      },
    });
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessage()
        this.saveMessages();
      })
  }

  async getMessages() {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {
    let name = this.props.route.params.name;
    
    //title on top of the screen
    this.props.navigation.setOptions({ title:name });

    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });


        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
            user: {
              _id: user.uid,
              name: name,
            },
            messages: [],
          });
        });
        this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
        this.saveMessages();

      } else {
        this.setState({ isConnected: false });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name
        }
      });
    });
    this.setState({
      messages
    });
  };
  renderInputToolbar = (props) => {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#164021',
            color: '#FFF'
          },
          left: {
            backgroundColor: '#cccfcd',
          }
        }}
      />
    )
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  //custom map view
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    let name = this.props.route.params.name;
    //background color from Start Screen
    let { bgColor } = this.props.route.params;
    return (
      <View style={(styles.container, {flex:1, backgroundColor: bgColor})}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderActions={this.renderCustomActions}
          renderInputToolbar={this.renderInputToolbar}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    );
  }
}

// Styles for Chat view
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});