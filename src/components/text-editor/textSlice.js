

export default function getData() {
  const rowData = require('./Amyloidosis Awareness.MP4.json');
  const dataString = JSON.stringify(rowData);
  const stringWithoutAt = dataString.replaceAll("@", "");
  const dataWithoutAt = JSON.parse(stringWithoutAt);
  const { List } = require('immutable');
  let data = List();
  Array.prototype.forEach.call(dataWithoutAt.recording.segment, subtitle => {
    Array.prototype.forEach.call(subtitle.traceback.item, word => {
      if(word.type !== "punctuation") {
        data = data.push({
          confidence: word.confidence,
          type: word.type,
          orth: word.orth,
          start: word.samples.start,
          end: word.samples.end
        });
      } else {
        data = data.push({
          type: word.type,
          orth: word.orth
        });
      }
      
    })
  });

  return data;
}

const initialData = getData();

const initialState = {
  data: initialData
}
