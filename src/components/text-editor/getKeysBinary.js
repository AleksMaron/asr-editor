function searchForKeyBinary(blockList, keyTimecode, start, end, isGetAfter) {
  if (end - start < 1) {
    const [blockKey] = blockList.get(start);
    const currentKeyTimecode = parseFloat(blockKey);
    if (currentKeyTimecode === keyTimecode) {
      if (isGetAfter) {
        if (start >= (blockList.size - 1)) {
          return undefined;
        }
        const [key] = blockList.get(start + 1);
        return key;
      } else {
        if (start <= 0) {
          return undefined;
        }
        const [key] = blockList.get(start - 1);
        return key;
      }
    } else {
      return undefined;
    }
  }

  let middle = Math.round((start + end) / 2);
  const [blockKey] = blockList.get(middle);
  const currentKeyTimecode = parseFloat(blockKey);

  if (currentKeyTimecode === keyTimecode) {
    if (isGetAfter) {
      if (middle >= (blockList.size - 1)) {
        return undefined;
      }
      const [key] = blockList.get(middle + 1);
      return key;
    } else {
      if (middle <= 0) {
        return undefined;
      }
      const [key] = blockList.get(middle - 1);
      return key;
    }
  } else if (currentKeyTimecode < keyTimecode) {
    return searchForKeyBinary(blockList, keyTimecode, middle + 1, end, isGetAfter);
  } else {
    return searchForKeyBinary(blockList, keyTimecode, start, middle - 1, isGetAfter);
  }
}

export function getKeyBefore(currentContent, currentKey) {
  const blockMap = currentContent.getBlockMap();
  const keyTimecode = parseFloat(currentKey);
  return searchForKeyBinary(blockMap._list, keyTimecode, 0, blockMap.size, false);
}

export function getKeyAfter(currentContent, currentKey) {
  const blockMap = currentContent.getBlockMap();
  const keyTimecode = parseFloat(currentKey);
  return searchForKeyBinary(blockMap._list, keyTimecode, 0, blockMap.size, true);
}

