import React from "react";
import getData from "./textSlice";
import {
    Editor,
    EditorState,
    RichUtils,
    convertFromRaw,
    DefaultDraftBlockRenderMap,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { nanoid } from 'nanoid'

import Word from "./Word";
import WordBox from "./WordBox";

function handleKeyCommand (command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }

    return 'not-handled';
}

function getRawContentFromData(data) {
    let blocks = [];
    const entityMap = {
        word: {
            type: 'Word',
            mutability: 'IMMUTABLE',
        }
    }

    data.forEach((word, index) => {
        //Adding spaces
        if (index < data.size - 1) {
            const next = data.get(index + 1);
            if (next.type !== "punctuation") {
                word.orth = `${word.orth} `;
            } else {
                word.orth = `${word.orth}`;
            }
        } else {
            word.orth = `${word.orth}`;
        }
        
        if (word.type !== "punctuation") {
            blocks.push({
                text: word.orth,
                type: 'Word',
                key: `${word.start + word.end}`,
                data: {
                    confidence: word.confidence,
                    start: word.start,
                    end: word.end
                }
            });
        } else {
            blocks.push({
                text: word.orth,
                type: 'Word',
                key: nanoid(),
            });
        }
        //Adding the word to the blocks
        
    });

    return {
        blocks,
        entityMap
      };
}



function TextEditor() {
    const data = getData();    
    //Add spaces and construct words string
    const rawContent = getRawContentFromData(data);
    const blocks = convertFromRaw(rawContent);
    
    const { Map } = require('immutable');
    const blockRenderMap = Map({
        'Word': {
            element: 'WordBox',
            wrapper: <WordBox />
        }
    });

    const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);
    
    const [editorState, setEditorState] = React.useState(
      () => EditorState.createWithContent(blocks)
    );

    function myBlockRenderer(contentBlock) {
      const type = contentBlock.getType();
      
      if (type === 'Word') {
        return {
          component: Word,
          editable: true,
        };
      }
    }

    return (
        <div className="draft-editor-wrapper">
            <Editor 
                editorState={editorState}
                handleKeyCommand={handleKeyCommand}
                onChange={setEditorState}
                blockRenderMap={extendedBlockRenderMap}
                blockRendererFn={myBlockRenderer}
            />
        </div>
    )
  }

  

export default TextEditor;


