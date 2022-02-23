import React, { useEffect } from "react";
import { useSelector, connect } from "react-redux";


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
import { useDispatch } from "react-redux";

import colorByConfidence from "./colorByConfidence";
import { useCallback } from "react";

function TextEditor(props) {
    const dispatch = useDispatch();
    const dataFromStore = useSelector(state => state.text.rawContentData);
    const blocks = convertFromRaw(dataFromStore);

    //Confidence decorator
    const compositeDecorator = new CompositeDecorator([
      {
          strategy: colorByConfidence,
          component: Word,
      }  
    ]);
    
    //Setting the internal state with editor
    const [editorState, setEditorState] = React.useState(
      () => EditorState.createWithContent(blocks, compositeDecorator)
    );

    //Displaying EditorBlock inline
    function myBlockStyleFn(contentBlock) {
      return 'public-DraftStyleDefault-block';
    }

    function handleKeyCommand (command, editorState, onChange) {
      const currentContent = editorState.getCurrentContent();
      const currentSelection = editorState.getSelection();
      const currentBlockKey = currentSelection.getAnchorKey();
      switch (command) {
        case "backspace":
          const currentBlockText = currentContent.getBlockForKey(currentBlockKey).getText();

          if (!currentSelection.isCollapsed()) {
            const newContentState = Modifier.removeRange(currentContent, currentSelection, "forward");
            const newEditorState = EditorState.push(editorState, newContentState);
            setEditorState(newEditorState);
          } else if ((currentBlockText === ' ') || (currentBlockText === '') || (currentBlockText === '\n')) {
            const prevBlockKey = currentContent.getKeyBefore(currentBlockKey);
            const nextBlockKey = currentContent.getKeyAfter(currentBlockKey);
            const nextBlockText = currentContent.getBlockForKey(nextBlockKey).getText();
            dispatch(wordsJoined(prevBlockKey, nextBlockKey));
            const removeSelection = new SelectionState({
              anchorKey: currentBlockKey,
              anchorOffset: 0,
              focusKey: nextBlockKey,
              focusOffset: nextBlockText.length,
              isBackward: false
            });

            const newState = RichUtils.handleKeyCommand(editorState, command);
            if (newState) {
              onChange(newState);
              return 'handled';
            }
          }

          return 'handled';
        case "play-pause-video":
          dispatch(playOrPause());
          return 'handled';
        case "select-previous-word":
          const keyBefore = currentContent.getKeyBefore(currentSelection.getAnchorKey());
          const previoustWordKey = currentContent.getKeyBefore(keyBefore);
          if (previoustWordKey) {
            dispatch(wordClicked(previoustWordKey));
          } 
          return 'handled';
        case "select-next-word":
          const keyAfter = currentContent.getKeyAfter(currentSelection.getAnchorKey());
          const nextWordKey = currentContent.getKeyAfter(keyAfter);
          if (nextWordKey) {
            dispatch(wordClicked(nextWordKey));
          }
          return 'handled';
        default:
          const newState = RichUtils.handleKeyCommand(editorState, command);
          if (newState) {
            onChange(newState);
            return 'handled';
          }
      }
  
      return 'not-handled';
    }

    function myKeyBindingFn(e) {
      switch (e.keyCode) {
        case 9:
          return "play-pause-video";
        case 52:
          return "select-previous-word";
        case 54:
          return "select-next-word";
        default:
          return getDefaultKeyBinding(e);
      }
    }

    const onChange = useCallback((editorState) => {
      const currentAnchorKey = editorState.getSelection().getAnchorKey();
      const currentBlockData = editorState.getCurrentContent().getBlockForKey(currentAnchorKey).getData();

      if (currentBlockData.get("confidence")) {
        if (currentAnchorKey !== props.currentTime) {
            dispatch(wordClicked(currentAnchorKey));
            return;
        }
      }

      setEditorState(editorState);
      const contentBlock = editorState.getCurrentContent();
      const rawContentData = convertToRaw(contentBlock);
      dispatch(textUpdated(rawContentData));
    }, [props.currentTime, dispatch]);

    useEffect(() => {
      const currentAnchorKey = editorState.getSelection().getAnchorKey();
      
      if (props.currentTime && (currentAnchorKey !== props.currentTime)) {
        const currentContent = editorState.getCurrentContent();
        const currentBlock = currentContent.getBlockForKey(props.currentTime);
        const text = currentBlock.getText();
        const updatedSelection = new SelectionState({
          anchorKey: props.currentTime,
          anchorOffset: 0,
          focusKey: props.currentTime,
          focusOffset: text.length,
          isBackward: false,
          hasFocus: true
        });

        const updatedState = EditorState.forceSelection(editorState, updatedSelection);
        setEditorState(updatedState);
      }
    }, [props.currentTime, editorState, setEditorState]);

    return (
        <div className="draft-editor-wrapper textEditor">
            <Editor 
                editorState={editorState}
                handleKeyCommand={(cmd, es) => handleKeyCommand(cmd, es, onChange)}
                onChange={onChange}
                blockStyleFn={myBlockStyleFn}
                keyBindingFn={myKeyBindingFn}
            />
        </div>
    )
}

function mapStateToProps(state) {
  return { 
    currentTime: state.media.currentTime,
    timecodes: state.text.timecodes
  };
} 

export default connect(mapStateToProps)(TextEditor);
// export default TextEditor;
