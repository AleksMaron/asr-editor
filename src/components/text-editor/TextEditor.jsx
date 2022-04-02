import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Editor,
    EditorState,
    RichUtils,
    convertFromRaw,
    convertToRaw,
    CompositeDecorator,
    SelectionState,
    getDefaultKeyBinding,
    KeyBindingUtil
} from 'draft-js';
import 'draft-js/dist/Draft.css';

import Word from './Word';
import './TextEditor.css';
import { wordClicked, togglePlay } from '../media-card/mediaActions';
import { textUpdated, uploadTextFromFile, toggleSave } from './textActions';

import colorByConfidence from './colorByConfidence';
import binarySearch from './binarySearch';
import { getKeyAfter, getKeyBefore } from './getKeysBinary';
import WordInfo from './WordInfo';

import handleBackspace from './text-utils/handleBackspace';
import handleTextInput from './text-utils/handleTextInput';
import handleReturn from './text-utils/handleReturn';
import moveWord from './text-utils/moveWord';

function isMutatingCommand(command) {
  switch (command) {
    case 'play-pause-video':
    case 'select-previous-word':
    case 'select-next-word':
    case 'save':
      return false;
    default:
      return true;
  }
}

class TextEditor extends Component {
    constructor(props) {
      super(props);
      const compositeDecorator = new CompositeDecorator([
        {
            strategy: colorByConfidence,
            component: Word,
        }  
      ]);

      let blocks;

      if (this.props.content) {
        blocks = convertFromRaw(this.props.content);
      } else {
        this.props.uploadTextFromFile(null);
        this.props.textUpdated(this.props.isFileUploaded);
        blocks = convertFromRaw(this.props.isFileUploaded);
      }
      
      this.state = {
        editorState: EditorState.createWithContent(blocks, compositeDecorator),
        currentTimecodeRendered: 0,
        lastCurrentTime: 0,
        isScrolling: false
      }
      this.onChange = this.onChange.bind(this);
      this.handleBeforeInput = this.handleBeforeInput.bind(this);
      this.handleKeyCommand = this.handleKeyCommand.bind(this);
      this.myKeyBindingFn = this.myKeyBindingFn.bind(this);
      this.onScroll = this.onScroll.bind(this);
    }

    componentDidMount() {
      this.interval = setInterval(() =>  {
        if (!this.props.isSaved) {
          const rawContentData = convertToRaw(this.state.editorState.getCurrentContent());
          this.props.textUpdated(rawContentData);
        }
      }, 60000);
    }
    componentWillUnmount() {
      clearInterval(this.interval);
    }

    onScroll = () => {
      this.setState({isScrolling: true});
    }

    handleBeforeInput = (chars, editorState) => {
      if (this.props.isPlaying) {
        this.props.togglePlay();
      }

      if (this.props.isSaved) {
        this.props.toggleSave();
      }

      const newEditorState = handleTextInput(chars, editorState);
      if (newEditorState) {
        this.onChange(newEditorState);
        return 'handled';
      }

      return 'not-handled';
    }

    handleKeyCommand = (command, editorState, onChange) => {
      const currentContent = editorState.getCurrentContent();
      const currentSelection = editorState.getSelection();

      if (isMutatingCommand(command) && this.props.isSaved) {
        this.props.toggleSave();
      }

      let newEditorState;
      switch (command) {
        case 'backspace':
          newEditorState = handleBackspace(editorState);
          if (newEditorState) {
            this.onChange(newEditorState);
            return 'handled';
          }
          return 'not-handled';
        case 'delete':
          return 'handled';
        case 'play-pause-video':
          this.props.togglePlay();
          return 'handled';
        case 'select-previous-word':
          let keyBefore = getKeyBefore(currentContent, currentSelection.getAnchorKey());
          
          if (keyBefore) {
            let textBefore = currentContent.getBlockForKey(keyBefore).getText();
            while (keyBefore && ((textBefore === '') || (textBefore === ' ') || (textBefore === '\n'))) {
              keyBefore = getKeyBefore(currentContent, keyBefore);
              if (keyBefore) {
                textBefore = currentContent.getBlockForKey(keyBefore).getText();
              }
            }
            this.props.wordClicked(keyBefore);
          }
          return 'handled';
        case 'select-next-word':
          let keyAfter = getKeyAfter(currentContent, currentSelection.getAnchorKey());
          
          if (keyAfter) {
            let textAfter = currentContent.getBlockForKey(keyAfter).getText();
            while (keyAfter && ((textAfter === '') || (textAfter === ' ') || (textAfter === '\n'))) {
              keyAfter = getKeyAfter(currentContent, keyAfter);
              if (keyAfter) {
                textAfter = currentContent.getBlockForKey(keyAfter).getText();
              }
            }
            this.props.wordClicked(keyAfter);
          }
          return 'handled';
        case 'split-block':
          newEditorState = handleReturn(editorState);
          if (newEditorState) {
            this.onChange(newEditorState);
            return 'handled';
          }
          return 'not-handled';
        case 'save':
          const rawContentData = convertToRaw(this.state.editorState.getCurrentContent());
          this.props.textUpdated(rawContentData);
          return 'handled';
        case 'move-word-up':
          this.onChange(moveWord(editorState, 'up'));
          return 'handled';
        case 'move-word-down':
          this.onChange(moveWord(editorState, 'down'));
          return 'handled';
        default:
          const newState = RichUtils.handleKeyCommand(editorState, command);
          if (newState) {
            this.onChange(newState);
            return 'handled';
          }
      }
  
      return 'not-handled';
    }

