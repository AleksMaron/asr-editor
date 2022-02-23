import { List } from 'immutable';

function getData() {
  const rawData = require('./Amyloidosis Awareness.MP4.json');
  let timecodes = [];
  let data = new List();

  for (let subtitle of rawData.recording.segment) {
    if (subtitle.traceback.item['@type']) {
      data = data.push({
        confidence: subtitle.traceback.item.confidence,
        type: subtitle.traceback.item['@type'],
        orth: subtitle.traceback.item.orth,
        start: subtitle.traceback.item.samples['@start'],
        end: subtitle.traceback.item.samples['@end']
      });

      timecodes.push({
        start: subtitle.traceback.item.samples['@start'],
        end: subtitle.traceback.item.samples['@end']
      });
  
    } else {
      for (const word of subtitle.traceback.item) {
        if(word['@type'] !== "punctuation") {
          data = data.push({
            confidence: word.confidence,
            type: word['@type'],
            orth: word.orth,
            start: word.samples['@start'],
            end: word.samples['@end']
          });

          timecodes.push({
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
  return {data, timecodes};
}

export function divideDataToSubtitles(data) {
  let dividedData = [];
  const maxLineLength = 42;
  let currentLineLength = data.get(0).orth.length + 1;
  let isNewSubtitle = false;
  let isLineBreak = false;
  
  for (const [index, word] of data.entries()) {
    if (word.type === "punctuation") {
      continue;
    }

    const next = data.get(index + 1);

    if (next) {
      if (next.type !== "punctuation") {
        if ((next.orth.length + currentLineLength) < maxLineLength) {
          currentLineLength += next.orth.length + 1;
        } else {
          isLineBreak = true;
          currentLineLength = next.orth.length + 1;
        }
      } else {
        word.orth = word.orth + next.orth;
        isLineBreak = true;
        currentLineLength = next.orth.length + 1; //???
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
          start: index,
        });

        isLineBreak = false;
        isNewSubtitle = false;
      } else if (isLineBreak) {
        dividedData.push({
          orth: "",
          start: index,
        });

        isLineBreak = false;
        isNewSubtitle = true;
      } else {
        dividedData.push({
          orth: " ",
          start: index,
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

export default getData;


