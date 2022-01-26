import { nanoid } from 'nanoid'
import { List, fromJS } from 'immutable';

const initialData = getData();
const rawContentData = getRawContentFromData(initialData);

// const initialState = fromJS({
//   rawContentData: rawContentData
// });

const initialState = {
  rawContentData: rawContentData
};

const textReducer = (state = initialState, action) => {
  switch(action.type) {
    case textUpdatedType:
      // return state.setIn(['rawContentData'], action.payload)
      return {
        ...state,
        rowContentData: action.payload 
      };
    default:
      return state;
  }
}

function getData() {
  const rawData = require('./Amyloidosis Awareness.MP4.json');
  let data = new List();
  for (let subtitle of rawData.recording.segment) {
    if (subtitle.traceback.item['@type']) {
      data = data.push({ //from js
        confidence: subtitle.traceback.item.confidence,
        type: subtitle.traceback.item['@type'],
        orth: subtitle.traceback.item.orth,
        start: subtitle.traceback.item.samples['@start'],
        end: subtitle.traceback.item.samples['@end']
      });
    } else {
      for (let word of subtitle.traceback.item) {
        if(word['@type'] !== "punctuation") {
          data = data.push({ //from js
            confidence: word.confidence,
            type: word['@type'],
            orth: word.orth,
            start: word.samples['@start'],
            end: word.samples['@end']
          });
        } else {
          data = data.push({ //from js
            orth: word.orth,
            type: word['@type'],
          });
        }
      }
    }
  }
  return data;
}

function getRawContentFromData(data) {
  let blocks = [];
  const entityMap = {
      word: {
          type: 'Word',
          mutability: 'MUTABLE', //???
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
          blocks.push({ //fromJS
              text: word.orth,
              type: 'Word',
              key: `${word.start}`,
              data: {
                  confidence: word.confidence,
                  start: word.start,
                  end: word.end
              }
          });
      } else {
          blocks.push({//fromJS
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

export const textUpdatedType = "TEXT_UPDATED";
export default textReducer;