    myKeyBindingFn = (e) => {
      switch (e.keyCode) {
        case 9:
          return 'play-pause-video';
        case 52:
          return 'select-previous-word';
        case 54:
          return 'select-next-word';
        case 83:
          if (KeyBindingUtil.hasCommandModifier(e)) {
            return 'save';
          }
          return getDefaultKeyBinding(e);
        case 38:
          if (KeyBindingUtil.hasCommandModifier(e)) {
            return 'move-word-up';
          }
          return getDefaultKeyBinding(e);
        case 40:
          if (KeyBindingUtil.hasCommandModifier(e)) {
            return 'move-word-down';
          }
          return getDefaultKeyBinding(e);
        default:
          return getDefaultKeyBinding(e);
      }
    }

    onChange = (editorState) => {
      if (this.state.isScrolling) {
        this.setState({isScrolling: false});
      }
      
      const currentStartKey = editorState.getSelection().getStartKey();

      if (currentStartKey !== this.state.currentTimecodeRendered) {
        this.props.wordClicked(currentStartKey);
        this.setState({currentTimecodeRendered: currentStartKey});
      }
      this.setState({editorState: editorState});
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.isFileUploaded) {
        nextProps.uploadTextFromFile(null);
        nextProps.textUpdated(nextProps.isFileUploaded);
        const compositeDecorator = new CompositeDecorator([
          {
              strategy: colorByConfidence,
              component: Word,
          }  
        ]);
        const blocks = convertFromRaw(nextProps.isFileUploaded);
        return {
          editorState: EditorState.createWithContent(blocks, compositeDecorator),
          currentTimecodeRendered: 0,
          lastCurrentTime: 0 
        };
      }
      if (nextProps.currentTime !== prevState.lastCurrentTime) {
        const currentContent = prevState.editorState.getCurrentContent();
        const currentTime = parseFloat(nextProps.currentTime.toFixed(3));
        let nextWordKey = getKeyAfter(currentContent, prevState.currentTimecodeRendered); 
        let prevWordKey = getKeyBefore(currentContent, prevState.currentTimecodeRendered);
        let selectionBlockKey;

        if (nextWordKey) {
          let textAfter = currentContent.getBlockForKey(nextWordKey).getText();
          while (nextWordKey && ((textAfter === '') || (textAfter === ' ') || (textAfter === '\n'))) {
            nextWordKey = getKeyAfter(currentContent, nextWordKey);
            if (nextWordKey) {
              textAfter = currentContent.getBlockForKey(nextWordKey).getText();
            }
          }
        
          if (nextWordKey) {
            const nextWordBlock = currentContent.getBlockForKey(nextWordKey);
            const data = nextWordBlock.getData();
            const start = parseFloat(data.get('start'));
            const end = parseFloat(data.get('end'));
            if ((currentTime >= start) && 
                  (currentTime < end)) {
              selectionBlockKey = nextWordKey;
            }
          }
        }
        
        if (!selectionBlockKey && prevWordKey) {
          let textBefore = currentContent.getBlockForKey(prevWordKey).getText();
          while (prevWordKey && ((textBefore === '') || (textBefore === ' ') || (textBefore === '\n'))) {
            prevWordKey = getKeyBefore(currentContent, prevWordKey);
            if (prevWordKey) {
              textBefore = currentContent.getBlockForKey(prevWordKey).getText();
            }
          }

          if (prevWordKey) {
            const prevWordBlock = currentContent.getBlockForKey(prevWordKey);
            const data = prevWordBlock.getData();
            const start = parseFloat(data.get('start'));
            const end = parseFloat(data.get('end'));
            
            if ((currentTime >= start) && 
                  (currentTime < end)) {
                  
              selectionBlockKey = prevWordKey;
            }
          }
        }

        if (!selectionBlockKey) {
          const blockMap = currentContent.getBlockMap();
          selectionBlockKey = binarySearch(blockMap._list, currentTime, 0, blockMap.size);
        }
        
        if (selectionBlockKey && (prevState.currentTimecodeRendered !== selectionBlockKey)) {
          const currentBlock = currentContent.getBlockForKey(selectionBlockKey);
          const text = currentBlock.getText();
          const updatedSelection = new SelectionState({
            anchorKey: selectionBlockKey,
            anchorOffset: 0,
            focusKey: selectionBlockKey,
            focusOffset: text.length,
          });
          const updatedState = EditorState.forceSelection(prevState.editorState, updatedSelection);
          return {
            editorState: updatedState,
            currentTimecodeRendered: selectionBlockKey,
            lastCurrentTime: nextProps.currentTime,
            isScrolling: nextProps.isScrolling ? false : false
          }
        }

        return {
          editorState: prevState.editorState,
          currentTimecodeRendered: prevState.currentTimecodeRendered,
          lastCurrentTime: nextProps.currentTime,
          isScrolling: nextProps.isScrolling ? false : false
        }
      }

      return null;
    }

    render() {
      return (
        <div className='draft-editor-wrapper textEditor' onScroll={this.onScroll}>
          <Editor 
              editorState={this.state.editorState}
              handleKeyCommand={this.handleKeyCommand}
              handleBeforeInput={this.handleBeforeInput}
              onChange={this.onChange}
              blockStyleFn={() => 'public-DraftStyleDefault-block'}
              keyBindingFn={this.myKeyBindingFn}
          />
          <WordInfo  
            editorState={this.state.editorState} 
            isScrolling={this.state.isScrolling} 
          />
        </div>
      );
    }
}

function mapStateToProps(state) {
  return { 
    currentTime: state.media.currentTime,
    isPlaying: state.media.isPlaying,
    content: state.text.rawContentData,
    isFileUploaded: state.text.isFileUploaded,
    isSaved: state.text.isSaved
  };
} 

export default connect(mapStateToProps, {
  wordClicked, 
  togglePlay, 
  textUpdated, 
  uploadTextFromFile,
  toggleSave
})(TextEditor);