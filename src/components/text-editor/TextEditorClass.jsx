import React, { Component } from "react";

import { connect } from "react-redux";

import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  SelectionState,
  getDefaultKeyBinding,
  Modifier
} from 'draft-js';
import 'draft-js/dist/Draft.css';

import Word from "./Word";
import "./TextEditor.css";
import { wordClicked, playOrPause } from "../media-card/mediaActions";
import { textUpdated, wordsJoined } from "./textActions";

import colorByConfidence from "./colorByConfidence";

class TextEditor extends Component {

}