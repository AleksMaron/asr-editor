function convertToSMPTEMils(timecode) {
  const hours = Math.trunc(timecode / 3600);
  const minutes = Math.trunc((timecode - hours * 3600) / 60);
  const seconds = Math.trunc((timecode - hours * 3600) - minutes * 60);
  const mils = timecode % 1 * 1000;

  const hoursString = hours.toLocaleString(undefined, {minimumIntegerDigits: 2});
  const minutesString = minutes.toLocaleString(undefined, {minimumIntegerDigits: 2});
  const secondsString = seconds.toLocaleString(undefined, {minimumIntegerDigits: 2});
  const framesString = mils.toLocaleString(undefined, {minimumIntegerDigits: 3});
  return hoursString + ':' + minutesString + ':' + secondsString + ',' + framesString;
}

export default function getSRTFromContent(rawContentData, frameRate) {
  let srtString = '';
  let subtitleNumber = 1;
  let timecodesLine = '';
  let currentSubtitle = '';
  let isItalic = false;

  for (const [index, block] of rawContentData.blocks.entries()) {
    let blockText = block.text.replace('\r', '');
    const openTag = '<i>';
    const closeTag = '</i>';
    if (timecodesLine === '') {
      timecodesLine += convertToSMPTEMils(block.data.start) + ' --> ';
    }

    if (block.inlineStyleRanges && (block.inlineStyleRanges.length > 0)) {
      let addToLength = 0;
      for (const range of block.inlineStyleRanges) {
        const startOffset = range.offset;
        const italicLength = range.length;
        const endOffset = startOffset + italicLength;
        const blockTextLength = blockText.length;
  
        if (!isItalic) {
          blockText = [blockText.slice(0, startOffset + addToLength), openTag, blockText.slice(startOffset + addToLength)].join('');
          addToLength += openTag.length;
          if (italicLength !== blockTextLength) {
            blockText = [blockText.slice(0, endOffset + addToLength), closeTag, blockText.slice(endOffset + addToLength)].join('');
            addToLength += closeTag.length;
          } else {
            isItalic = true;
          }
        } else if (italicLength !== blockTextLength) {
          blockText = [blockText.slice(0, endOffset + addToLength), closeTag, blockText.slice(endOffset + addToLength)].join('');
          addToLength += closeTag.length;
          isItalic = false;
        }
      }
    }

    if (blockText === '\n') {
      timecodesLine += convertToSMPTEMils(block.data.start) + '\n';
      if (isItalic) {
        currentSubtitle += closeTag + '\n\n';
        isItalic = false;
      } else {
        currentSubtitle += '\n\n';
      }

      srtString += subtitleNumber + '\n' + timecodesLine + currentSubtitle;
      subtitleNumber++;
      timecodesLine = '';
      currentSubtitle = '';
    } else if (index === rawContentData.blocks.length - 1) {
      timecodesLine += convertToSMPTEMils(block.data.start) + '\n';
      if (isItalic) {
        currentSubtitle += blockText + closeTag + '\n';
        isItalic = false;
      } else {
        currentSubtitle += blockText + '\n';
      }
      srtString += subtitleNumber + '\n' + timecodesLine + currentSubtitle;
    } else if ((blockText === '') && (currentSubtitle !== '')) {
      if (isItalic) {
        currentSubtitle += closeTag + '\n';
        isItalic = false;
      } else {
        currentSubtitle += '\n';
      }
     } else {
      currentSubtitle += blockText;
    }
  }

  return srtString;
}