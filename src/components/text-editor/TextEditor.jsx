import React from "react";
import getData from "./textSlice";
import {Editor, EditorState, RichUtils, convertFromRaw} from 'draft-js';

import 'draft-js/dist/Draft.css';

import './TextEditor.css';

function handleKeyCommand (command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }

    return 'not-handled';
}

function TextEditor() {
    const data = getData();    
    //Add spaces and construct words string
    const getWords = (data) => {
        // const { List } = require('immutable');
        let text = ""; //List();
        data.forEach((word, index) => {
            if (index < data.size - 1) {
                const next = data.get(index + 1);
                if (next.type !== "punctuation") {
                    // word.orth += " ";
                    // text = text.push(Word(word));
                    text += `${word.orth} `;
                } else {
                    text += `${word.orth}`;
                }
            } else {
                // text = text.push(Word(word));
                text += `${word.orth}`;
            }
        });

        const contentState = {
            entityMap: {},
            blocks: [{
              key: '18ql9',
              text: text,
              type: 'unstyled',
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
            }],
        };

        return contentState;
    }

    const contentState = getWords(data);

    const [editorState, setEditorState] = React.useState(
      () => EditorState.createWithContent(convertFromRaw(contentState)),
    );
      
    return (
        <div className="draft-editor-wrapper">
            <Editor 
                editorState={editorState}
                handleKeyCommand={handleKeyCommand}
                onChange={setEditorState}
            />
        </div>
    )
  }

  

export default TextEditor;


