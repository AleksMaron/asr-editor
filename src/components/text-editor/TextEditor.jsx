import React from "react";
import { useSelector } from "react-redux";
import { Map } from 'immutable';
import { connect } from "react-redux";

import {
    Editor,
    EditorState,
    RichUtils,
    convertFromRaw,
    DefaultDraftBlockRenderMap,
    convertToRaw,
    CompositeDecorator
} from 'draft-js';
import 'draft-js/dist/Draft.css';

import Word from "./Word";
import "./TextEditor.css";
import { highlightWord } from "./highlightWord";

import { textUpdated } from "./textActions";
import { useDispatch } from "react-redux";


function handleKeyCommand (command, editorState, onChange) {
    const newState = RichUtils.handleKeyCommand(editorState, command); //changed

    if (newState) {
      onChange(newState);
      return 'handled';
    }

    return 'not-handled';
}

function TextEditor({currentTime}) {
    const dispatch = useDispatch();
    const dataFromStore = useSelector(state => state.text.rawContentData);
    const blocks = convertFromRaw(dataFromStore);

    // Customizing wrapper for ContentBlock rendering
    const blockRenderMap = new Map({
        'Word': {
            element: 'span',
        }
    });
    const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

    //Highlighting decorator
    const decorator = new CompositeDecorator([
      {
        strategy: highlightWord,
        // component: HighlightedWord,
        component: Word,
      }
    ]);
    
    //Setting the internal state with editor
    const [editorState, setEditorState] = React.useState(
      () => EditorState.createWithContent(blocks, decorator)
    );

    //Displaying EditorBlock inline
    function myBlockStyleFn(contentBlock) {
      return 'public-DraftStyleDefault-block';
    }
    
    // Customizing element for rendering ContentBlock
    function myBlockRenderer(contentBlock) {
      const type = contentBlock.getType();

      if (type === 'Word') {
        return {
          component: Word,
          editable: true,
        };
      }
    }

    function onChange(editorState) {
        setEditorState(editorState);
        const contentBlock = editorState.getCurrentContent();
        const rowContentData = convertToRaw(contentBlock);
        dispatch(textUpdated(rowContentData));
    }

    return (
        <div className="draft-editor-wrapper textEditor">
            <Editor 
                editorState={editorState}
                handleKeyCommand={(cmd, es) => handleKeyCommand(cmd, es, onChange)}
                onChange={onChange}
                blockRenderMap={extendedBlockRenderMap}
                blockRendererFn={myBlockRenderer}
                blockStyleFn={myBlockStyleFn}
            />
        </div>
    )
}

  

// export default TextEditor;

function mapStateToProps(state) {
  return { currentTime: state.media.currentTime };
} 

export default connect(mapStateToProps)(TextEditor);
