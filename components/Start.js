import React from 'react';
import { StyleSheet, View, Text, Button, ImageBackground} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import {bgi} from '../assets/images/bgi.png';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: "",
      bgColor: ""
    };
  }

    /**
   * Updates the state with the background color picked from the swatch
   * @param {*} newColor the new color used to update the state
   */
     changeBgColor = (newColor) => {
      this.setState({ bgColor: newColor });
    };

  // The colors for the swatch
  colors = {
    orange: "#f44336",
    magenta: "#e91e63",
    fucsia: "#9c27b0",
    purple: "#673ab7",
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={bgi}
          resizeMode="cover"
          style={styles.bgi}
        >
          <Text style={styles.h1}>Navigation Chat</Text>
          <View style={styles.box}>
              <TextInput
              style={styles.input}
              onChangeText={(name) => this.setState({name})}
              value={this.state.name}
              placeholder='Type your name here ...'
            />
            <View style={styles.colorSwatch}>
              <Text style={styles.subtitle}>Choose Background Color</Text>
              <View style={styles.swatches}>
                <TouchableOpacity
                  onPress={() => this.changeBgColor(this.colors.orange)}
                >
                  <View style={styles.swatch1}></View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.changeBgColor(this.colors.magenta)}
                >
                  <View style={styles.swatch2}></View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.changeBgColor(this.colors.fucsia)}
                >
                  <View style={styles.swatch3}></View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.changeBgColor(this.colors.purple)}
                >
                  <View style={styles.swatch4}></View>
                </TouchableOpacity>
              </View>
              </View>
              <Button
              style={styles.btn}
                title="Go to Chat"
                //navigate to the chat screen and pass there the name
                onPress={() => this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                  bgColor: this.state.bgColor}) }
                 />
          </View>
          </ImageBackground>
      </View>
    );
  }
}

// Styles for Start view
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#151617",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bgi: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  h1: {
    flexGrow: 1,
    flexShrink: 1,
    fontWeight: "800",
    color: "white",
    paddingTop: 60,
    fontSize: 40,
  },
  box: {
    backgroundColor: "#ffffffc4",
    flexGrow: 1,
    flexShrink: 0,
    width: "88%",
    marginBottom: 30,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 30,
    height: 260,
    minHeight: 260,
    maxHeight: 290,
    borderRadius: 20,
  },
  input: {
    flex: 1,
    height: 50,
    maxHeight: 50,
    borderColor: "gray",
    borderWidth: 1,
    width: "88%",
    padding: 5,
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 1,
    marginBottom: 10,
  },
  colorSwatch: {
    flex: 1,
    padding: 20,
    marginTop: 5,
  },
  swatches: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  swatch1: {
    width: 40,
    height: 40,
    backgroundColor: "#f44336",
    borderRadius: 40,
  },
  swatch2: {
    width: 40,
    height: 40,
    backgroundColor: "#e91e63",
    borderRadius: 40,
  },
  swatch3: {
    width: 40,
    height: 40,
    backgroundColor: "#9c27b0",
    borderRadius: 40,
  },
  swatch4: {
    width: 40,
    height: 40,
    backgroundColor: "#673ab7",
    borderRadius: 40,
  },
  btn: {
    flex: 1,
  },
  });