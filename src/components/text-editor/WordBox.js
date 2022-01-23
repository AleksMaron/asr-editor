import React, { Component } from "react";
import { Text } from "react-native";

class WordBox extends Component {
  render() {
    return(
      <Text>{this.props.children}</Text>
    );
  }
}

export default WordBox;

