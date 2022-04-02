export default function convertToSMPTE(timecode, frameRate) {
  if (timecode) {
    const hours = Math.trunc(timecode / 3600);
    const minutes = Math.trunc((timecode - hours * 3600) / 60);
    const seconds = Math.trunc((timecode - hours * 3600) - minutes * 60);
    const frames = Math.round((timecode % 1) * frameRate);

    const hoursString = hours.toLocaleString(undefined, {minimumIntegerDigits: 2});
    const minutesString = minutes.toLocaleString(undefined, {minimumIntegerDigits: 2});
    const secondsString = seconds.toLocaleString(undefined, {minimumIntegerDigits: 2});
    const framesString = frames.toLocaleString(undefined, {minimumIntegerDigits: 2});
    return hoursString + ':' + minutesString + ':' + secondsString + ':' + framesString;
  } else {
    return '00:00:00:00';
  }
} 