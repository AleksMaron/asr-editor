import React from "react";
import { useSelector } from "react-redux";
import { Map } from 'immutable';

import {
    Editor,
    EditorState,
    RichUtils,
    convertFromRaw,
    DefaultDraftBlockRenderMap,
    convertToRaw,
} from 'draft-js';
import 'draft-js/dist/Draft.css';

import Word from "./Word";
import "./TextEditor.css";

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

function TextEditor() {
    const dispatch = useDispatch();
    const dataFromStore = useSelector(state => state.text.rawContentData);
    const blocks = convertFromRaw(dataFromStore);

    //Customizing wrapper for ContentBlock rendering
    const blockRenderMap = new Map({
        'Word': {
            element: 'span',
        }
    });
    const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);
    
    //Setting the internal state with editor
    const [editorState, setEditorState] = React.useState(
      () => EditorState.createWithContent(blocks)
    );
    
    //Customizing element for rendering ContentBlock
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
            />
        </div>
    )
}

  

export default TextEditor;


