import React from "react";
import { Button, View, Text } from "react-native";

export default class Chat extends React.Component {
  render() {
    let name = this.props.route.params.name;
    //title on top of the screen
    this.props.navigation.setOptions({ title:name });
    
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Hello Screen1</Text>
        <Button
          title="Go to start"
          onPress={() => this.props.navigation.navigate('Start')} />
      </View>
    )
  }
}