import getData, { divideDataToSubtitles } from './prepareTextFromJSON';

const initialData = getData();
const subtitles = divideDataToSubtitles(initialData);
const rawContentData = getRawContentFromData(subtitles.dividedData);

const initialState = {
  rawContentData: rawContentData,
  timecodes: subtitles.timecodes
};

const textReducer = (state = initialState, action) => {
  switch(action.type) {
    case textUpdatedAsyncType:
      return {
        ...state,
        rawContentData: action.payload
      };
    case wordsJoinedType:
      let newTimecodes = [];

      for (let [index, word] of state.timecodes.entries()) {
        if (word.start === action.payload.secondWordKey) {
          continue;
        }

        if (word.start === action.payload.firstWordKey) {
          const next = state.timecodes[index + 1];
          if (next) {
            newTimecodes.push({
              start: word.start,
              end: next.end
            });
          }
        } else {
          newTimecodes.push({
            start: word.start,
            end: word.end
          });
        }
      }

      return {
        ...state,
        timecodes: newTimecodes
      }
    default:
      return state;
  }
}


function getRawContentFromData(data) {
  let blocks = [];

  const entityMap = {
      word: {
          type: 'Word',
          mutability: 'MUTABLE', //???
      }
  }

  for (const word of data) {
    blocks.push({
      text: word.orth,
      type: 'Word',
      key: `${word.start}`,
      data: {
          confidence: word.confidence,
      }
    });
  }

  return {
      blocks,
      entityMap
    };
}

export const textUpdatedType = "TEXT_UPDATED";
export const textUpdatedAsyncType = "TEXT_UPDATED_ASYNC";
export const wordsJoinedType = "WORDS_JOINED";
export default textReducer;


