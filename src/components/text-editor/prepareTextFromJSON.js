import { List } from 'immutable';

function getData(JSONstring) {
  // const rawData = require('./Amyloidosis Awareness.MP4.json');
  const rawData = JSON.parse(JSONstring);
  let data = new List();

  for (let subtitle of rawData.recording.segment) {
    const EPS = 0.001;
    let words = Array.isArray(subtitle.traceback.item) ? subtitle.traceback.item : [subtitle.traceback.item];
    for (const word of words) {
      if(word['@type'] !== "punctuation") {
        const movedStart = `${(parseFloat(word.samples['@start']) + EPS).toFixed(3)}`;
        const movedEnd = `${(parseFloat(word.samples['@end']) - EPS).toFixed(3)}`;
        data = data.push({
          confidence: word.confidence,
          type: word['@type'],
          orth: word.orth,
          start: movedStart,
          end: movedEnd
        });
      } else {
        data = data.push({
          orth: word.orth,
          type: word['@type'],
        });
      }
    }
  }
  return data;
}

function divideDataToSubtitles(data) {
  let dividedData = [];
  const maxLineLength = 42;
  let currentLineLength = data.get(0).orth.length + 1;
  let wordsCount = 1;
  let isNewSubtitle = false;
  let isLineBreak = false;
  
  for (const [index, word] of data.entries()) {
    if (word.type === "punctuation") {
      const next = data.get(index + 1);
        if (next) {
          if (word.orth === ",") {
            currentLineLength += next.orth.length + 1;
          } else {
            currentLineLength = next.orth.length + 1;
          }
        }
      continue;
    }

    const next = data.get(index + 1);

    if (next) {
      if (next.type !== "punctuation") {
        if ((next.orth.length + currentLineLength + 1) <= maxLineLength) {
          currentLineLength += next.orth.length + 1;
          wordsCount++;
        } else {
          isLineBreak = true;
          currentLineLength = next.orth.length + 1;
          wordsCount = 1;
        }
      } else {
        word.orth = word.orth + next.orth;
        if ((wordsCount < 3) && (next.orth === ",")) {
          currentLineLength += next.orth.length + 1;
          wordsCount++;
        } else {
          currentLineLength = next.orth.length + 1;
          isLineBreak = true;
          wordsCount = 1;
        }
      }

      dividedData.push({
        orth: word.orth,
        confidence: word.confidence,
        start: word.start,
        end: word.end
      });

      if (isNewSubtitle && isLineBreak) {
        dividedData.push({
          orth: "\n",
          start: word.end,
          end: word.end
        });

        isLineBreak = false;
        isNewSubtitle = false;
      } else if (isLineBreak) {
        dividedData.push({
          orth: "",
          start: word.end,
          end: word.end
        });

        isLineBreak = false;
        isNewSubtitle = true;
      } else {
        dividedData.push({
          orth: " ",
          start: word.end,
          end: word.end
        });
      }
    } else {
      dividedData.push({
        orth: word.orth,
        confidence: word.confidence,
        start: word.start,
        end: word.end
      });
    }
  }
  return dividedData;
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
          start: word.start,
          end: word.end
      }
    });
  }

  return {
      blocks,
      entityMap
    };
}

function prepareTextFromJSON(file) {
  const initialData = getData(file);
  const subtitles = divideDataToSubtitles(initialData);
  return getRawContentFromData(subtitles);
}

export default prepareTextFromJSON;


