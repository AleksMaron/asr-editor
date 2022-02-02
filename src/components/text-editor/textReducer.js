import { List } from 'immutable';

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
      return {
        ...state,
        rawContentData: action.payload 
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
          data = data.push({
            confidence: word.confidence,
            type: word['@type'],
            orth: word.orth,
            start: word.samples['@start'],
            end: word.samples['@end']
          });
        } else {
          data = data.push({
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

  for (const [index, word] of data.entries()) {
    //Adding spaces
    if (word.type === "punctuation") {
      continue;
    }

    if (index < data.size - 1) {
        const next = data.get(index + 1);
        if (next.type !== "punctuation") {
            word.orth = `${word.orth} `;
        } else {
            word.orth = `${word.orth + next.orth} `;
        }
    } else {
        word.orth = `${word.orth}`;
    }
    
    blocks.push({
      text: word.orth,
      type: 'Word',
      key: `${word.start}`,
      data: {
          confidence: word.confidence,
          start: word.start,
          end: word.end
      }
    });
    
  };

  return {
      blocks,
      entityMap
    };
}

export const textUpdatedType = "TEXT_UPDATED";
export default textReducer;


