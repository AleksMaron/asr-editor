export default function binarySearch(arr, value, start, end) {
  if (end - start < 1) {
    const blockData = arr.get(start);
    if (blockData) {
      const [blockKey, block] = blockData;
      const data = block.getData();
      const startTC = parseFloat(data.get('start'));
      const endTC = parseFloat(data.get('end'));
      if ((value >= startTC) && 
          (value < endTC)) {
        return blockKey;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  const middle = Math.round((start + end) / 2);
  const blockData = arr.get(middle);
  if (blockData) {
    const [blockKey, block] = blockData
    const data = block.getData();
    const startTC = parseFloat(data.get('start'));
    const endTC = parseFloat(data.get('end'));
  
    if ((value >= startTC) && 
        (value < endTC)) {
      return blockKey;
    } else if (startTC < value) {
      return binarySearch(arr, value, middle + 1, end);
    } else {
      return binarySearch(arr, value, start, middle - 1);
    }
  } else {
    return undefined;
  }
}

