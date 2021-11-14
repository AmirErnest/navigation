import React from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
//used to determine the OS currently in use)
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';

import firebase from "firebase";
import "firebase/firestore";


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
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
      const message = this.state.messages;
      this.referenceChatMessages.add({
        _id: message._id,
        uid: this.state.uid,
        createdAt: message.createdAt,
        text: message.text || '',
        user: message.user,
      });
    }


  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    this.addMessage();
  }
  
  componentDidMount() {
    //inputted name from Start screen
    let name = this.props.route.params.name;
    /*
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
         },
        {
          _id: 2,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
         },
      ],
  });
  */
 this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
   if(!user) {
     firebase.auth().signInAnonymously();
   }

   //update the user state with currently active user data
   this.setState({
     uid: user.uid,
     messages: [],
   });
   this.unsubscribe = this.referenceChatMessages
    .orderBy("createdAt", "desc")
    .onSnapshot(this.onCollectionUpdate);
 });
}

componentWillUnmount() {
  // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribeChatUser(); 
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
      user: data.user,
    });
  });
    this.setState({
      messages
    });
};

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  render() {
    let name = this.props.route.params.name;
    //background color from Start Screen
    let { bgColor } = this.props.route.params;
    //title on top of the screen
    this.props.navigation.setOptions({ title:name });
    return(
      <View style={styles.container, {flex:1, backgroundColor: bgColor}}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
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