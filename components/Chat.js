import React from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
//used to determine the OS currently in use)
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [
        /*
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        */
      ],
    }
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  componentDidMount() {
    //inputted name from Start screen
    let name = this.props.route.params.name;

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
}

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
    //title on top of the screen
    this.props.navigation.setOptions({ title:name });
    return(
      <View style={styles.container}>
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